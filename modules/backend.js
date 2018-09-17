const jwt = require('jsonwebtoken');
const DB = require('../modules/db')
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
const express = require('express')
var spawn = require('child_process').spawn;
const app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);
var music = require('../modules/music/music')
const fs = require('fs')

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

global.socketC = io

io.on('connection', function(socket){
    socket.on('getBot', function(msg){
        if(verifyID(msg.jwt))
        socket.emit('getBot', DB.getBotData())
    })
    socket.on('setBot', function(msg){
        if(verifyID(msg.jwt)) {
            DB.saveBotData(msg.data)
            restart()
        }
    })
    socket.on('getBattleMobs', function(msg){
        if(verifyID(msg.jwt))
            socket.emit('getBattleMobs', getBattleMobs())
    })
    socket.on('getBattleItems', function(msg){
        if(verifyID(msg.jwt))
            socket.emit('getBattleItems', getBattleItems())
    })
    socket.on('setBattleMobs', function(msg){
        if(verifyID(msg.jwt)){
            var def = JSON.parse(fs.readFileSync("modules/commands/defaults/defbattles.json"))
            def.mobs = msg.data
            fs.writeFileSync("modules/commands/defaults/defbattles.json", JSON.stringify(def))
            setBattleMobs(msg.data)
        }  
    })
    socket.on('setBattleItems', function(msg){
        if(verifyID(msg.jwt)){
            var def = JSON.parse(fs.readFileSync("modules/commands/defaults/defbattles.json"))
            def.items = msg.data
            fs.writeFileSync("modules/commands/defaults/defbattles.json", JSON.stringify(def))
            setBattleItems(msg.data)
        }
    })
    socket.on('getBattleSettings', function(msg){
        if(verifyID(msg.jwt))
        socket.emit('getBattleSettings', DB.getBattleSettings())
    })
    socket.on('setBattleSettings', function(msg){
        if(verifyID(msg.jwt))
            DB.setBattleSettings(msg.data)
    })
    socket.on('getCommands', function(msg){
        if(verifyID(msg.jwt))
        socket.emit('getCommands', DB.getCommands())
    })
    socket.on('addCommand', function(msg){
        if(verifyID(msg.jwt))
        DB.addCommand(msg.data)
    })
    socket.on('deleteCommand', function(msg){
        if(verifyID(msg.jwt))
        DB.deleteCommand(msg.data)
    })
    socket.on('getRoles', function(msg){
        if(verifyID(msg.jwt))
        socket.emit('getRoles', DB.getRoles())
    })
    socket.on('getUserRoles', function(msg){
        var mbUser = DB.getMobileUserToken(msg.token)
        if(!mbUser)
            return
        var roles = DB.getRoles()
        var uniqueRoles = []
        roles.forEach(role => {
            var add = true
            for (let i = 0; i < uniqueRoles.length; i++) {
                if(uniqueRoles[i].name == role.name){
                    add = false
                }
            }
            if(add){
                role.has = false
                uniqueRoles.push(role)
            }
                
        });
        function compare(a,b) {
            if (a.name < b.name)
              return -1;
            if (a.name > b.name)
              return 1;
            return 0;
          }
          
        uniqueRoles.sort(compare);
        client.guilds.get(DB.getBotData().guild).members.get(mbUser.user).roles.array().forEach(usrRole => {
            uniqueRoles.forEach(role => {
                if(role.name == usrRole.name){
                    role["has"] = true
                }
            });
        });
        

        socket.emit('getUserRoles', uniqueRoles)
    })
    socket.on('getUserChannels', function(msg){
        var mbUser = DB.getMobileUserToken(msg.token)
        if(!mbUser)
            return
        var channs = DB.getChannels()
        var channels = []
        channs.forEach(channel => {
            if(!client.guilds.get(DB.getBotData().guild).channels.find("name", channel.alias))
                return
            let permission = client.guilds.get(DB.getBotData().guild).channels.find("name", channel.alias).permissionOverwrites.get(mbUser.user);
            if(permission)
                channel["has"] = true
            else
                channel["has"] = false
            channels.push(channel)
        });
        function compare(a,b) {
            if (a.alias < b.alias)
              return -1;
            if (a.alias > b.alias)
              return 1;
            return 0;
          }
          
        channels.sort(compare);  

        socket.emit('getUserChannels', channels)
    })
    socket.on('addRole', function(msg){
        if(verifyID(msg.jwt))
        DB.addRole(msg.data)
    })
    socket.on('deleteRole', function(msg){
        if(verifyID(msg.jwt))
        DB.deleteRole(msg.data)
    })
    socket.on('setRole', function(msg){
        var mbUser = DB.getMobileUserToken(msg.token)
        if(!mbUser)
            return
        var roles = DB.getRoles()
        roles.forEach(role => {
            if(role.name == msg.name){
                if(msg.has){
                    client.guilds.get(DB.getBotData().guild).members.get(mbUser.user).addRole(client.guilds.get(DB.getBotData().guild).roles.find('name', role.name))
                }
                else{
                    client.guilds.get(DB.getBotData().guild).members.get(mbUser.user).removeRole(client.guilds.get(DB.getBotData().guild).roles.find('name', role.name))
                } 
            }
        })
    })

    socket.on('setChannel', function(msg){
        var mbUser = DB.getMobileUserToken(msg.token)
        if(!mbUser)
            return
        var channels = DB.getChannels()
        channels.forEach(channel => {
            if(channel.alias == msg.name){
                if(!msg.has){
                    let permission = client.guilds.get(DB.getBotData().guild).channels.find("name", channel.alias).permissionOverwrites.get(mbUser.user);
                    if(permission){
                        permission.delete()
                        console.log("Show", channel.alias)
                    }
                }
                else{
                    let selChannel = client.guilds.get(DB.getBotData().guild).channels.find('name', channel.alias);
                    if(selChannel){
                        client.guilds.get(DB.getBotData().guild).channels.find("name", channel.alias).overwritePermissions(client.guilds.get(DB.getBotData().guild).members.get(mbUser.user), {
                        'READ_MESSAGES': false,
                        'READ_MESSAGE_HISTORY': false
                        })
                        console.log("Hide", channel.alias)
                    }
                } 
            }
        })
    })

    socket.on('getSounds', function(msg){
        if(verifyID(msg.jwt))
        socket.emit('getSounds', DB.getSounds())
    })
    socket.on('addSound', function(msg){
        if(verifyID(msg.jwt))
        DB.addSound(msg.data)
    })
    socket.on('deleteSound', function(msg){
        if(verifyID(msg.jwt))
        DB.deleteSound(msg.data)
    })

    socket.on('getChannels', function(msg){
        if(verifyID(msg.jwt))
        socket.emit('getChannels', DB.getChannels())
    })
    socket.on('addChannel', function(msg){
        if(verifyID(msg.jwt))
        DB.addChannel(msg.data)
    })
    socket.on('deleteChannel', function(msg){
        if(verifyID(msg.jwt))
        DB.deleteChannel(msg.data)
    })

    socket.on('getMBs', function(msg){
        if(verifyID(msg.jwt))
        socket.emit('getMBs', DB.getMBs())
    })
    socket.on('stopMB', function(msg){
        if(verifyID(msg.jwt)){
            console.log(msg.data)
            music.stopMB(msg.data)
            DB.setMBState(msg.data, false)
        }
    })
    socket.on('startMB', function(msg){
        if(verifyID(msg.jwt)){
            console.log(msg.data)
            music.spinMB(msg.data)
            DB.setMBState(msg.data, true)
        }
    })
    socket.on('addMB', function(msg){
        if(verifyID(msg.jwt))
        DB.addMB(msg.data)
        if(msg.data.enabled){
            music.spinMB(msg.data.id)
        }
    })
    socket.on('deleteMB', function(msg){
        if(verifyID(msg.jwt))
        DB.deleteMB(msg.data)
    })
    socket.on('getCHs', function(msg){
        if(verifyID(msg.jwt)){
            var vcs = []
            var tcs = []
            var CHs = client.guilds.get(DB.getBotData().guild).channels.array()
            CHs.forEach(ch => {
            if(ch.type == "voice"){
                vcs.push({
                    id: ch.id,
                    name: ch.name
                }) 
            }
            if(ch.type == "text"){
                tcs.push({
                    id: ch.id,
                    name: ch.name
                }) 
            }
            });
            vcs.sort(compare)
            tcs.sort(compare)
        }
            socket.emit('getCHs', {vcs: vcs, tcs, tcs})
    })
    socket.on('getSong', function(msg){
        var mbUser = DB.getMobileUserToken(msg.token)
        if(mbUser){
            var userID = mbUser.user
            if(userID){
                var vc = client.guilds.get(DB.getBotData().guild).members.get(userID).voiceChannel
                if(vc){
                    vcID = vc.id
                    if(vcID){
                        var mb = DB.getMBinVC(vcID)
                        console.log("USER DATA")
                        console.log(vc.id);
                        console.log(msg);
                        console.log(mb)
                        if(mb && mb.id && mb.playing){
                            if(mb.playing.thumbnail.indexOf("sddefault") < 0)
                                mb.playing.thumbnail = mb.playing.thumbnail.replace("default", "sddefault")
                            socket.emit('gsong', {id: mb.id, data: mb.playing})
                            return
                        }
                    }
                }     
            }
        }
        socket.emit('disco')
    })
    socket.on('skipSong', function(msg){
        var mbUser = DB.getMobileUserToken(msg.token)
        if(mbUser){
            var userID = mbUser.user
            if(userID){
                var vc = client.guilds.get(DB.getBotData().guild).members.get(userID).voiceChannel
                if(vc){
                    vcID = vc.id
                    if(vcID){
                        var mb = DB.getMBinVC(vcID)
                        if(mb.id && mb.playing){
                            console.log(mb.id, userID)
                            music.skipMB(mb.id, userID)
                            return
                        }
                    }
                }     
            }
        }
        socket.emit('disco')
    })
    socket.on('addSong', function(msg){
        var mbUser = DB.getMobileUserToken(msg.token)
        if(mbUser){
            var userID = mbUser.user
            if(userID){
                var vc = client.guilds.get(DB.getBotData().guild).members.get(userID).voiceChannel
                if(vc){
                    vcID = vc.id
                    if(vcID){
                        var mb = DB.getMBinVC(vcID)
                        if(mb.id && mb.playing){
                            console.log(mb.id, userID)
                            music.addSongMB(mb.id, msg.username , msg.title)
                            return
                        }
                    }
                }     
            }
        }
        socket.emit('disco')
    })
    socket.on('getUserInfo', function(msg){
        var mbUser = DB.getMobileUserToken(msg.token)
        if(mbUser){
            var userID = mbUser.user
            if(userID){
                var user = client.guilds.get(DB.getBotData().guild).members.get(userID)
                if(user){
                    console.log(user.user.avatarURL)
                    socket.emit('userInfo', {name: user.displayName, pic: user.user.avatarURL})
                    return
                }
                
            }
        }
        socket.emit('invalidUser')
    })
    socket.on('getPlaylist', function(msg){
        var mbUser = DB.getMobileUserToken(msg.token)
        if(mbUser){
            var userID = mbUser.user
            if(userID){
                var vc = client.guilds.get(DB.getBotData().guild).members.get(userID).voiceChannel
                if(vc){
                    vcID = vc.id
                    if(vcID){
                        var mb = DB.getMBinVC(vcID)
                        if(mb.id && mb.playing){
                            socket.emit("playlist", DB.getMBPlaylist(mb.playlist))
                            return
                        }
                    }
                }     
            }
        }
        socket.emit('disco')
    })
    socket.on('getQueue', function(msg){
        var mbUser = DB.getMobileUserToken(msg.token)
        if(mbUser){
            var userID = mbUser.user
            if(userID){
                var vc = client.guilds.get(DB.getBotData().guild).members.get(userID).voiceChannel
                if(vc){
                    vcID = vc.id
                    if(vcID){
                        var mb = DB.getMBinVC(vcID)
                        if(mb.id && mb.playing){
                            socket.emit("queue", mb.queue)
                            return
                        }
                    }
                }     
            }
        }
        socket.emit('disco')
    })
    socket.on('getStreams', function(msg){
        var User = DB.getMobileUserToken(msg.token)
        if(User){
            var userID = User.user
            if(userID){
                console.log(userID)
                var streamers = []
                var members = client.guilds.get(DB.getBotData().guild).members.array()
                members.forEach(member => {
                    if(member.presence.game && member.presence.game.streaming && !member.user.bot){
                        var url = member.presence.game.url
                        console.log(url)
                        var twitchUser = member.presence.game.url.replace("https://www.twitch.tv/", "")
                        console.log(twitchUser)
                        var preview = "https://static-cdn.jtvnw.net/previews-ttv/live_user_" + twitchUser + "-400x225.jpg"
                        console.log(preview)
                        var title = member.presence.game.name
                        console.log(title)
                        streamers.push({url: url, tUser: twitchUser, preview: preview, title: title})
                    }
                });
                socket.emit('streams', streamers)
            }
        }
        socket.emit('disco')
    })
    socket.on('doDaily', function(msg){
        var User = DB.getMobileUserToken(msg.token)
        if(User){
            var userID = User.user
            if(userID){
                if(!DB.getDailyUser(userID)){
                    DB.addDailyUser(userID)
                    if(!DB.getCoins(userID))
                        DB.addCoins(userID)
                        
                    var coins = DB.getCoins(userID).amount
                    DB.setCoins(userID, coins+400)
                }

            }
        }
        socket.emit('disco')
    })
    socket.on('walkCoins', function(msg){
        var User = DB.getMobileUserToken(msg.token)
        if(User){
            var userID = User.user
            if(userID){
                var coins = DB.getCoins(userID).amount
                DB.setCoins(userID, coins + msg.meters)
                var hM = DB.getWalk(userID)
                if(hM){
                    DB.setWalk(userID, msg.meters + hM.meters)
                }
                else{
                    DB.addWalk(userID, msg.meters)
                }
                client.guilds.get(DB.getBotData().guild).channels.get('228046069735489536').send(client.guilds.get(DB.getBotData().guild).members.get(userID).displayName + " just finished walking " + msg.meters + " meters.")
            }
        }
        socket.emit('disco')
    })
    socket.on('getDailyInfo', function(msg){
        console.log("GTI")
        var User = DB.getMobileUserToken(msg.token)
        if(User){
            var userID = User.user
            if(userID){
                var isAble = true
                console.log("GTI")
                if(DB.getDailyUser(userID)){
                    isAble = false
                }
                socket.emit('dailyInfo', {canGet: isAble})
            }
        }
        socket.emit('disco')
    })
});

function compare(a,b) {
    if (a.name < b.name)
      return -1;
    if (a.name > b.name)
      return 1;
    return 0;
  }
function restart() {
    global.bot.logout();
    global.bot.login(DB.getBotData().token)
}

//Force Login
app.use(function (req, res, next) {
    if(req.cookies.jwt !== undefined){
        var decoded = jwt.verify(req.cookies.jwt,'98378f6f0i327hf982f0328774z837290hz4')
        if(decoded.user){
            next()
        }
        else{
            res.redirect('/login');
        }
    }
    else{
        if(req.url == "/login" || req.url.indexOf("/vendor") > -1 || req.url.indexOf("/js") > -1 || req.url.indexOf("/css") > -1 || req.url.indexOf("/images") > -1 || req.url.indexOf("/fonts") > -1) {
            next()
        }
        else{
            res.redirect('/login');
        }
        
    }
});

//Paths

app.get('/', function (req, res) {
    res.sendFile(global.appRoot + '/dashboard/index.html')
})
app.get('/login', function (req, res) {
    res.sendFile(global.appRoot + '/dashboard/login.html')
})


//API

app.post('/login',function(req,res){
    var user_name = req.body.user;
    var password = req.body.password;
    var admin = DB.getAdmin()
    if(admin.user === user_name && admin.password == password){
        const JWTToken = jwt.sign({
                user: user_name
            },
                '98378f6f0i327hf982f0328774z837290hz4',
            {
                expiresIn: '24h'
            }
        );
        res.cookie('jwt',JWTToken, { maxAge: 86400000, httpOnly: false });
        res.redirect('/')
    }
    else{
        res.redirect('/login')
    }
});


app.use(express.static('dashboard'))


module.exports = {
    startServer: function() {
        http.listen(1337, function(){
        });
    }
}


function verifyID(tok) {
    var decoded = jwt.verify(tok,'98378f6f0i327hf982f0328774z837290hz4')
    if(decoded.user){
        return true
    }
    return false
}

function verifyMobile(tok) {
    var user = DB.getMobileUserToken(tok)
    if(user.name)
        return true
    return false
}





