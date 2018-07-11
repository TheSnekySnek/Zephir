const Discord = require("discord.js");
const commandsHandler = require('./commandHandler');
const DB = require('../modules/db')
var guildId = ""
global.client = new Discord.Client();
/**
 * Declare ready event. This is triggered when the bot has logged in
 */
client.on('ready', () => {
    console.log("Bot is logged in");
    checkNickname()
})


client.on('message', msg => {
    checkForCommand(msg)
    checkForDiscord(msg)
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
    if(msg.content.includes("gg/")){
        msg.destroy()
    }
}

function checkForCommand(msg) {
    var commands = DB.getCommands()
    commands.forEach(com => {
        if(msg.content.indexOf(com.command) == 0){
            if(com.reply.indexOf(","))
            {
                var replies = com.reply.split(',')
                com.reply = replies[Math.floor(Math.random()*replies.length)]
            }
            if(com.reply.indexOf("http") > -1 && (com.reply.indexOf("gif") > -1 || com.reply.indexOf("png") > -1 || com.reply.indexOf("jpg") > -1)){
                msg.channel.send({file: com.reply})
            }
            else{
                msg.channel.send(com.reply)
            }
            return
        }
    });
    commandsHandler.handle(msg);
}