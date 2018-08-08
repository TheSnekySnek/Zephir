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
        v.replace('HQ', '');
        v.replace('HD', '');
        v.replace('lyrics', '');
        v.replace('Lyrics', '');
        v.replace(' - ', ' ');
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
