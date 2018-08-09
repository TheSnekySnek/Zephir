const DB = require('../../modules/db')
const fork = require('child_process').fork;
var path = require('path');

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
                    break;
                default:
                    console.log(m)
                    break;
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
    }

}

var MusicBots = DB.getMBs()
MusicBots.forEach(mb => {
    if(mb.enabled){
        module.exports.spinMB(mb.id)
    }
});