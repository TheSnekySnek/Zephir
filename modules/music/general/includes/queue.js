var Random = require('random-js')
var lastPLID = 0
module.exports = {
  getNextSong: function() {
    return new Promise(function(resolve, reject) {
      api.getQueue(botId)
      .then((queueObj) =>{
        if(queueObj && queueObj[0]){
          let song = queueObj.shift()
          api.setQueue(queueObj)
          console.log("there is something in the queue")
          resolve(song)
        }
        else {
          console.log("nothing in queue getting pl")
          api.getPlaylist(playlistID)
          .then((data) => {
            if(data.playlist && data.playlist[0]){
              console.log("got pl and pick random")
              let newPlay = data.playlist
              var song = pickUnplayedSong(newPlay)
              let dummyMsg = {author:{username: "Playlist"}}
              let sid = song.yt
              search.search(dummyMsg, sid)
              .then((ns) => {
                if(ns){
                  console.log("got song info from pl")
                  resolve(ns)
                }
                else {
                  console.log("didn't get song info from pl")
                  api.getPlaylist(playlistID).then((pl) =>{
                    /*let playlist = pl.playlist;
                    playlist.splice(lastPLID, 1);
                    api.setPlaylist(playlist);
                    textChannel.send("The song " + song.name + " was removed from the playlist because it can't be played anymore")*/
                    module.exports.getNextSong().then((nns) => {
                      resolve(nns)
                    })
                  });
                }
              })
              .catch(function (error) {
                console.log(error)
                //textChannel.send(error)
                module.exports.getNextSong().then((nns) => {
                  resolve(nns)
                })
              })
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
  var rv
  do {
    rv = r.integer(0, songs.length-1);
  } while (playedSongs.includes(rv));
  var ns = songs[rv]
  playedSongs.push(rv)
  if (playedSongs.length == songs.length) {
    playedSongs = []
  }
  lastPLID = rv
  return ns
}
