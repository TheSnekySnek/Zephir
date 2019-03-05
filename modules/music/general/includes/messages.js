const request = require('request')
const cheerio = require('cheerio')

module.exports.commandHandler = function(message) {
  let key = message.content.split(' ')[0]
  let content = message.content.replace(key, '');
  let args = content.split(' ');
  key = key.replace('!', '')
  for (var i = 0; i < commands.length; i++) {
    if (commands[i].key == key) {
      commands[i].run(message, content, args)
    }
  }
}

async function isMod(id) {
  var mods = await api.getMods()
  console.log("MODS")
  console.log(mods)
  if(mods.length > 0){
    mods.forEach(mod => {
      if(mod == id)
        return true
    });
  }
  return false
}

var commands = [
  {
    key: "play",
    description: "Play a song",
    usage: "!play [name / youtube ID / youtube link / Spotify Playlist]",
    run: function(message, content, args) {
      var HR = client.guilds.get(guildID).members.get(message.author.id).highestRole.name
      if(player.isLocked() && (HR != "Owner" && HR != "Admin" && HR != "Voice Mod" && HR != "Chat Mod" && HR != "Co-Owner") && !isMod(message.member.id)){
        message.channel.send("This Music Bot is locked")
        return
      }
      if (content != "") {
        message.channel.send("Searching for `"+content.replace('!play ', '')+"`")
        search.search(message, content)
        .then(song => {
          if (song) {
            queue.add(song)
            createNewSongEmbed(message, song)
          }
        })
        .catch(err => {
          textChannel.send(err)
        })
      }
      else{
        message.reply("Please specify a term")
      }

    }
  },
  {
    key: "lyrics",
    description: "Tries to get the lyrics of a song",
    usage: "!lyrics",
    run: function(message, content, args) {

      api.getPlaying()
      .then((mbinfo) => {
        
        var sng = mbinfo.name
        if(args.length > 1){
          sng = message.content.replace("!lyrics ", "")
        }
        message.channel.send("Getting lyrics for " + sng)
        lyrics.fromSong(sng)
        .catch(err => {
          stats.error(err)
          message.channel.send("Could not get lyrics")
        })
        .then(lyr => {
          console.log(lyr)
          let l2 = lyr.split('[')
          if (l2.length < 25 && l2.length > 2) {
            let embed = new Discord.RichEmbed()
            .setTitle("**"+sng+"**")
            .setAuthor("Lyrics", client.user.avatarURL)
            .setColor("#2eaae5")
            .setFooter("Arkhos Music Bot V2 by TheSnekySnek", client.user.avatarURL)
            .setThumbnail(mbinfo.thumbnail)
            .setURL(mbinfo.link)

            for (var i = 1; i < l2.length; i++) {
              let title = l2[i].split(']')[0]
              let sd = l2[i].split(']')[1]
              if(!title.match(/.*[a-zA-Z].*/))
                title = "-"
              if(!sd.match(/.*[a-zA-Z].*/))
                sd = "-"
              console.log("TITLE: ", title)
              console.log("SD: ", sd)
              try {
                embed.addField(title, sd)
              } catch (error) {
                console.error(error)
                //message.channel.send("An error occured.\nOur team of well trained sneks is looking into it")
                return
              }
            }

            message.channel.send({embed})
            .catch(err => {
              console.error(err)
              //message.channel.send("An error occured.\nOur team of well trained sneks is looking into it")
            })
          }
          else if (l2.length == 1) {
            message.channel.send("\n------------------------------\n")
            var flyr = lyr.split("\n\n")
            for (let i = 0; i < flyr.length; i++) {
              message.channel.send(flyr[i])
              .catch(err => {
                console.error(err)
                //message.channel.send("An error occured.\nOur team of well trained sneks is looking into it")
              })
            }
          }
          else{
            message.channel.send("Lyrics are unavailable for this song :(")
          }

        })
      })
    }
  },
  {
    key: "skip",
    description: "Skips the current song or the specified song from the queue",
    usage: "!skip ([number])",
    run: async function(message, content, args) {
      console.log("SKIP")
      if (args[1]) {
        let num = parseInt(args[1])
        if (num) {
          let qu = await api.getQueue(botId);
          let nq = qu
          nq.splice(num,1)
          await api.setQueue(nq)
          message.channel.send("Song was removed from the queue")
        }
        else {
          message.channel.send("Invalid argument")
        }
      }
      else {
        player.skip(message);
      }
    }
  },
  {
    key: "loop",
    description: "loops the current song",
    usage: "!skip ([number])",
    run: async function(message, content, args) {
      await player.loop(message)
    }
  },
  {
    key: "setavatar",
    description: "sets the bot's avatar",
    usage: "!setavatar ([url])",
    run: async function(message, content, args) {
      var HR = client.guilds.get(guildID).members.get(message.author.id).highestRole.name
      if((HR != "Owner" && HR != "Admin" && HR != "Voice Mod" && HR != "Chat Mod" && HR != "Co-Owner") && !isMod(message.member.id)){
        message.channel.send("Check your privileges")
        return
      }
      client.user.setAvatar(request(content))
      message.channel.send("Request submitted. Allow up to 10 minutes for it to update")
    }
  },
  {
    key: "lock",
    description: "loops the current song",
    usage: "!skip ([number])",
    run: async function(message, content, args) {
      await player.lock(message)
    }
  },
  {
    key: "unlock",
    description: "loops the current song",
    usage: "!skip ([number])",
    run: async function(message, content, args) {
      await player.unlock(message)
    }
  }/*,
  {
    key: "skipnext",
    description: "Skips a batch of songs",
    usage: "!skipnext [number]",
    run: async function(message, content, args) {
      let t = parseInt(args[1])
      if (t) {
        let qu = await api.getQueue(botId);
        let nq = qu
        nq.splice(0,t)
        await api.updateMBQueue(botId, nq)
        player.skip(message)
        if (t > qu.length) {
          message.channel.send("Skipped " + qu.length + " songs")
        }
        else if (t == 0) {
          message.channel.send("No songs were skipped ...")
        }
        else {
          message.channel.send("Skipped " + t + " songs")
        }
      }
      else{
        message.channel.send("Please provide a valid number")
      }
    }
  }*/,
  {
    key: "np",
    description: "Displays the current song",
    usage: "!np",
    run: function(message, content, args) {
      let time = player.time();
      api.getPlaying()
      .then((mbinfo) => {
        let embed = new Discord.RichEmbed()
        .setTitle("**"+mbinfo.name+"**")
        .setAuthor("Song added by " + mbinfo.added_by, client.user.avatarURL)
        .setColor("#2eaae5")
        .setFooter("Arkhos Music Bot V2 by TheSnekySnek", client.user.avatarURL)
        .setThumbnail(mbinfo.thumbnail)
        .setURL(mbinfo.link)
        .addField("Timestamp", fancyTimeFormat(time.time) + " / " + fancyTimeFormat(time.song))

        message.channel.send({embed});
      })
    }
  },
  {
    key: "queue",
    description: "Displays the songs in the queue",
    usage: "!queue",
    run: async function(message, content, args) {
      let qu = await api.getQueue();
      if (qu.length > 0) {
        let embed = new Discord.RichEmbed()
        .setAuthor(client.user.username + " queue", client.user.avatarURL)
        .setColor("#2eaae5")
        .setFooter("Arkhos Music Bot V2 by TheSnekySnek", client.user.avatarURL)
        .setThumbnail(qu[0].thumbnail);

        for (var i = 0; i < qu.length; i++) {
          if (i < 23) {
            embed.addField(i + ". " + qu[i].name, "Duration: " + fancyTimeFormat(qu[i].duration) + "\nAdded by: " + qu[i].added_by);
          }
          else {
            embed.addField("And " + (qu.length - i) + " more", "...");
            break;
          }
        }


        message.channel.send({embed});
      }
      else {
        message.channel.send("The queue is empty. Add a new song by using !play")
      }

    }
  },
  {
    key: "clear",
    description: "Clears the queue",
    usage: "!clear",
    run: function(message, content, args) {
      var HR = client.guilds.get(guildID).members.get(message.author.id).highestRole.name
      if(player.isLocked() && (HR != "Owner" && HR != "Admin" && HR != "Voice Mod" && HR != "Chat Mod" && HR != "Co-Owner") && !isMod(message.member.id)){
        message.channel.send("This Music Bot is locked")
        return
      }
      api.setQueue([]).then(message.reply("The queue is now as empty as your soul"));
    }
  },
  {
    key: "pa",
    description: "Adds a song to the playlist",
    usage: "!pa [song]",
    run: async function(message, content, args) {
      var HR = client.guilds.get(guildID).members.get(message.author.id).highestRole.name
      if((HR != "Owner" && HR != "Admin" && HR != "Voice Mod" && HR != "Chat Mod" && HR != "Co-Owner") && !isMod(message.member.id)){
        message.channel.send("Check your privileges")
        return
      }
      let pl = await api.getPlaylist(playlistID);
      let song = await search.search(message, content);
      let playlist = pl.playlist;
      if(!isInPLaylist(song.yt, playlist)){
        playlist.push(song)
        await api.setPlaylist(playlist);
        message.reply(song.name + " was added to the playlist")
      }
      else {
        console.log("duplicate", content);
        message.reply(song.name + " is already in the playlist")
      }
    }
  },
  {
    key: "pd",
    description: "Removes a song from the playlist",
    usage: "!pd [number]",
    run: async function(message, content, args) {
      var HR = client.guilds.get(guildID).members.get(message.author.id).highestRole.name
      if((HR != "Owner" && HR != "Admin" && HR != "Voice Mod" && HR != "Chat Mod" && HR != "Co-Owner") && !isMod(message.member.id)){
        message.channel.send("Check your privileges")
        return
      }
      let pl = await api.getPlaylist(playlistID);
      let playlist = pl.playlist;
      playlist.splice(parseInt(content), 1);
      await api.setPlaylist(playlist);
      message.reply("Song has been removed from the playlist")
      
    }
  },
  {
    key: "change",
    description: "Inverts 2 songs",
    usage: "!change [number] [number]",
    run: async function(message, content, args) {
      var HR = client.guilds.get(guildID).members.get(message.author.id).highestRole.name
      if(player.isLocked() && (HR != "Owner" && HR != "Admin" && HR != "Voice Mod" && HR != "Chat Mod" && HR != "Co-Owner") && !isMod(message.member.id)){
        message.channel.send("This Music Bot is locked")
        return
      }
      let fn = parseInt(args[1])
      let sn = parseInt(args[2])
      if(fn != null && sn != null){
        let qu = await api.getQueue(botId)
        if (fn < qu.length && sn < qu.length) {
          let a = qu[fn]
          qu[fn] = qu[sn]
          qu[sn] = a
          await api.updateMBQueue(botId, qu)
          message.channel.send("Songs have been changed")
        }
        else{
          message.channel.send("Number > Queue")
        }
      }
      else {
        message.channel.send("Invalid numbers")
      }
    }
  },
  /*{
    key: "newspotify",
    description: "Creates a playlist from Spotify",
    usage: "!newspotify",
    run: async function(message, content, args) {
      if(args[1].indexOf("spotify.com") > -1 && args[2]){
        let term = args[1]
        let plname = args[2]
        message.channel.send("Converting Spotify playlist.\n\nThis will take some time")
        console.log("Spotify Playlist")
        let options = {
          uri: "https://tubetify.com/generate",
          headers: {
            "Referer": "https://tubetify.com/"
          },
          method: "POST",
          formData:{
            "spotify-tracks": term
          }
        }
        request(options, async function(error, response, body) {
          if(error){
            console.log(error)
            return
          }
          else{
            let songArr = []
            let $ = cheerio.load(body);
            $('#tubetify-generate tr').each(function (i, elem) {
              let so = $(this).find('td > a').text().replace('#', '')
              console.log(so)
              songArr.push(so)
            });
            let pl = await api.createMBPlaylist(botId, plname)
            let qu = []
            console.log("QUEUE", qu)
            let mse = await message.channel.send("Adding " + songArr.length + " songs - Aproximate time: " + parseInt(songArr.length*0.5) + " seconds")
            for (var i = 0; i < songArr.length; i++) {
              if(songArr[i]){
                console.log(songArr[i])
                try{
                  let info = await ytdl.getInfo("https://www.youtube.com/watch?v=" + songArr[i])
                  let sData = {
                    yt: info["video_id"],
                    link: info["video_url"],
                    name: info["title"],
                    duration: info["length_seconds"],
                    thumbnail: info["thumbnail_url"],
                    added_by: message.author.username
                  }
                  qu.push(sData)
                  if(i % 10 == 1)
                    mse.edit("Adding " + (songArr.length-i) + " songs - Aproximate time: " + parseInt((songArr.length - i) * 0.5 ) + " seconds")
                  console.log("Added " + sData.name)
                }
                catch(e){
                  console.log(e)
                }
                
              }
            }
            console.log("Updated Playlist", pl)
            await api.updateMBPlaylist(botId, qu, pl)
            message.channel.send("Success: Playlist has been created")
          }
        })
      }
    }
  },*/
  {
    key: "playlist",
    description: "Displays the playlist",
    usage: "!playlist",
    run: async function(message, content, args) {
      let pl = await api.getPlaylist(playlistID);
      let playlist = pl.playlist;
      let embs = Math.ceil(playlist.length / 25);
      for (var k = 0; k < embs; k++) {
        let embed = new Discord.RichEmbed()
        .setAuthor("Playlist page " + (k+1), client.user.avatarURL)
        .setColor("#2eaae5")
        .setFooter("Arkhos Music Bot V2 by TheSnekySnek", client.user.avatarURL)
        .setThumbnail(playlist[k*25].thumbnail);

        for (var i = 0; i < 25; i++) {
          if (playlist[k*25+i]) {
            embed.addField(k*25+i + ". " + playlist[k*25+i].name, "Duration: " + fancyTimeFormat(playlist[k*i].duration));
          }
          else{
            message.channel.send({embed})
            return;
          }
        }
        message.channel.send({embed})
      }
    }
  },
  {
    key: "time",
    description: "Get's the timestamp of the song",
    usage: "!time",
    run: function(message, content, args) {
      let time = player.time();
      message.reply(fancyTimeFormat(time.time) + " / " + fancyTimeFormat(time.song))
    }
  },
  {
    key: "commands",
    description: "Displays this message",
    usage: "!commands",
    run: function(message, content, args) {
      displayCommands(message)
    }
  }
]

function createNewSongEmbed(message, song) {
  queue.getTime()
  .then((queueTime) => {
    let pTime = player.time();
    if (!pTime || !pTime.time || !pTime.song) {
      pTime.time = 0
      pTime.song = 0
    }
    let embed = new Discord.RichEmbed()
    .setTitle("**"+song.name+"**")
    .setAuthor(message.author.username + " has added a song", message.author.avatarURL)
    .setColor("#2eaae5")
    .setFooter("Arkhos Music Bot V2 by TheSnekySnek", client.user.avatarURL)
    .setThumbnail(song.thumbnail)
    .setURL(song.link)
    .addField("Duration", fancyTimeFormat(song.duration))
    .addField("Starts in", fancyTimeFormat(queueTime + (pTime.song - pTime.time)))

    message.channel.send({embed});
  })

}

function displayCommands(message){
  let embed = new Discord.RichEmbed()
  .setTitle("**Music Bot Commands**")
  .setAuthor("Help", client.user.avatarURL)
  .setColor("#2eaae5")
  .setFooter("Arkhos Music Bot V2 by TheSnekySnek", client.user.avatarURL)
  .setThumbnail("http://bacula.us/wp-content/uploads/2016/01/icon-build.png")
  let comms = commands
  for (var i = 0; i < comms.length; i++) {
    embed.addField(comms[i].usage, comms[i].description)
  }
  message.channel.send({embed})
}

function isInPLaylist(id, playlist) {
  for (var i = 0; i < playlist.length; i++) {
    if(playlist[i].yt == id){
      return true;
    }
  }
  return false;
}

function fancyTimeFormat(time)
{
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = time % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}
