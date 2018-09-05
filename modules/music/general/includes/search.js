const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const request = require('request');
const cheerio = require('cheerio');
const util = require('util');

module.exports = {
  search: async function(message, term) {
    return new Promise(function(resolve, reject) {
      if(parseInt(term)){
        let plNum = parseInt(term);
        api.getPlaylist().then((pl) => {
          if(pl.playlist.length > plNum){
            ytdl.getInfo(pl.playlist[plNum].link, (error, info) => {
              if(error) {
                reject(error);
              }
              else{
                resolve({
                  yt: info["video_id"],
                  link: info["video_url"],
                  name: info["title"],
                  duration: info["length_seconds"],
                  thumbnail: info["thumbnail_url"],
                  added_by: message.author.username
                })
              }
            });
          }
          else {
            reject("not in playlist")
          }
        })
      }
      else if(term.indexOf("spotify.com") > -1){
        textChannel.send("Converting Spotify playlist")
        textChannel.send("\nThis will take some time")
        if(term.indexOf('?') > -1){
          term = term.substring(0, term.indexOf('?'))
          console.log(term)
        }
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
              songArr.push(so)
            });
            let qu = await api.getQueue()
            let mse = await textChannel.send("Adding " + songArr.length + " songs - Aproximate time: " + parseInt(songArr.length*0.5) + " seconds")
            for (var i = 0; i < songArr.length; i++) {
              if(songArr[i]){
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
            mse.delete()
            await api.setQueue(qu)
            textChannel.send("Success: Playlist has been added to the queue")
          }
        })
      }
      else if(term.indexOf('list=') > -1){

        ytpl(term, async function(err, playlist) {
          if(err){
            console.log(err)
            textChannel.send(err)
            return
          }
          const ytdlp = util.promisify(ytdl.getInfo)
          textChannel.send("Adding playlist to queue...")
          var edt = await textChannel.send(playlist.items.length+"/"+playlist.items.length+" Songs left")
          for (var i = 0; i < playlist.items.length; i++) {
            try{
              let info = await ytdlp(playlist.items[i].url_simple)
              await queue.add({
                yt: info["video_id"],
                link: info["video_url"],
                name: info["title"],
                duration: info["length_seconds"],
                thumbnail: info["thumbnail_url"],
                added_by: message.author.username
              })
              if(i % 5 == 0)
                edt.edit((playlist.items.length-i)+"/"+playlist.items.length+" Songs left")
              console.log("Added ", info["title"])
            }
            catch(e){
              console.log(e)
            }
            
          }
          edt.delete()
          textChannel.send("Playlist was added")
        })
      }
      else{
        var video_id = get_video_id(term);
      	ytdl.getInfo("https://www.youtube.com/watch?v=" + video_id, (error, info) => {
      		if(error) {
            if(message.content == null){
              resolve()
            }
            else{
              let sterm = message.content.replace("!play ","").replace(" ", "+")
              request('https://www.youtube.com/results?search_query=' + sterm, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                  let $ = cheerio.load(body);
                  var vid = $("#results > ol > li > ol > li:nth-of-type(2) > div").attr('data-context-item-id');
                  ytdl.getInfo("https://www.youtube.com/watch?v=" + vid, (error, info) => {
                    if(error) {
                      reject(error);
                    }
                    else{
                      resolve({
                        yt: info["video_id"],
                        link: info["video_url"],
                        name: info["title"],
                        duration: info["length_seconds"],
                        thumbnail: info["thumbnail_url"],
                        added_by: message.author.username
                      })
                    }
                  });
                }
              });
            } 
      		}
      		else {
      			resolve({
              yt: info["video_id"],
              link: info["video_url"],
              name: info["title"],
              duration: info["length_seconds"],
              thumbnail: info["thumbnail_url"],
              added_by: message.author.username
            })
      		}
      	});
      }
    });
  }
}

function get_video_id(string) {
	var regex = /(?:\?v=|&v=|youtu\.be\/)(.*?)(?:\?|&|$)/;
	var matches = string.match(regex);

	if(matches) {
		return matches[1];
	} else {
		return string;
	}
}
