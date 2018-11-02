
  
module.exports.handle = function(m){
  var msg = JSON.parse(m)
  if(msg.type){
    switch (msg.type) {
      case "start":
        start(msg.botId, msg.token, msg.guild, msg.tc, msg.vc, msg.playlist)
        break;
      case "skip":
        player.skip({author: {
          id: msg.user
        }});
        break;
      case "addSong":
        console.log(msg)
        search.search({content: msg.name, author: {username: msg.user}}, msg.name)
        .catch(err => {
          console.error(err)
          return
        })
        .then(song => {
          console.log(song)
          if (song) {
            queue.add(song)
          }
        })
        .catch(err => {
          stats.error(err)
        })
        break;
        
      case "stop":
        client.destroy();
        setTimeout(function() {
          process.exit();
        },1000)
        break;
      default:
        break;
    }
  }
}

function start(botId, token, guild, tChannel, vChannel, playlist) {
  /**
   * Declare ready event. This is triggered when the bot has logged in
   */
  client.on('ready', () => {
    console.log("Bot is logged in");

    global.textChannel = client.guilds.get(guild).channels.get(tChannel);
    global.voiceChannel = client.guilds.get(guild).channels.get(vChannel);
    global.playlistID = playlist;
    global.botId = botId
    global.guildID = guild

    client.guilds.get(guild).channels.get(vChannel).join()
    .then((voice_connection) => {
      //voice.startListening(voice_connection)
      player.start(voice_connection);
    });
  })

  /**
   * Declare message event. This is triggered when a new message is emmited
   */
  client.on('message', message => {
    if(message.channel.id == tChannel && message.content[0] == '!' && message.member && message.member.voiceChannelID == vChannel){
      console.log("New Message", message.content);
      messages.commandHandler(message);
    }
  })

  /**
   * Log the bot in the server
   */
  client.login(token);
}