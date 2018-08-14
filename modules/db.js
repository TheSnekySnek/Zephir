

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('data/db.json')
const db = low(adapter)

if(global.setupUser != ""){
    db.defaults({ 
        admin: {
            user: global.setupUser,
            password: global.setupPassword
        },
        bot: {
            nickname: "",
            token: "",
            guild: ""
        },
        mobile: [],
        music: {
            mb: [],
            live: [],
            playlist: []
        },
        commands: [],
        roles: [],
        sounds: [],
        channels: [],
        coins: [],
        unlocks: []
        })
  .write()
}

module.exports.getMBs = function() {
    return db.get('music.mb')
     .value()
}
module.exports.getMB = function(botId) {
    return db.get('music.mb')
     .find({id: botId})
     .value()
}
module.exports.getMBinVC = function(vcID) {
    return db.get('music.mb')
     .find({vc: vcID})
     .value()
}
module.exports.getMBPlaylist = function(plId) {
    return db.get('music.playlist')
     .find({id: plId})
     .value()
}
module.exports.addMB = function(data) {
    return db.get('music.mb')
     .push(data)
     .write()
}
module.exports.deleteMB = function(data) {
    return db.get('music.mb')
     .remove({ id: data })
     .write()
 }
module.exports.setMBQueue = function(botId, queue) {
    return db.get('music.mb')
     .find({"id": botId})
     .assign({"queue": queue})
     .write()
 }
 module.exports.setMBState = function(botId, state) {
    return db.get('music.mb')
     .find({"id": botId})
     .assign({"enabled": state})
     .write()
 }
 module.exports.setMBPlaying = function(botId, data) {
    return db.get('music.mb')
     .find({"id": botId})
     .assign({"playing": data})
     .write()
 }
 module.exports.setMBPlaylist = function(id, pl) {
    return db.get('music.playlist')
     .find({"id": id})
     .assign({"playlist": pl})
     .write()
 }

module.exports.getMobileUser = function(id) {
    return db.get('mobile')
     .find({user: id})
     .value()
}
module.exports.getMobileUserToken = function(id) {
    return db.get('mobile')
     .find({token: id})
     .value()
}
module.exports.addMobileUser = function(data) {
    return db.get('mobile')
     .push(data)
     .write()
}

module.exports.getAdmin = function() {
   return db.get('admin')
    .value()
}


module.exports.getCommands = function() {
    return db.get('commands')
     .value()
 }
 module.exports.getCommand = function(com) {
    return db.get('commands')
     .find({command: com})
     .value()
 }
 module.exports.addCommand = function(data) {
    return db.get('commands')
     .push(data)
     .write()
 }
 module.exports.deleteCommand = function(data) {
    return db.get('commands')
     .remove({ command: data })
     .write()
 }

 module.exports.getRoles = function() {
    return db.get('roles')
     .value()
 }
 module.exports.getRole = function(alias) {
    return db.get('roles')
     .find({"alias": alias})
     .value()
 }
 module.exports.addRole = function(data) {
    return db.get('roles')
     .push(data)
     .write()
 }
 module.exports.deleteRole = function(data) {
    return db.get('roles')
     .remove({ alias: data })
     .write()
 }

 module.exports.getSounds = function() {
    return db.get('sounds')
     .value()
 }
 module.exports.getSound = function(alias) {
    return db.get('sounds')
     .find({"alias": alias})
     .value()
 }
 module.exports.addSound = function(data) {
    return db.get('sounds')
     .push(data)
     .write()
 }
 module.exports.deleteSound = function(data) {
    return db.get('sounds')
     .remove({ alias: data })
     .write()
 }


 module.exports.getChannels = function() {
    return db.get('channels')
     .value()
 }
 module.exports.getChannel = function(alias) {
    return db.get('channels')
     .find({"alias": alias})
     .value()
 }
 module.exports.addChannel = function(data) {
    return db.get('channels')
     .push(data)
     .write()
 }
 module.exports.deleteChannel = function(data) {
    return db.get('channels')
     .remove({ alias: data })
     .write()
 }




module.exports.getBotData = function() {
    return db.get('bot')
     .value()
 }
 module.exports.saveBotData = function(data) {
    return db.set('bot', data)
    .write()
 }

 module.exports.addCoins = function(user) {
    return db.get('coins')
     .push({"user": user, "amount": 0})
     .value()
 }
 module.exports.getCoins = function(user) {
    return db.get('coins')
     .find({"user": user})
     .value()
 }
 module.exports.getAllCoins = function() {
    return db.get('coins')
     .value()
 }
 module.exports.setCoins = function(user, amount) {
    return db.get('coins')
     .find({"user": user})
     .assign({"user": user, "amount": amount})
     .write()
 }
 module.exports.addDailyUser = function(user) {
    return db.get('dailyUsers')
     .push({user: user})
     .write()
 }
 module.exports.emptyDailyUser = function(user) {
    return db.set('dailyUsers', [])
    .write()
 }
 module.exports.getDailyUser = function(user) {
    return db.get('dailyUsers')
    .find({"user": user})
    .value()
 }
 module.exports.deleteCoins = function(user, amount) {
     var coins = db.get('coins')
     .find({"user": user})
     .value().amount
     coins -= amount

    return db.get('coins')
     .find({"user": user})
     .assign({"user": user, "amount": coins})
     .write()
 }


 module.exports.getUnlocks = function(user) {
    return db.get('unlocks')
     .find({"user": user})
     .value()
 }
 module.exports.getUnlock = function(user, unlock) {
    return db.get('unlocks')
     .find({"user": user, "has": unlock})
     .value()
 }
 module.exports.addUnlock = function(user, unlock) {
    return db.get('unlocks')
     .push({"user": user, "has": unlock})
     .write()
 }