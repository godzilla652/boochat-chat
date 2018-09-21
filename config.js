function config(){
  this.appName = "BooChat"
  this.port = 8888
  this.host = '192.168.1.104'

  this.mongodbServer = 'mongodb://127.0.0.1/'
  this.mongodbDatabase = 'chat'

}
module.exports = new config()
