const ytdl = require('ytdl-core');
var voice_connection;
var voice_stream;
var currSong;
var songSkipPoll = [];
var startPlaying = true;
var updatingTime = false;

module.exports = {
  start: function(connection) {
    voice_connection = connection;
    playNextSong()
    //managePlayer();
    //watchListeners();
  },
  
  skip: function(message) {
      if(mods.includes(message.author.id)){
        message.channel.send("Skipping song...")
        if (voice_stream && !voice_stream.destroyed) {
          voice_stream.destroy();
        }
        else{
          playNextSong();
        }
      }
      else{
        let usersInChannel = voiceChannel.members.array().length;
        if(!songSkipPoll.includes(message.author.id)){
          songSkipPoll.push(message.author.id)
          if(songSkipPoll.length >= (usersInChannel-1)/ 2){
            message.channel.send("Skipping song...")
            songSkipPoll = [];
            if (voice_stream && !voice_stream.destroyed) {
              voice_stream.destroy();
            }
            else{
              playNextSong();
            }
          }
          else{
            message.reply("You need " + Math.ceil(((usersInChannel-1)/ 2) - songSkipPoll.length) + " more vote(s) to skip");
          }
        }
        else{
          message.reply("You already voted")
        }
      }
  },

  time: function() {
    var obj = {time: 0, song: currSong.duration, total: 0};
    if(voice_stream){
      obj = {time: Math.floor(voice_stream.time/1000), song: currSong.duration, total: Math.floor(voice_stream.totalStreamTime/1000)};
    }
    return obj;
  }
};

function managePlayer() {
  if(voiceChannel.members.array().length > 1){
    if (!startPlaying){
      startPlaying = true;
      console.log("New Users - Start")
      playNextSong();
    }
  }
  else{
    if (startPlaying){
      startPlaying = false;
      queue.clearPlayedSongs()
      console.log("No Users - Stop")
      if (voice_stream && !voice_stream.destroyed) {
        console.log("Destoying stream")
        voice_stream.destroy();
      }
    }
  }
  setTimeout(function() {
    managePlayer();
  }, 3000)
}

function updateTime() {
  setInterval(function() {
    let time = Math.floor(voice_stream.totalStreamTime/1000)
    api.updateTime(botId, time)
  }, 1000)
}

/*function watchListeners() {
    let listeners = voiceChannel.members.array()
    let ida = []
    for (var i = 0; i < listeners.length; i++) {
      ida.push({user: listeners[i].id})  
    }
    api.updateMBInfo(botId, currSong, ida)
}*/

/*client.on('voiceStateUpdate', async (oldm, newm) => {
  try{
    if(newm.id != client.user.id){
      //if the user joined our channel
      if(newm.voiceChannel == voiceChannel && oldm.voiceChannel != voiceChannel){
        let ida = await api.getMBInfo(botId)
        ida.members.push({user: newm.id})
        api.updateMBInfo(botId, currSong, ida.members)
        console.log(newm.displayName + " has joined the VC")
      }
      else if(newm.voiceChannel != voiceChannel && oldm.voiceChannel == voiceChannel){
        let ida = await api.getMBInfo(botId)
        ida = ida.members
        for (var i = 0; i < ida.length; i++) {
          if(ida[i].user == newm.id){
            ida.splice(i, 1)
            api.updateMBInfo(botId, currSong, ida)
            console.log(newm.displayName + " has left the VC")
            return
          }
        }
      }
    }
  }
  catch(e){
    console.log(e)
  }
})*/

function playSong(song) {
  if (voice_stream && !voice_stream.destroyed) {
    return
  }
  console.log("Playing " + song.name);
  currSong = song;
  songSkipPoll = []
  const stream = ytdl(song.link, { filter : 'audioonly', quality: 'highest', highWaterMark: 32768 });
  voice_stream = voice_connection.playStream(stream, { seek: 0, volume: 0.3, bitrate: 'auto' });
  /*if(!updatingTime){
    updateTime();
    updatingTime = true;
  }*/
  voice_stream.on('start', () => {
     voice_connection.player.streamingData.pausedTime = 0;
     api.setPlaying(currSong)
  });
  voice_stream.once("end", reason => {
    console.log("player stopped because of " + reason);
    if(startPlaying){
      playNextSong();
    }
  });
  voice_stream.on("error", reason => {
    console.log(reason);
    stats.error(err)
  });
}

function playNextSong() {
  queue.getNextSong()
  .catch(err => {
    console.error(err)
    stats.error(err)
    playNextSong()
    return
  })
  .then((song) => {
    if(song){
      playSong(song)
    }
    else {
      textChannel.send("Nothing to play")
    }
  })
  .catch(err => {
    stats.error(err)
  })
}


/*const schedule = require('node-schedule')

schedule.scheduleJob('0 0 * * *', () => {
  var rbTimes = 0
  if(!voice_stream){
    console.log("Disconnecting...");
    client.destroy();
    setTimeout(function() {
      process.exit();
    },5000)
  }
  else{
    setInterval(() => {
      if(!voice_stream || rbTimes > 6){ //If we tried for an hour
        console.log("Disconnecting...");
        client.destroy();
        setTimeout(function() {
          process.exit();
        },5000)
      }
      else{
        rbTimes++
      }
    }, 600000) // Check every 10m
  }
})*/