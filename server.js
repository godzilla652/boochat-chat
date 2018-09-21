const express = require('express')
const path = require('path')
const fs = require('fs')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const pug = require('pug')
const favicon = require('serve-favicon')
const crypto = require('crypto')

const config = require(__dirname + '/config.js')
const mongooseMonster = require(__dirname + '/myModules/mongooseModule.js')
const cookieMonster = require(__dirname + '/myModules/cookiesModule.js')
const helpers = require(__dirname + '/myModules/helpers.js')

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io').listen(http)


app.use(express.static('public'))
app.set('view engine', 'pug')
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.png')))
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())



let NAME, HPASSWORD, COOKIE
let MESSAGE = ''


let REPLICAS
let ONLINE
app.use('/exit', function(req, res, next){
  mongooseMonster.findUserByCookie(req.cookies[config.appName], function(data){
    if(!data){
      res.redirect('/')
      next()
    }
    else{
      NAME = data.name
      next()
    }
  })
})

app.use('/exit', function(req, res, next){
  res.clearCookie(config.appName)
  res.clearCookie('io')

  mongooseMonster.removeOnlineUser(NAME, function(){
    next()
  })
})

app.use('/chat', function(req, res, next){
  mongooseMonster.findUserByCookie(req.cookies[config.appName], function(data){
    if(!data){
      res.redirect('/')
      next()
    }
    else{
      NAME = data.name
      next()
    }
  })
})
app.use('/chat', function(req, res, next){
  mongooseMonster.findOnlineUser(NAME, function(data){
    if(data){
      next()
    }
    else{
      mongooseMonster.addOnlineUser(NAME, function(){
        next()
      })
    }
  })
})
app.use('/chat', function(req, res, next){
  mongooseMonster.findReplicas(function(data){
    REPLICAS = data
    next()
  })
})

app.use('/chat', function(req, res, next){
  mongooseMonster.findOnlineCollection(function(data){
    let temp = []
    data.forEach(function(item){
      temp.push(item.name)
    })
    ONLINE = temp
    next()
  })
})

app.use('/chat', function(req, res, next){
  next()
})



app.get('/', function(req, res){
  res.render('main', {title:config.appName, message:MESSAGE})
  MESSAGE = ''
})

app.get('/chat', function(req, res){
  res.render('chat', {title:config.appName, username:NAME, replicas:REPLICAS, online:ONLINE})
})


app.post('/check', function(req, res){
  NAME = req.body.login
  HPASSWORD = helpers.hashPassword(req.body.password)
  COOKIE = cookieMonster.makeString()

  mongooseMonster.findUserByName(NAME, function(data){
    if(data == null){

      mongooseMonster.addUser(NAME, HPASSWORD, COOKIE)
      res.cookie(config.appName, COOKIE)
      res.redirect('/chat')
    }
    if(data != null && (data.password == HPASSWORD)){

      res.cookie(config.appName, data.cookie)
      res.redirect('/chat')
    }
    if(data != null && (data.password != HPASSWORD)){

      MESSAGE = 'Incorrect input data, please try again...'
      res.redirect('/')
    }
  })
})//end of post /check
app.post('/exit', function(req, res){
  res.redirect('/')
})









io.on('connection', function(socket){
  // io.emit('sendOnlineList', 'data')


  socket.on('userConnected', function(data){
    io.emit('addUserToOnlineList', data)
  })

  socket.emit('giveAllReplicas', REPLICAS)


  socket.on('userPostedReplica', function(data){
    mongooseMonster.addReplica(data.replica, data.date, data.username, function(){
      io.emit('addLastReplica', data)
    })
  })//userPostedReplica

socket.on('disconnect', function(){
  io.emit('userDisconnected', NAME)
})

})
///////
//SOCKETS
//////

http.listen(config.port, config.host)
