
  
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
          textChannel.reply("The playlist does not contain this ID")
          return
        })
        .then(song => {
          console.log(song)
          if (song) {
            queue.add(song)
            queue.getTime()
            .then((queueTime) => {
              let pTime = player.time();
              if (!pTime || !pTime.time || !pTime.song) {
                pTime.time = 0
                pTime.song = 0
              }
              let embed = new Discord.RichEmbed()
              .setTitle("**"+song.name+"**")
              .setColor("#2eaae5")
              .setFooter("Arkhos Music Bot V2 by TheSnekySnek", client.user.avatarURL)
              .setThumbnail(song.thumbnail)
              .setURL(song.link)
              .addField("Duration", fancyTimeFormat(song.duration))
              .addField("Starts in", fancyTimeFormat(queueTime + (pTime.song - pTime.time)))

              textChannel.send({embed});
            })
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