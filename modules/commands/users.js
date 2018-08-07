var fs = require("fs")
const DB = require('../../modules/db')
var qr = require('qr-image');
var uuid = require('uuid/v4');
module.exports = {

  avatar: function(message, command, args) {
    try {
      var member = message.guild.members.find("id", args[0])
      if (member) {
        message.reply(member.user.avatarURL)
      }
      else {
        message.reply("User " + args[0] + " does not exist")
      }
    } catch (e) {
      console.error(e);
    }
  },

  mobile: function(message, command, args) {
    try {
      var mid = message.author.id
      var mUser = DB.getMobileUser(mid)
      if(mUser){
        var qr_svg = qr.image(mUser.token);
        qr_svg.pipe(require('fs').createWriteStream(mid + '.png'));
      }
      else{
        var tk = uuidv4();
        DB.addMobileUser({user: mid, token: tk})
        var qr_svg = qr.image(tk);
        qr_svg.pipe(require('fs').createWriteStream(mid + '.png'));
      }
      message.author.send("Please scan this code using the Arkhos mobile app", {
        files: [{
          attachment: mid + '.png',
          name: 'UserToken.jpg'
        }]
      })
      .then(console.log)
      .catch(console.error);
    } catch (e) {
      console.error(e);
    }
  },

  coins: async function(message, command, args) {
    try{
      var coins = DB.getCoins(message.author.id).amount
      if(coins)
        message.reply("You have: " + coins + " Arkoins")
      else
        message.reply("You have: 0 Arkoins")
    }
    catch(e){
      console.log(e)
    }
  },

  claim: async function(message, command, args) {
    try{
      switch (args[0]) {
        case "2":
          var userCoins = DB.getCoins(message.author.id).amount
          if(userCoins < REWARDS.specialRole){
            message.reply("Not enough coins")
            return
          }
          var res = await question(message, "This will deduct " + REWARDS.specialRole + " coins from your stash.\n               Would you like to continue?", ["yes", "no"])
          if(res === "yes"){
            var name = await question(message, "Type the name of your new role.")
            if(name != ""){
              var type = await question(message, "Would you like this role to be private or public ?", ["private", "public"])
              addSpecialRole(message, name, type)
            }
          }
            break;
          case "3":
            var userCoins = DB.getCoins(message.author.id).amount
            if(userCoins < REWARDS.gif){
              message.reply("Not enough coins")
              return
            }
            var res = await question(message, "This will deduct " + REWARDS.gif + " coins from your stash.\n               Would you like to continue?", ["yes", "no"])
            if(res === "yes"){
              loop1:
              do{
                var gUrl = await question(message, "Type the url of the gif")
                console.log(gUrl)
                if(gUrl == ""){
                  break loop1
                }
                else if(gUrl.indexOf("http") == -1){
                  message.reply("Invalid URL")
                }
                else{
                  message.channel.send(gUrl)
                  var isOK = await question(message, "Is the gif correctly displayed ?", ["yes", "no"])
                  if(isOK == "yes"){
                    var com = await question(message, "What should be the command ? (DO NOT SPECIFY THE '!')")
                    if(com == ""){
                      break loop1
                    }
                    else{
                      addGIF(message, gUrl, "!" + com)
                      return
                    }
                  }
                  else if(isOK == ""){
                    break loop1
                  }
                }
              }while(true)
            }
              break;
          case "4":
          var userCoins = await DB.getCoins(message.author.id).amount
          if(userCoins < REWARDS.sound){
            message.reply("Not enough coins")
            return
          }
          var res = await question(message, "This will deduct " + REWARDS.sound + " coins from your stash.\n               Would you like to continue?", ["yes", "no"])
          if(res === "yes"){
            var sUrl = await question(message, "Type the URL of your sound (MUST BE A DIRECT LINK)")
            if(sUrl != ""){
              var com = await question(message, "What should be the command ? (DO NOT SPECIFY THE '!')")
              addSound(message, sUrl, com)
            }
          }
            break;
        default:
          message.reply("Reward is not available yet or invalid")
          break;
      }
    }
    catch(e){
      console.log(e)
    }
  },
  purge: function(message, command, args){
    try{
      let channel = message.channel
      let nPosts = parseInt(args[0]) + 1;
      let hasPermission = message.member.permissions.has("MANAGE_MESSAGES")
      if (hasPermission) {
        channel.fetchMessages({limit: nPosts})
        .then(messages => {
          messages = messages.array()
          for (var i = 0; i < messages.length; i++) {
            if(!args[1] || messages[i].member.id == args[1]){
              messages[i].delete().catch(console.error)
            }
          }
        }).catch(e => {
          console.error
        })
      }
      else {
        message.reply("You do not have permission to execute that command")
      }
    }
    catch(e){
      console.error(e)
    }
  }/*,
  april: function(message, command, args){
    try{
      console.log("APPP")
      var n = "🐍"
      var nicknames = []
      client.guilds.get("227129311067504640").members.every((member) => {
        if(member.nickname != n)
          member.setNickname(n)
        return true
      })
    }
    catch(e){
      console.error(e)
    }
  }*/

}

function isPatreon(user){
  try{
    var r = user.roles.find("name", "P-1")
    console.log(r)
    if(r != null){
      return true
    }
    return false
  }
  catch(e){
    return false
  }
  
}

const REWARDS = {
  specialRole: 25000,
  gif: 50000,
  sound: 100000
}

async function addSpecialRole(message, name, type) {
  var no = ["admin", "administrator", "owner", "developer"]
  if(no.includes(name.toLowerCase())){
    message.reply("Invalid role name")
    return 
  }
  user = message.author.id
  if(DB.getUnlock(user, "specialRole")){
    message.reply("You already have a special role: " + pres.rewards.specialRole.name)
    return 
  }
  userCoins = DB.getCoins(user).amount
  if(userCoins >= REWARDS.specialRole){
    var role = await client.guilds.get("227129311067504640").createRole({name: name, color: 'GREY'})
    client.guilds.get("227129311067504640").members.get(message.author.id).addRole(role.id)
    DB.addUnlock(user, "specialRole")
    DB.deleteCoins(user, REWARDS.specialRole)
    message.reply("Your new role " + name + " has been created and given to you")
  }
  else{
    message.reply("Not enough coins")
  }
}

async function addSound(message, url, com) {
  
  if(DB.getSound(com)){
    message.reply("Sound already taken")
    return
  }
  var userCoins = DB.getCoins(message.author.id).amount
  console.log(userCoins)
  if(userCoins >= REWARDS.sound){
    DB.addSound({"alias": com, "url": url})
    DB.deleteCoins(message.author.id, REWARDS.sound)
    message.reply("Your new custom sound has been created\n\nUse it in any voice channel with !sound " + com)
  }
  else{
    message.reply("Not enough coins")
  }
}

async function addGIF(message, url, com) {
  var res = DB.getCommand(com)
  if(res){
    message.reply("Command already taken")
    return
  }
  var userCoins = DB.getCoins(message.author.id).amount
  console.log(userCoins)
  if(userCoins >= REWARDS.gif){
    DB.addCommand({command: com, reply: url})
    DB.deleteCoins(message.author.id, REWARDS.specialRole)
    message.reply("Your new custom gif " + com + " has been created")
  }
  else{
    message.reply("Not enough coins")
  }
}

async function addColor(message, ded = true) {
  user = message.author.id
  pres = await ArkhosAPI.getPresence(user)
  console.log(pres)
  if(pres.rewards.color){
    message.reply("You already have access to the !color command")
    return 
  }
  userCoins = await ArkhosAPI.getArkoins(user)
  console.log(userCoins)
  if(!ded){
    ArkhosAPI.enableColor(user)
    message.reply("You now have access to the !color command :tada:")
  }
  else if(userCoins >= REWARDS.color){
    ArkhosAPI.enableColor(user)
    ArkhosAPI.removeArkoins(user, REWARDS.color)
    message.reply("You now have access to the !color command :tada:")
  }
  else{
    message.reply("Not enough coins")
  }
}

function question(message, text, accepted = []){
  return new Promise(function(resolve, reject) {
    message.channel.send(text)
    if(accepted.length > 0)
      message.channel.send("Possible answers: " + accepted.join(" / "))
    var hasAnswered = false
    client.on('message', nm => {
      if(nm.channel.id == message.channel.id && nm.author.id == message.author.id && !hasAnswered && nm.content != ""){
        if(accepted.length > 0){
          if(accepted.includes(nm.content.toLowerCase())){
            hasAnswered = true
            resolve(nm.content.toLowerCase())
          }
          else{
            nm.reply("Please provide a correct answer")
            message.channel.send("Possible answers: " + accepted.join(" / "))
          }
        } 
        else{
          hasAnswered = true
          resolve(nm.content)
        }
      }
    })
    setTimeout(() => {
      if(!hasAnswered){
        hasAnswered = true
        message.reply("Your request has expired")
        resolve("")
      }
    }, 30000);
  })
}

function errMSG(message) {
  message.reply("Not available yet")
}
