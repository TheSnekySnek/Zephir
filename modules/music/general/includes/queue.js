var Random = require('random-js')
module.exports = {
  getNextSong: function() {
    return new Promise(function(resolve, reject) {
      api.getQueue(botId)
      .then((queueObj) =>{
        if(queueObj && queueObj[0]){
          let song = queueObj.shift()
          api.setQueue(queueObj)
          resolve(song)
        }
        else {
          api.getPlaylist(playlistID)
          .then((data) => {
            if(data.playlist && data.playlist[0]){
              let newPlay = data.playlist
              var song = pickUnplayedSong(newPlay)
              let dummyMsg = {author:{username: "Playlist"}}
              let sid = song.yt
              search.search(dummyMsg, sid)
              .catch(err => {
                console.log(err)
                module.exports.getNextSong()
              })
              .then((ns) => {
                if(ns){
                  resolve(ns)
                }
                else {
                  module.exports.getNextSong()
                }
              }).catch(err => {
                stats.error(err)
              });
            }
            else{
              resolve()
            }
          })
        }
      })
    })
  },

  add: function(song) {
    api.getQueue(botId)
    .then((queueObj) => {
      queueObj.push(song);
      api.setQueue(queueObj);
    })
    .catch(err => {
      stats.error(err)
    })
  },

  getTime: function() {
    return new Promise(function(resolve, reject) {
      api.getQueue(botId)
      .then((queueObj) => {
        let totalTime = 0;
        for (var i = 0; i < queueObj.length; i++) {
          totalTime += parseInt(queueObj[0].duration);
        }
        resolve(totalTime)
      })
      .catch(err => {
        stats.error(err)
      })
    });
  },

  clearPlayedSongs: function() {
    playedSongs = []
  }
};

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

var playedSongs = []

function pickUnplayedSong(songs){
  var r = new Random();
  var rv = r.integer(0, songs.length-1);
  var ns = songs[rv]
  if(playedSongs.length < songs.length-3){
    playedSongs = []
  }
  for (let i = 0; i < playedSongs.length; i++) {
    if(playedSongs == ns.yt){
      console.log("Song already played")
      return pickUnplayedSong(songs)
    }
  }
  playedSongs.push(ns.yt)
  return ns
}
