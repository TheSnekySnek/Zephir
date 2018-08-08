module.exports = {
  error: function(data) {
    if(process.send){
      process.send({type: 'error', data: data})
    }
  }
}
