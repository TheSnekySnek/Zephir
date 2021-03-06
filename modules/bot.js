const Discord = require("discord.js");
global.commandsHandler = require('./commandHandler');

const DB = require('../modules/db')
var guildId = ""
global.client = new Discord.Client({fetchAllMembers: true});
/**
 * Declare ready event. This is triggered when the bot has logged in
 */

const filter = require('./filter.js')
client.on('ready', () => {
    console.log("Bot is logged in");
    checkNickname()
})


client.on('message', msg => {
    checkForCommand(msg)
    checkForDiscord(msg)
    filter.monitor(msg)
})

client.on('message', async message => {
  if(message.content.includes('https://www.youtube.com/watch') || message.content.includes('.gif') ||  message.content.includes('.mp4') || message.content.includes('.webm') || message.content.includes('https://clips.twitch.tv') || (message.content.includes('https://www.twitch.tv') && message.content.includes('/clip/')) ) {
    
      let R1 = message.guild.emojis.find('name', "1R")
      let R2 = message.guild.emojis.find('name', "2R")
      let R3 = message.guild.emojis.find('name', "3R")
      let R4 = message.guild.emojis.find('name', "4R")
      let R5 = message.guild.emojis.find('name', "5R")
    
    await message.react(R1)
	  await message.react(R2)
	  await message.react(R3)
	  await message.react(R4)
    await message.react(R5)
  }
});

client.on("guildMemberAdd", (member) => {
    if(member.displayName.includes("gg/") || member.displayName.includes("discord.gg")){
        member.kick("No Advertising!")
        console.log("Kicked" + member.displayName)
    }
})

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
                tc.send(rol + " " + newm.displayName + " is now... LIVE :Hype: :tada:\n" + newm.presence.game.url)
            }
        }
    }
  })


module.exports = {
    login: function(token) {
        client.login(token)  
        guildId = DB.getBotData().guild
    },
    logout: function() {
        client.destroy()
    } 
}

function checkNickname() {
    client.guilds.get(guildId).members.get(client.user.id).setNickname(DB.getBotData().nickname);
}

function checkForDiscord(msg) {
    if(msg.content.includes("gg/") && msg.content.includes("discord")){
        msg.delete()
    }
}

function checkForCommand(msg) {
    if(msg.content.indexOf('!') == 0){
        var commands = DB.getCommands()
        commands.forEach(com => {
            if(msg.content == com.command){
                if(com.reply.indexOf(",") > 0)
                {
                    var replies = com.reply.split(',')
                    var reply = replies[Math.floor(Math.random()*replies.length)]
                    if(reply.indexOf("http") > -1 && (reply.indexOf("gif") > -1 || reply.indexOf("png") > -1 || reply.indexOf("jpg") > -1)){
                        msg.channel.send({file: reply})
                    }
                    else{
                        msg.channel.send(reply)
                    }
                }
                else if(com.reply.indexOf("http") > -1 && (com.reply.indexOf("gif") > -1 || com.reply.indexOf("png") > -1 || com.reply.indexOf("jpg") > -1)){
                    msg.channel.send({file: com.reply})
                }
                else{
                    msg.channel.send(com.reply)
                }
                return
            }
        });
    }
    
    commandsHandler.handle(msg);
}