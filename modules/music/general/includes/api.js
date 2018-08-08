module.exports = {
  getQueue: function() {
    return new Promise(function(resolve, reject) {
        process.on('message', function(m) {
            var msg = JSON.parse(m)
            if(msg.type == "queue"){
                resolve(msg.data)
            }
        });
        process.send(JSON.stringify({
            type: "getqueue"
        }))
    });
  },
  getPlaying: function() {
    return new Promise(function(resolve, reject) {
        process.on('message', function(m) {
            var msg = JSON.parse(m)
            if(msg.type == "playing"){
                resolve(msg.data)
            }
        });
        process.send(JSON.stringify({
            type: "getplaying"
        }))
    });
  },
  getPlaylist: function() {
    return new Promise(function(resolve, reject) {
        process.on('message', function(m) {
            var msg = JSON.parse(m)
            if(msg.type == "playlist"){
                resolve(msg.data)
            }
        });
        process.send(JSON.stringify({
            type: "getplaylist",
            plId: playlistID
        }))
    });
  },
  setQueue: function(queue) {
    return new Promise(function(resolve, reject) {
        process.send(JSON.stringify({
            type: "setqueue",
            data: queue
        }))
        resolve()
    });
  },
  setPlaylist: function(pl) {
    return new Promise(function(resolve, reject) {
        process.send(JSON.stringify({
            type: "setplaylist",
            plId: playlistID,
            data: pl
        }))
        resolve()
    });
  },
  setPlaying: function(playing) {
    return new Promise(function(resolve, reject) {
        process.send(JSON.stringify({
            type: "setplaying",
            data: playing
        }))
        resolve()
    });
  }
}
