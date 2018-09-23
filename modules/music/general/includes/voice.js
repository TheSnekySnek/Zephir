const WitSpeech = require('node-witai-speech');
const fs = require('fs');
const path = require('path');
const opus = require('node-opus');
const ffmpeg = require('fluent-ffmpeg');
const decode = require("./decode.js");

const WIT_API_KEY = "7TEGB5IFHZMLS52ZVWO3KTVJCCCVHF7T";

var listenConnection = null;
var listenReceiver = null;
var listenStreams = new Map();
var recordingsPath = "./modules/music/general/includes/rec"

async function handleSpeech(member, intent, value) {
    
    console.log("Intent", intent)
    console.log("Value", value)
    switch (intent) {
        case "play":
            search.search({ content: value, author: { username: member.displayName } }, value)
                .catch(err => {
                    console.error(err)
                    return
                })
                .then(song => {
                    console.log(song)
                    if (song) {
                        queue.add(song)
                        createNewSongEmbed(member, song)
                    }
                })
                .catch(err => {
                    stats.error(err)
                })
            break;
        case "skip":
            player.skip({
                author: {
                    id: member.id
                }
            });
        case "queue":
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


                textChannel.send({ embed });
            }
            else {
                textChannel.send("The queue is empty. Add a new song by using !play")
            }
            break;
        case "lyrics":
            api.getPlaying()
                .then((mbinfo) => {

                    var sng = mbinfo.name
                    textChannel.send("Getting lyrics for " + sng)
                    lyrics.fromSong(sng)
                        .catch(err => {
                            stats.error(err)
                            textChannel.send("Could not get lyrics")
                        })
                        .then(lyr => {
                            console.log(lyr)
                            let l2 = lyr.split('[')
                            if (l2.length < 25 && l2.length > 2) {
                                let embed = new Discord.RichEmbed()
                                    .setTitle("**" + sng + "**")
                                    .setAuthor("Lyrics", client.user.avatarURL)
                                    .setColor("#2eaae5")
                                    .setFooter("Arkhos Music Bot V2 by TheSnekySnek", client.user.avatarURL)
                                    .setThumbnail(mbinfo.thumbnail)
                                    .setURL(mbinfo.link)

                                for (var i = 1; i < l2.length; i++) {
                                    let title = l2[i].split(']')[0]
                                    let sd = l2[i].split(']')[1]
                                    if (!title.match(/.*[a-zA-Z].*/))
                                        title = "-"
                                    if (!sd.match(/.*[a-zA-Z].*/))
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

                                textChannel.send({ embed })
                                    .catch(err => {
                                        console.error(err)
                                        //message.channel.send("An error occured.\nOur team of well trained sneks is looking into it")
                                    })
                            }
                            else if (l2.length == 1) {
                                textChannel.send("\n------------------------------\n")
                                var flyr = lyr.split("\n\n")
                                for (let i = 0; i < flyr.length; i++) {
                                    textChannel.send(flyr[i])
                                        .catch(err => {
                                            console.error(err)
                                            //message.channel.send("An error occured.\nOur team of well trained sneks is looking into it")
                                        })
                                }
                            }
                            else {
                                textChannel.send("Lyrics are unavailable for this song :(")
                            }

                        })
                })
            break;
        default:
            break;
    }
}

function cleanRec(id) {
    try {
        fs.readdir(recordingsPath, (err, files) => {
            if (err) throw err;
    
            for (const file of files) {
                if (file.indexOf(id) > -1) {
                    fs.unlink(path.join(recordingsPath, file), err => {
                        if (err) throw err;
                    });
                }
            }
        });
    } catch (error) {
        console.error(error)
    }
    
}

module.exports = {
    startListening: function (vc) {
        console.log("Listening")
        listenConnection = vc;

        let receiver = vc.createReceiver();
        receiver.on('opus', function (user, data) {
            let hexString = data.toString('hex');
            let stream = listenStreams.get(user.id);
            if (!stream) {
                if (hexString === 'f8fffe') {
                    return;
                }
                let outputPath = path.join(recordingsPath, `${user.id}-${Date.now()}.opus_string`);
                console.log(outputPath)
                stream = fs.createWriteStream(outputPath);
                listenStreams.set(user.id, stream);
            }
            stream.write(`,${hexString}`);
        });
        console.log("Created receiver")
        listenReceiver = receiver;
    },

    handleSpeaking: function (member, speaking) {
        console.log(member.displayName + " Has stopped speaking")
        if (!speaking && member.voiceChannel) {
            let stream = listenStreams.get(member.id);
            if (stream) {
                listenStreams.delete(member.id);
                stream.end(err => {
                    if (err) {
                        console.error(err);
                    }

                    let basename = path.basename(stream.path, '.opus_string');
                    let text = "default";

                    // decode file into pcm
                    decode.convertOpusStringToRawPCM(stream.path,
                        basename,
                        (function () {
                            processRawToWav(
                                path.join(recordingsPath, basename + '.raw_pcm'),
                                path.join(recordingsPath, basename + '.wav'),
                                (function (data) {
                                    cleanRec(member.id)
                                    if (data != null) {
                                        console.log(data)
                                        if (data.entities.intent) {
                                            if (data.entities.message_body) {
                                                handleSpeech(member, data.entities.intent[0].value, data.entities.message_body[0].value);
                                            } else {
                                                handleSpeech(member, data.entities.intent[0].value, "");
                                            }
                                        }

                                    }
                                }).bind(this))
                        }).bind(this));
                });
            }
        }
    }
}



function processRawToWav(filepath, outputpath, cb) {
    fs.closeSync(fs.openSync(outputpath, 'w'));
    var command = ffmpeg(filepath)
        .addInputOptions([
            '-f s32le',
            '-ar 48k',
            '-ac 1'
        ])
        .on('end', function () {
            // Stream the file to be sent to the wit.ai
            var stream = fs.createReadStream(outputpath);

            // Its best to return a promise
            var parseSpeech = new Promise((resolve, reject) => {
                // call the wit.ai api with the created stream
                WitSpeech.extractSpeechIntent(WIT_API_KEY, stream, "audio/wav",
                    (err, res) => {
                        if (err) return reject(err);
                        resolve(res);
                    });
            });

            // check in the promise for the completion of call to witai
            parseSpeech.then((data) => {
                console.log("you said: " + data._text);
                cb(data);
                //return data;
            })
                .catch((err) => {
                    console.log(err);
                    cb(null);
                    //return null;
                })
        })
        .on('error', function (err) {
            console.log('an error happened: ' + err.message);
        })
        .addOutput(outputpath)
        .run();
}

function createNewSongEmbed(member, song) {
    queue.getTime()
        .then((queueTime) => {
            let pTime = player.time();
            if (!pTime || !pTime.time || !pTime.song) {
                pTime.time = 0
                pTime.song = 0
            }
            let embed = new Discord.RichEmbed()
                .setTitle("**" + song.name + "**")
                .setAuthor(member.displayName + " has added a song", member.user.avatarURL)
                .setColor("#2eaae5")
                .setFooter("Arkhos Music Bot V2 by TheSnekySnek", client.user.avatarURL)
                .setThumbnail(song.thumbnail)
                .setURL(song.link)
                .addField("Duration", fancyTimeFormat(song.duration))
                .addField("Starts in", fancyTimeFormat(queueTime + (pTime.song - pTime.time)))

            textChannel.send({ embed });
        })

}

function fancyTimeFormat(time) {
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