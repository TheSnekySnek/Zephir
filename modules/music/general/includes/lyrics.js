const Lyricist = require('lyricist')
var l = new Lyricist ("hbDq3sPz51PYqpwhXMns-xBmsm_9CJAxBQ6wWpSW-Bk050hyXGTvi9asgK4n9poE");

module.exports = {
  fromSong: function(name) {
    return new Promise(function(resolve, reject) {
        var v = name
        if(v.indexOf('(') > 0){
          v = v.substring(0, v.indexOf('(') - 1);
        }
        if(v.indexOf('[') > 0){
          v = v.substring(0, v.indexOf('[') - 1);
        }
        var r = v.split(' - ');
        if(v.indexOf(':')){
          v = v.replace(':',' -');
        }
        v = v.replace('HQ', '');
        v = v.replace('HD', '');
        v = v.replace('lyrics', '');
        v = v.replace('Lyrics', '');
        v = v.replace(/[^a-z0-9]/gmi, " ").replace(/\s+/g, " ");
        if(v.indexOf("ft.") > 0){
          v = v.substring(0, v.indexOf("ft."))
        }
        console.log("SONG:", v)
        l.song({search: v}, function(err, song) {
          if (err ) {
            reject(err)
          }
          if (song && song.lyrics) {
            resolve(song.lyrics);
          }
          else{
            resolve(null)
          }
        })
      });
    }
  }
