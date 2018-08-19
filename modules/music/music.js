const DB = require('../../modules/db')
const fork = require('child_process').fork;
var path = require('path');
const fs = require('fs')

var mbs = []

module.exports = {

    spinMB: function(id) {
        var mbData = DB.getMB(id)
        var program = path.resolve('modules/music/general/index.js');
        var parameters = [];
        var options = {
        stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ]
        };

        var child = fork(program, parameters, options);
        console.log("Child Forked")
        child.stdout.on('data', function(data) {
            console.log(data.toString());
            socketC.emit("mbdebug", data.toString())
        });
        child.on('message', message => {
            try {
            console.log("msg is")
            console.log(message)
            var m = JSON.parse(message)
            switch (m.type) {
                case "ready":
                    child.send(JSON.stringify({
                        type: "start",
                        token: mbData.token,
                        botId: id, 
                        guild: DB.getBotData().guild,
                        tc: mbData.tc,
                        vc: mbData.vc,
                        playlist: mbData.playlist
                    }))
                    break;

                case "getqueue":
                    var mb = DB.getMB(id)
                    child.send(JSON.stringify({
                        type: "queue",
                        data: mb.queue
                    }))
                    break;

                case "getplaying":
                    var mb = DB.getMB(id)
                    child.send(JSON.stringify({
                        type: "playing",
                        data: mb.playing
                    }))
                    break;

                case "getplaylist":
                    var pl = DB.getMBPlaylist(m.plId)
                    child.send(JSON.stringify({
                        type: "playlist",
                        data: pl
                    }))
                    break;
                
                case "setqueue":
                    DB.setMBQueue(id, m.data)
                    break;

                case "setplaylist":
                    DB.setMBPlaylist(m.plId, m.data)
                    break;
                case "setplaying":
                    DB.setMBPlaying(id, m.data)
                    if(m.data.thumbnail.indexOf("sddefault") < 0)
                        m.data.thumbnail = m.data.thumbnail.replace("default", "sddefault")
                    socketC.emit("song", {id: id, data: m.data})
                    break;
                case "ping":
                    child.send(JSON.stringify({
                        type: "pong"
                    }))
                    break;
                default:
                    console.log(m)
                    break;
            }
            } catch (error) {
                fs.appendFile('mblogs.txt', error + "\n\n" + message, function (err) {
                });
            }
            
        });
        mbs.push({id: id, proc: child})
    },
    stopMB: function(id) {
        mbs.forEach((mb, index) => {
            if(mb.id == id){
                mb.proc.send(JSON.stringify({
                    type: "stop"
                }))
                mbs.splice(index, 1);
            }
        });
    },
    skipMB: function(id, user) {
        mbs.forEach((mb, index) => {
            if(mb.id == id){
                mb.proc.send(JSON.stringify({
                    type: "skip",
                    user: user
                }))
                return
            }
        });
    },
    addSongMB: function(id, user, name) {
        mbs.forEach((mb, index) => {
            if(mb.id == id){
                mb.proc.send(JSON.stringify({
                    type: "addSong",
                    user: user,
                    name: name
                }))
                return
            }
        });
    }

}

var MusicBots = DB.getMBs()
MusicBots.forEach(mb => {
    if(mb.enabled){
        module.exports.spinMB(mb.id)
    }
});