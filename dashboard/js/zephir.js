var socket = io();

function getBotData() {
  socket.on('getBot', function(msg){
    console.log(msg)
    $('#botName').val(msg.nickname)
    $('#botToken').val(msg.token)
    $('#botGuild').val(msg.guild)
  });
  socket.emit('getBot', {jwt: getCookie("jwt")});
}

function setBotData(data) {
  socket.emit('setBot', {jwt: getCookie("jwt"), data: data});
}


function getCommands() {
  socket.on('getCommands', function(msg){
    console.log(msg)
    var i = 0
    msg.forEach(com => {
      $('#comms').append(
        `
        <tr>
          <td style="vertical-align: middle;">${com.command}</td>
          <td style="vertical-align: middle;">${com.reply}</td>
          <td class="text-right">
              <button style="width: 30px;height: 30px;position: relative;margin-right: 20px;" type="button" onClick="deleteCommand('${com.command}')" class="btn btn-secondary mb-1 del-btn com-del">
                      <i class="fas fa-trash-alt" style="position: absolute;top: 6px;left: 7px;"></i>
              </button>
          </td>
        </tr>
        `
      )
      i++
    });
  });
  socket.emit('getCommands', {jwt: getCookie("jwt")});
}

function addCommand(data) {
  socket.emit('addCommand', {jwt: getCookie("jwt"), data: data});
}
function deleteCommand(data) {
  socket.emit('deleteCommand', {jwt: getCookie("jwt"), data: data});
  location.reload();
}

$('#addCommand').click(function(e) {
    addCommand({command: $('#commandName').val(), reply: $('#commandReply').val()})
    location.reload();
})

function getRoles() {
  socket.on('getRoles', function(msg){
    console.log(msg)
    var i = 0
    msg.forEach(com => {
      $('#roles').append(
        `
        <tr>
          <td style="vertical-align: middle;">${com.name}</td>
          <td style="vertical-align: middle;">${com.alias}</td>
          <td class="text-right">
              <button style="width: 30px;height: 30px;position: relative;margin-right: 20px;" type="button" onClick="deleteRole('${com.alias}')" class="btn btn-secondary mb-1 del-btn com-del">
                      <i class="fas fa-trash-alt" style="position: absolute;top: 6px;left: 7px;"></i>
              </button>
          </td>
        </tr>
        `
      )
      i++
    });
  });
  socket.emit('getRoles', {jwt: getCookie("jwt")});
}

function addRole(data) {
  socket.emit('addRole', {jwt: getCookie("jwt"), data: data});
}
$('#addRole').click(function(e) {
  addRole({name: $('#roleName').val(), alias: $('#roleAlias').val()})
  location.reload();
})
function deleteRole(data) {
  socket.emit('deleteRole', {jwt: getCookie("jwt"), data: data});
  location.reload();
}


function getSounds() {
  socket.on('getSounds', function(msg){
    console.log(msg)
    var i = 0
    msg.forEach(com => {
      $('#sounds').append(
        `
        <tr>
          <td style="vertical-align: middle;">${com.alias}</td>
          <td style="vertical-align: middle;">${com.url}</td>
          <td class="text-right">
              <button style="width: 30px;height: 30px;position: relative;margin-right: 20px;" type="button" onClick="deleteSound('${com.alias}')" class="btn btn-secondary mb-1 del-btn com-del">
                      <i class="fas fa-trash-alt" style="position: absolute;top: 6px;left: 7px;"></i>
              </button>
          </td>
        </tr>
        `
      )
      i++
    });
  });
  socket.emit('getSounds', {jwt: getCookie("jwt")});
}

function addSound(data) {
  socket.emit('addSound', {jwt: getCookie("jwt"), data: data});
}
$('#addSound').click(function(e) {
  addSound({alias: $('#soundAlias').val(), url: $('#soundURL').val()})
  location.reload();
})
function deleteSound(data) {
  socket.emit('deleteSound', {jwt: getCookie("jwt"), data: data});
  location.reload();
}




function getChannels() {
  socket.on('getChannels', function(msg){
    console.log(msg)
    var i = 0
    msg.forEach(com => {
      $('#channels').append(
        `
        <tr>
          <td style="vertical-align: middle;">${com.alias}</td>
          <td class="text-right">
              <button style="width: 30px;height: 30px;position: relative;margin-right: 20px;" type="button" onClick="deleteChannel('${com.alias}')" class="btn btn-secondary mb-1 del-btn com-del">
                      <i class="fas fa-trash-alt" style="position: absolute;top: 6px;left: 7px;"></i>
              </button>
          </td>
        </tr>
        `
      )
      i++
    });
  });
  socket.emit('getChannels', {jwt: getCookie("jwt")});
}

function addChannel(data) {
  socket.emit('addChannel', {jwt: getCookie("jwt"), data: data});
}
$('#addChannel').click(function(e) {
  addChannel({alias: $('#channelAlias').val()})
  location.reload();
})
function deleteChannel(data) {
  socket.emit('deleteChannel', {jwt: getCookie("jwt"), data: data});
  location.reload();
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2)
  return parts.pop().split(";").shift();
}