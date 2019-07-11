const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const request = require('request');
const cheerio = require('cheerio');
const util = require('util');

module.exports = {
  search: async function (message, term) {
    return new Promise(function (resolve, reject) {
      if (parseInt(term)) {
        let plNum = parseInt(term);
        api.getPlaylist().then((pl) => {
          if (pl.playlist.length > plNum) {
            ytdl.getInfo(pl.playlist[plNum].yt, (error, info) => {
              if (error) {
                reject(error);
              }
              else {
                console.log(info.player_response.videoDetails.thumbnail)
                resolve({
                  yt: info["video_id"],
                  link: info["video_url"],
                  name: info["title"],
                  duration: info["length_seconds"],
                  thumbnail: info.player_response.videoDetails.thumbnail.thumbnails[info.player_response.videoDetails.thumbnail.thumbnails.length-1].url,
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
      else if (term.indexOf("spotify.com") > -1) {
        textChannel.send("Converting Spotify playlist")
        textChannel.send("\nThis will take some time")
        var datI = term.indexOf('?')
        var plID = term.substring(datI-22, datI)
        console.log(term)
        
        console.log("Spotify Playlist")
        let options = {
          uri: "https://api.spotify.com/v1/playlists/"+plID+"/tracks?offset=0&market=CH",
          headers: {
            "Authorization": "Bearer BQByxIuHIV2PjkrSidsedK6VLaTF0LNtVLysGql-GpyZr4mhlVwzx57q2q6gbeb_ys5ffpk0JKdQZYKlw0s"
          },
          method: "GET"
        }
        request(options, async function (error, response, body) {
          if (error) {
            console.log(error)
            return
          }
          else {
            var data = JSON.parse(body)
            console.log(data.items)
            let songArr = data.items
            
            let qu = await api.getQueue()
            let mse = await textChannel.send("Adding " + songArr.length + " songs - Aproximate time: " + parseInt(songArr.length * 0.5) + " seconds")
            for (var i = 0; i < songArr.length; i++) {
              if (songArr[i]) {
                try {

                  var sng = await termSearch(songArr[i].track.name + " " + songArr[i].track.artists[0].name, message.author.username)
                  qu.push(sng)
                  if (i % 10 == 1)
                    mse.edit("Adding " + (songArr.length - i) + " songs - Aproximate time: " + parseInt((songArr.length - i) * 0.5) + " seconds")
                  console.log("Added " + songArr[i].track.name)
                }
                catch (e) {
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
      else if (term.indexOf('list=') > -1) {

        ytpl(term, async function (err, playlist) {
          if (err) {
            console.log(err)
            textChannel.send(err)
            return
          }
          const ytdlp = util.promisify(ytdl.getInfo)
          textChannel.send("Adding playlist to queue...")
          var edt = await textChannel.send(playlist.items.length + "/" + playlist.items.length + " Songs left")
          for (var i = 0; i < playlist.items.length; i++) {
            try {
              let info = await ytdlp(playlist.items[i].url_simple)
              await queue.add({
                yt: info["video_id"],
                link: info["video_url"],
                name: info["title"],
                duration: info["length_seconds"],
                thumbnail: info.player_response.videoDetails.thumbnail.thumbnails[info.player_response.videoDetails.thumbnail.thumbnails.length-1].url,
                added_by: message.author.username
              })
              if (i % 5 == 0)
                edt.edit((playlist.items.length - i) + "/" + playlist.items.length + " Songs left")
              console.log("Added ", info["title"])
            }
            catch (e) {
              console.log(e)
            }

          }
          edt.delete()
          textChannel.send("Playlist was added")
        })
      }
      else if (term.indexOf("youtube.com") > -1 || term.indexOf("youtu.be") > -1 || term.length == 11) {
        var video_id = get_video_id(term);
        ytdl.getInfo("https://www.youtube.com/watch?v=" + video_id, (error, info) => {
          if (error) {
            if (message.content == null) {
              resolve()
            }
            else {
              let sterm = message.content.replace("!play ", "").replace(" ", "+")
              request('https://www.youtube.com/results?search_query=' + sterm, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                  let $ = cheerio.load(body);
                  var vid = $("#results > ol > li > ol > li:nth-of-type(2) > div").attr('data-context-item-id');
                  ytdl.getInfo("https://www.youtube.com/watch?v=" + vid, (error, info) => {
                    if (error) {
                      reject(error);
                    }
                    else {
                      resolve({
                        yt: info["video_id"],
                        link: info["video_url"],
                        name: info["title"],
                        duration: info["length_seconds"],
                        thumbnail: info.player_response.videoDetails.thumbnail.thumbnails[info.player_response.videoDetails.thumbnail.thumbnails.length-1].url,
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
              thumbnail: info.player_response.videoDetails.thumbnail.thumbnails[info.player_response.videoDetails.thumbnail.thumbnails.length-1].url,
              added_by: message.author.username
            })
          }
        });
      }
      //Try to play it as a livestream
      else if (term.indexOf("www") > -1 || term.indexOf("http") > -1) {
        term = term.replace(" ", "")
        var url = term
        if (term.indexOf("http") < 0) {
          url = "http://" + term
        }
        console.log(term)
        console.log(url)
        resolve({
          yt: "livestream",
          link: term,
          name: url,
          duration: 0,
          thumbnail: "https://www.funkemedien.de/export/sites/fmg/.content/image/logos/App-Icon_Berlinlive.de.png",
          added_by: message.author.username
        })
      }
      else {
        var video_id = get_video_id(term);
        ytdl.getInfo("https://www.youtube.com/watch?v=" + video_id, (error, info) => {
          if (error) {
            if (message.content == null) {
              resolve()
            }
            else {
              let sterm = message.content.replace("!play ", "").replace(" ", "+")
              request('https://www.youtube.com/results?search_query=' + sterm, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                  let $ = cheerio.load(body);
                  var vid = $("#results > ol > li > ol > li:nth-of-type(2) > div").attr('data-context-item-id');
                  if(!vid)
                    vid = body.substring(body.indexOf("/watch?v=") + 9, body.indexOf("/watch?v=") + 20)
                  console.log(vid)
                  ytdl.getInfo("https://www.youtube.com/watch?v=" + vid, (error, info) => {
                    if (error) {
                      reject(error);
                    }
                    else {
                      resolve({
                        yt: info["video_id"],
                        link: info["video_url"],
                        name: info["title"],
                        duration: info["length_seconds"],
                        thumbnail: info.player_response.videoDetails.thumbnail.thumbnails[info.player_response.videoDetails.thumbnail.thumbnails.length-1].url,
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
              thumbnail: info.player_response.videoDetails.thumbnail.thumbnails[info.player_response.videoDetails.thumbnail.thumbnails.length-1].url,
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

  if (matches) {
    return matches[1];
  } else {
    return string;
  }
}

async function termSearch(term, author){
  return new Promise(function (resolve, reject) {
    request('https://www.youtube.com/results?search_query=' + term, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        let $ = cheerio.load(body);
        var vid = $("#results > ol > li > ol > li:nth-of-type(2) > div").attr('data-context-item-id');
        if(!vid)
          vid = body.substring(body.indexOf("/watch?v=") + 9, body.indexOf("/watch?v=") + 20)
        console.log(vid)
        ytdl.getInfo("https://www.youtube.com/watch?v=" + vid, (error, info) => {
          if (error) {
            reject(error);
          }
          else {
            resolve({
              yt: info["video_id"],
              link: info["video_url"],
              name: info["title"],
              duration: info["length_seconds"],
              thumbnail: info.player_response.videoDetails.thumbnail.thumbnails[info.player_response.videoDetails.thumbnail.thumbnails.length-1].url,
              added_by: author
            })
          }
        });
      }
    });
  })
}
