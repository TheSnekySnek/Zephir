var fs = require("fs")
const DB = require('../../modules/db')
var qr = require('qr-image');
var uuidv4 = require('uuid/v4');
var music = require('../../modules/music/music')
var Discord = require("discord.js");


//FIX
client.on('presenceUpdate', (oldm, newm) => {
  if(newm.presence.game)
  if((!oldm.presence.game || !oldm.presence.game.streaming) && newm.presence.game.streaming){
      console.log("Update")
      if(newm.roles.get('314180610631401474')){
          console.log("Streamer")
          let rep = newm.presence.game.url.replace('https://www.twitch.tv/', '')
          let tc = client.guilds.get(DB.getBotData().guild).channels.find('name', rep + '_stream')
          let rol = client.guilds.get(DB.getBotData().guild).roles.find('name', rep)
          console.log(rep)
          if(tc && rol){
              tc.send(rol + " " + newm.displayName + " is now LIVE :tada:\n" + newm.presence.game.url)
          }
      }
  }
})

module.exports = {

  rank: function (message, command, args) {
    try {
      var cns = DB.getAllCoins()
      var coins = []
      for (let i = 0; i < cns.length; i++) {
        var mem = message.guild.members.get(cns[i].user)
        if (mem && !mem.user.bot) {
          coins.push(cns[i])
        }
      }
      for (let i = 0; i < coins.length; i++) {
        coins[i].amount = totalCoins(coins[i].user)
      }
      var rank = 0
      coins.sort(compareCoins)
      for (let i = 0; i < coins.length; i++) {
        if (coins[i].user == message.author.id) {
          message.channel.send(rankEmbed(message.member, coins[i].amount, i + 1))
        }
      }
    } catch (e) {
      console.error(e);
    }
  },
  top: function (message, command, args) {
    try {
      var cns = DB.getAllCoins()
      for (let i = 0; i < cns.length; i++) {
        cns[i].amount = totalCoins(cns[i].user)
      }
      var coins = []
      for (let i = 0; i < cns.length; i++) {
        var mem = message.guild.members.get(cns[i].user)
        if (mem && !mem.user.bot) {
          coins.push(cns[i])
        }
      }
      var rank = 0
      coins.sort(compareCoins)
      var sS = 10
      if (parseInt(args[0])) {
        var p = parseInt(args[0])
        if (p < coins.length)
          sS = p
        else
          message.channel.send("Not enough people with coins :(\n\nWill display only top 10")
      }
      let embed = new Discord.RichEmbed()
        .setTitle("- Arkhos Leaderboards -")
        .setDescription("\n--------------------------------------------------------------------")
        .setColor("#dcbc3f")
        .setThumbnail("https://cdn.discordapp.com/attachments/233701911168155649/478976690895192065/leaderboard-300x300.png")
      for (let i = 0; i < sS; i++) {
        if (i >= sS - 2) {
          var walked = DB.getWalk(coins[i].user)
          var w = 0
          if (walked) {
            w = walked.meters
          }
          embed.addField("Rank #" + (i + 1), message.guild.members.get(coins[i].user).displayName + "\nArkoins: " + coins[i].amount + "\nWalked: " + w, true)
        }
        else {
          var walked = DB.getWalk(coins[i].user)
          var w = 0
          if (walked) {
            w = walked.meters
          }
          embed.addField("Rank #" + (i + 1), message.guild.members.get(coins[i].user).displayName + "\nArkoins: " + coins[i].amount + "\nWalked: " + w + "\n--------------------------\n", true)
        }
      }
      embed.addField("----------------------------------------------------------------------", "Do you even climb bro?")
      message.channel.send(embed)
    } catch (e) {
      console.error(e);
    }
  },

  avatar: function (message, command, args) {
    try {
      var id = message.author.id
      var ment = message.mentions.members.array()
      console.log(args)
      if (ment && ment.length > 0) {
        id = ment[0].id
      }
      else if (args[0]) {
        id = args[0]
      }
      console.log(id)
      var member = message.guild.members.get(id)
      if (member) {
        let embed = new Discord.RichEmbed()
          .setTitle("Avatar URL")
          .setAuthor(member.user.username + "#" + member.user.discriminator)
          .setColor("#1dbc9c")
          .setImage(member.user.avatarURL)
          .setURL(member.user.avatarURL)
        message.channel.send(embed)
      }
      else {
        message.reply("User does not exist")
      }
    } catch (e) {
      console.error(e);
    }
  },

  mb: function (message, command, args) {
    try {
      music.spinMB(args[0])
    } catch (e) {
      console.error(e);
    }
  },

  mobile: function (message, command, args) {
    try {
      var mid = message.author.id
      var mUser = DB.getMobileUser(mid)
      var tken = ""
      if (mUser) {
        tken = mUser.token
        var qr_svg = qr.image(mUser.token);
        qr_svg.pipe(require('fs').createWriteStream(mid + '.png'));
      }
      else {
        var tk = uuidv4();
        tken = tk
        DB.addMobileUser({ user: mid, token: tk })
        var qr_svg = qr.image(tk);
        qr_svg.pipe(require('fs').createWriteStream(mid + '.png'));
      }
      message.author.send("Please scan this code using the Arkhos mobile app.\n\nDO NOT SHARE THESE CODES WITH ANYONE ELSE !!!", {
        files: [{
          attachment: mid + '.png',
          name: 'UserToken.jpg'
        }]
      })
      setTimeout(() => {
        message.author.send("You can also login using the following code:")
        message.author.send(tken)
      }, 2000)
      message.channel.send("Your auth code for the mobile app has been sent to you.\n\nCheck your DMs")
        .then(console.log)
        .catch(console.error);
    } catch (e) {
      console.error(e);
    }
  },

  coins: async function (message, command, args) {
    try {
      var coins = DB.getCoins(message.author.id)
      var usr = args[0]

      if (!usr) {
        if (coins) {
          message.reply("\nYou have: " + coins.amount + " Arkoins")
        }
        else if (!coins) {
          message.channel.send("You have: 0 Arkoins")
        }
      }

      else {

        var HR = message.guild.members.get(message.author.id).highestRole.name
        var user = message.guild.members.get(usr).displayName
        var amt = parseInt(args[1])
        var usrCoins = DB.getCoins(usr)

        if ((HR == "Owner" || HR == "Co-Owner") && amt) {
          DB.setCoins(usr, usrCoins.amount + amt)
          message.channel.send("<@" + usr + "> \nTotal Arkoins Received: **" + amt + "**")
        }
      }

    }

    catch (e) {
      console.log(e)
    }
  },



  claim: async function (message, command, args) {
    try {
      switch (args[0]) {
        case "1":
          var userCoins = DB.getCoins(message.author.id).amount
          if (userCoins < REWARDS.colors) {
            message.reply("Not enough coins")
            return
          }
          if (DB.getUnlock(message.author.id, "color")) {
            message.reply("You already have unlocked colors")
            return
          }
          var res = await question(message, "This will deduct " + REWARDS.colors + " coins from your stash.\n               Would you like to continue?", ["yes", "no"])
          if (res === "yes") {
            DB.addUnlock(message.author.id, "color")
            DB.deleteCoins(message.author.id, REWARDS.colors)
            message.reply("You have unlocked the !color command")
          }
          break
        case "2":
          var userCoins = DB.getCoins(message.author.id).amount
          if (userCoins < REWARDS.specialRole) {
            message.reply("Not enough coins")
            return
          }
          var res = await question(message, "This will deduct " + REWARDS.specialRole + " coins from your stash.\n               Would you like to continue?", ["yes", "no"])
          if (res === "yes") {
            var name = await question(message, "Type the name of your new role.")
            if (name != "") {
              var type = await question(message, "Would you like this role to be private or public ?", ["private", "public"])
              addSpecialRole(message, name, type)
            }
          }
          break;
        case "3":
          var userCoins = DB.getCoins(message.author.id).amount
          if (userCoins < REWARDS.gif) {
            message.reply("Not enough coins")
            return
          }
          var res = await question(message, "This will deduct " + REWARDS.gif + " coins from your stash.\n               Would you like to continue?", ["yes", "no"])
          if (res === "yes") {
            loop1:
            do {
              var gUrl = await question(message, "Type the url of the gif")
              console.log(gUrl)
              if (gUrl == "") {
                break loop1
              }
              else if (gUrl.indexOf("http") == -1) {
                message.reply("Invalid URL")
              }
              else {
                message.channel.send(gUrl)
                var isOK = await question(message, "Is the gif correctly displayed ?", ["yes", "no"])
                if (isOK == "yes") {
                  var com = await question(message, "What should be the command ? (DO NOT SPECIFY THE '!')")
                  if (com == "") {
                    break loop1
                  }
                  else {
                    addGIF(message, gUrl, "!" + com)
                    return
                  }
                }
                else if (isOK == "") {
                  break loop1
                }
              }
            } while (true)
          }
          break;
        case "4":
          var userCoins = await DB.getCoins(message.author.id).amount
          if (userCoins < REWARDS.sound) {
            message.reply("Not enough coins")
            return
          }
          var res = await question(message, "This will deduct " + REWARDS.sound + " coins from your stash.\n               Would you like to continue?", ["yes", "no"])
          if (res === "yes") {
            var sUrl = await question(message, "Type the URL of your sound (MUST BE A DIRECT LINK)")
            if (sUrl != "") {
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
    catch (e) {
      console.log(e)
    }
  },
  purge: function (message, command, args) {
    try {
      let channel = message.channel
      let nPosts = parseInt(args[0]) + 1;
      let hasPermission = message.member.permissions.has("MANAGE_MESSAGES")
      if (hasPermission) {
        channel.fetchMessages({ limit: nPosts })
          .then(messages => {
            messages = messages.array()
            for (var i = 0; i < messages.length; i++) {
              if (!args[1] || messages[i].member.id == args[1]) {
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
    catch (e) {
      console.error(e)
    }
  }
}

function rankEmbed(user, coins, rank) {
  var wa = DB.getWalk(user.id)
  var walked = 0
  if (wa) {
    walked = wa.meters
  }
  let embed = new Discord.RichEmbed()
    .setTitle("- Arkhos User Rankings -")
    .setDescription("For " + user.displayName + "\n------------------------------------------------------------------")
    .setColor("#dcbc3f")
    .setThumbnail("https://cdn1.iconfinder.com/data/icons/school-icons-2/512/trophy_award_ribon-512.png")
    .addField("Rank", "#" + rank + "\n----------------------------", true)
    .addField("Total Arkoins Earned:", coins + "\n---------------------------", true)
    .addField("Battles Won:", 0, true)
    .addField("Battles Lost:", 0, true)
    .addField("Battle Points:", 0, true)
    .addField("Distance Walked:", walked + "m", true)
    .addField("------------------------------------------------------------------", "Do you even climb bro?")

  return embed
}

function isPatreon(user) {
  try {
    var r = user.roles.find("name", "P-1")
    console.log(r)
    if (r != null) {
      return true
    }
    return false
  }
  catch (e) {
    return false
  }

}

const REWARDS = {
  colors: 5000,
  specialRole: 25000,
  gif: 50000,
  sound: 100000
}


async function addSpecialRole(message, name, type) {
  var no = ["admin", "administrator", "owner", "developer"]
  if (no.includes(name.toLowerCase())) {
    message.reply("Invalid role name")
    return
  }
  user = message.author.id
  if (DB.getUnlock(user, "specialRole")) {
    message.reply("You already have a special role: " + pres.rewards.specialRole.name)
    return
  }
  userCoins = DB.getCoins(user).amount
  if (userCoins >= REWARDS.specialRole) {
    var role = await client.guilds.get(DB.getBotData().guild).createRole({ name: name, color: 'GREY' })
    client.guilds.get(DB.getBotData().guild).members.get(message.author.id).addRole(role.id)
    DB.addUnlock(user, "specialRole")
    DB.deleteCoins(user, REWARDS.specialRole)
    message.reply("Your new role " + name + " has been created and given to you")
  }
  else {
    message.reply("Not enough coins")
  }
}

async function addSound(message, url, com) {

  if (DB.getSound(com)) {
    message.reply("Sound already taken")
    return
  }
  var userCoins = DB.getCoins(message.author.id).amount
  console.log(userCoins)
  if (userCoins >= REWARDS.sound) {
    DB.addSound({ "alias": com, "url": url })
    DB.deleteCoins(message.author.id, REWARDS.sound)
    message.reply("Your new custom sound has been created\n\nUse it in any voice channel with !sound " + com)
  }
  else {
    message.reply("Not enough coins")
  }
}

async function addGIF(message, url, com) {
  var res = DB.getCommand(com)
  if (res) {
    message.reply("Command already taken")
    return
  }
  var userCoins = DB.getCoins(message.author.id).amount
  console.log(userCoins)
  if (userCoins >= REWARDS.gif) {
    DB.addCommand({ command: com, reply: url })
    DB.deleteCoins(message.author.id, REWARDS.specialRole)
    message.reply("Your new custom gif " + com + " has been created")
  }
  else {
    message.reply("Not enough coins")
  }
}


function question(message, text, accepted = []) {
  return new Promise(function (resolve, reject) {
    message.channel.send(text)
    if (accepted.length > 0)
      message.channel.send("Possible answers: " + accepted.join(" / "))
    var hasAnswered = false
    client.on('message', nm => {
      if (nm.channel.id == message.channel.id && nm.author.id == message.author.id && !hasAnswered && nm.content != "") {
        if (accepted.length > 0) {
          if (accepted.includes(nm.content.toLowerCase())) {
            hasAnswered = true
            resolve(nm.content.toLowerCase())
          }
          else {
            nm.reply("Please provide a correct answer")
            message.channel.send("Possible answers: " + accepted.join(" / "))
          }
        }
        else {
          hasAnswered = true
          resolve(nm.content)
        }
      }
    })
    setTimeout(() => {
      if (!hasAnswered) {
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
function compareCoins(a, b) {
  if (a.amount > b.amount)
    return -1;
  if (a.amount < b.amount)
    return 1;
  return 0;
}
function totalCoins(user) {
  var coins = DB.getCoins(user)
  var unlocks = DB.getUnlocks(user)
  console.log(unlocks)
  if (unlocks && unlocks.length > 0) {
    unlocks.forEach(unlock => {
      switch (unlock.has) {
        case "color":
          coins.amount += REWARDS.colors
          break;
        case "specialRole":
          coins.amount += REWARDS.specialRole
          break;

        default:
          break;
      }
    });
  }
  return coins.amount
}
