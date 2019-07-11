var fs = require("fs")
const DB = require('../../modules/db')
var qr = require('qr-image');
var uuidv4 = require('uuid/v4');
var music = require('../../modules/music/music')
var Discord = require("discord.js");

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
  /*april: function(message, command, args){
    try{
      console.log("APRIL")
      var n = "🐔"
      var nicknames = []

      client.guilds.get("227129311067504640").members.every((member) => {
        nicknames.push({id: member.id, nickname: member.displayName})
        return true
      })
      fs.writeFileSync("nick.json", JSON.stringify(nicknames))
      client.guilds.get("227129311067504640").members.every((member) => {
        if(member.nickname != n)
          member.setNickname(n)
        return true
      })
      var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|[\ud83c[\ude50\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
      client.on('guildMemberUpdate', (newM, oldM) => {
        if(!regex.test(newM.nickname)){
          try {
            newM.setNickname(n)
            console.log("Set nickname of " + newM.displayName)
          } catch (e) {
            console.log(e)
          }
        }
      });
    }
    catch(e){
      console.error(e)
    }
  },
  unchickenize: function(message, command, args){
    try{
      var nicks = JSON.parse(fs.readFileSync("nick.json"))
      nicks.forEach(e => {
        try {
          client.guilds.get("227129311067504640").members.get(e.id).setNickname(e.nickname)
        } catch (error) {
          
        }
        
      });
    }
    catch(e){
      console.error(e)
    }
  },*/
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
      var HR = message.guild.members.get(message.author.id).highestRole.name
      var coins = DB.getCoins(message.author.id)
      var usr = args[0]
      var amt = parseInt(args[1])

      if (!usr) {
        if (coins) {
          message.reply("\nYou have: " + coins.amount + " Arkoins")
        }
        else if (!coins) {
          message.channel.send("You have: 0 Arkoins")
        }
      }

      if (usr && isNaN(usr) && (usr != "all")) {
        message.channel.send("Invalid User ID.")
        return
      }

      if ((HR == "Owner" || HR == "Co-Owner") && (usr == "all") && (!args[1] || isNaN(args[1]))) {
      message.channel.send("Please enter a coin amount.")
      return
      }

      if ((HR == "Owner" || HR == "Co-Owner") && (usr == "all")) {
        var members = client.guilds.get(message.guild.id).members.array()
        var amt = parseInt(args[1])


        for (let i = 0; i < members.length; i++) {
            if (!DB.getCoins(members[i].id)){
              DB.addCoins(members[i].id)
              var coins = DB.getCoins(members[i].id).amount
              DB.setCoins(members[i].id, coins + 200)
              }
            DB.setCoins(members[i].id, DB.getCoins(members[i].id).amount + amt)
            }

        message.channel.send("<@" + "everyone" + "> \nTotal Arkoins Received: **" + amt + "**")
        return
      }
      if (!isNaN(usr)) {

        var HR = message.guild.members.get(message.author.id).highestRole.name
        var user = message.guild.members.get(usr).displayName
        var amt = parseInt(args[1])
        var usrCoins = DB.getCoins(usr)

        if (!args[1]) {
          message.channel.send("__" + user + "__\nArkoins: **" + usrCoins.amount + "**")
        }

        if ((HR == "Owner" || HR == "Co-Owner") && ((usrCoins.amount + amt) < 0)) {
          message.channel.send("__" + user + "__ \nArkoins: " + usrCoins.amount + "\nUser does not have **" + Math.abs(amt) + "** Arkoins.")
          return
        }

        if ((HR == "Owner" || HR == "Co-Owner") && amt) {
          DB.setCoins(usr, usrCoins.amount + amt)
          message.channel.send("<@" + usr + "> \nTotal Arkoins Received: **" + amt + "**")
        }
      }
    }
    catch(e){
      console.log(e)
    }
  },



  claim: async function (message, command, args) {
    try {
      switch (args[0]) {
        
        case "1":        
          var wallet = DB.getCoins(message.author.id)
          if (!wallet) {
            message.reply("You don't have a stash.\nType !daily to obtain a stash and start earning Arkoins!")
            return
          }        
          var userCoins = DB.getCoins(message.author.id).amount
          if (userCoins < REWARDS.colors) {
            message.reply("Not enough Arkoins.")
            return
          }

          if (DB.getUnlock(message.author.id, "color")) {
            message.reply("You've already unlocked the color command!")
            return
          }
          var res = await confirm(message, "This will deduct " + REWARDS.colors + " coins from your stash.\nWould you like to continue?")
          if (res) {
            DB.addUnlock(message.author.id, "color")
            DB.deleteCoins(message.author.id, REWARDS.colors)
            message.reply("You have unlocked the !color command")
          }
          break
        case "2":
          var wallet = DB.getCoins(message.author.id)
          if (!wallet) {
            message.reply("You don't have a stash.\nType !daily to obtain a stash and start earning Arkoins!")
            return
          }        
          var userCoins = DB.getCoins(message.author.id).amount
          if (userCoins < REWARDS.specialRole) {
            message.reply("Not enough Arkoins.")
            return
          }
          var res = await confirm(message, "This will deduct " + REWARDS.specialRole + " coins from your stash.\nWould you like to continue?")
          if (res) {
            var name = await question(message, "Type the name of your new role.")
            if (name != "") {
              var type = await question(message, "Would you like this role to be private or public ?", ["private", "public"])
              addSpecialRole(message, name, type)
            }
          }
          break;
        case "3":
          var wallet = DB.getCoins(message.author.id)
            if (!wallet) {
              message.reply("You don't have a stash.\nType !daily to obtain a stash and start earning Arkoins!")
              return
          }        
          var userCoins = DB.getCoins(message.author.id).amount
          if (userCoins < REWARDS.gif) {
            message.reply("Not enough Arkoins.")
            return
          }
          var res = await confirm(message, "This will deduct " + REWARDS.gif + " coins from your stash.\nWould you like to continue?")
          if (res) {
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
                var isOK = await confirm(message, "Is the gif correctly displayed ?")
                if (isOK) {
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
          var wallet = DB.getCoins(message.author.id)
          if (!wallet) {
            message.reply("You don't have a stash.\nType !daily to obtain a stash and start earning Arkoins!")
            return
          }        
          var userCoins = DB.getCoins(message.author.id).amount
          if (userCoins < REWARDS.sound) {
            message.reply("Not enough Arkoins.")
            return
          }
          var res = await confirm(message, "This will deduct " + REWARDS.sound + " coins from your stash.\nWould you like to continue?")
          if (res) {
            var sUrl = await question(message, "Type the URL of your sound (MUST BE A DIRECT LINK)")
            if (sUrl != "") {
              var com = await question(message, "What should be the command ? (DO NOT SPECIFY THE '!')")
              addSound(message, sUrl, com)
            }
          }
          break;
          case "5":
            var wallet = DB.getCoins(message.author.id)
            if (!wallet) {
              message.reply("You don't have a stash.\nType !daily to obtain a stash and start earning Arkoins!")
              return
            }        
            var userCoins = DB.getCoins(message.author.id).amount
            if (userCoins < REWARDS.music) {
              message.reply("Not enough Arkoins.")
              return
            }
            var res = await confirm(message, "This will deduct " + REWARDS.music + " coins from your stash.\nWould you like to continue?")
            if (res) {
              message.channel.send("<@&227173735533117440>" + "\nPlease be patient, an Admin will come help you set up your Music Bot!")
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
  
  rebot: function (message, command, args) {

  // Get the user's voiceChannel (if he is in one)
  let userVoiceChannel = message.member.voiceChannel.id;
  console.log(userVoiceChannel)
  // Return from the code if the user isn't in a voiceChannel
  if (!userVoiceChannel) {
    return;
  }

  var MB = DB.getMBinVC(userVoiceChannel)
  var HR = message.guild.members.get(message.author.id).highestRole.name
  console.log(MB)
  if (MB == null)
  return;

  if (HR == "Owner" || HR == "Admin" || HR == "Co-Owner"){
    console.log("REBOOT OWNER")
    music.stopMB(MB.id)
    music.spinMB(MB.id)

    return;
  }
  MB.mods.forEach(mod => {
    if (mod == message.author.id){
      console.log("REBOOT MOD")
      music.stopMB(MB.id)
      music.spinMB(MB.id)
  
      return;
  
    }
  })
  console.log("REBOOT NO MOD")
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
  colors: 20000,
  specialRole: 100000,
  gif: 300000,
  sound: 500000,
  music: 1000000,
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

async function confirm(message, text) {
  return new Promise(async function (resolve, reject){
    var quest = await message.channel.send(text)
    await quest.react("✅")
    await quest.react("❌")
    var filter = (reaction, usr) => usr.id == message.author.id
    var collector = quest.createReactionCollector(filter);
    collector.on('collect', r => {
      switch (r.emoji.name) {
          case "✅":
              resolve(true)
              break;
          case "❌":
              resolve(false)
              break;
          default:
              break;
      }
      quest.delete()
      collector.stop()
    });
  })
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
