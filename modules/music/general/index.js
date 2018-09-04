/**
 * Initialize Discord JS and other packages
 */
global.Discord = require('discord.js');
const fs = require('fs');

/**
 * Create the Discord client
 * @type {Discord}
 */
global.client = new Discord.Client();
global.mods = ["83519111514034176", "141117321396748288"]
global.api= require('./includes/api');
global.messages = require('./includes/messages');
global.player = require('./includes/player');
global.lyrics = require('./includes/lyrics');
global.queue = require('./includes/queue');
global.search = require('./includes/search');
global.stats = require('./includes/statManager');
MH = require('./includes/mh');

client.on('warn', console.warn);

client.on('error', console.error);

client.on('disconnect', () => console.log('I just disconnected, making sure you know, I will reconnect now...'));

client.on('reconnecting', () => console.log('I am reconnecting now!'));

process.on('message', function(m) {
  MH.handle(m)
});


process.on('SIGINT', function() {
  console.log("Disconnecting...");
  client.destroy();
  setTimeout(function() {
    process.exit();
  },1000)

});

console.log("mb ready")

process.send(JSON.stringify({type: "ready"}))

function ping() {
  var hasPong = false
  function rcv(m) {
    var msg = JSON.parse(m)
    if(msg.type == "pong"){
       hasPong = true
       process.removeListener("message", rcv)
    }
  }
  process.on('message',rcv);
  process.send(JSON.stringify({
      type: "ping"
  }))

  setTimeout(function(){
    if(!hasPong){
      console.log("Disconnecting...");
      client.destroy();
      setTimeout(function() {
        process.exit();
      },1000)
    }
  }, 1000);
}
setInterval(ping, 4000);

function start(botId, token, guild, tChannel, vChannel, playlist) {
  /**
   * Declare ready event. This is triggered when the bot has logged in
   */
  client.on('ready', () => {
    console.log("Bot is logged in");
    console.log("joined")
    global.textChannel = client.guilds.get(guild).channels.get(tChannel);
    console.log("joined")
    global.voiceChannel = client.guilds.get(guild).channels.get(vChannel);
    console.log("joined")
    global.playlistID = playlist;
    console.log("joined")
    global.botId = botId

    console.log("joined")
    client.guilds.get(guild).channels.get(vChannel).join()
    .then((voice_connection) => {
      console.log("joined")
      player.start(voice_connection);
    });
  })

  /**
   * Declare message event. This is triggered when a new message is emmited
   */
  client.on('message', message => {
    if(message.channel.id == tChannel && message.content[0] == '!' && message.member.voiceChannelID == vChannel){
      console.log("New Message", message.content);
      messages.commandHandler(message);
    }
  })

  /**
   * Log the bot in the server
   */
  client.login(token);
}