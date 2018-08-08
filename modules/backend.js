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

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
    socket.on('addRole', function(msg){
        if(verifyID(msg.jwt))
        DB.addRole(msg.data)
    })
    socket.on('deleteRole', function(msg){
        if(verifyID(msg.jwt))
        DB.deleteRole(msg.data)
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
        }
    })
    socket.on('startMB', function(msg){
        if(verifyID(msg.jwt)){
            console.log(msg.data)
            music.spinMB(msg.data)
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
});
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






