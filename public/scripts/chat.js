var socket = io.connect('http://192.168.1.104:8888/')
document.querySelector('input#textReplica').focus()


if(scroller.scrollHeight > 526){
    scroller.scrollTop = scroller.scrollHeight
  }




 function randomInteger(min, max) {
     var rand = min + Math.random() * (max + 1 - min);
     rand = Math.floor(rand);
     return rand;
 }





function addReplica(data){
    // if(++replicaCounter)
    let el1 = document.createElement('span')
    el1.textContent = data.date
    el1.setAttribute('class', 'tone1')
    let el2 = document.createElement('span')
    el2.textContent = data.username
    el2.setAttribute('class', 'tone3')
    let el3 = document.createElement('span')
    el3.textContent = data.replica
    el3.setAttribute('class', 'tone2')

    let el_sep = document.createElement('span')
    el_sep.textContent = ' : '
    let el_sep1 = el_sep.cloneNode(true)
    let element = document.createElement('div')

    if(data.replica.length == 28  && data.replica[26].charCodeAt() == 58 && data.replica[27].charCodeAt() == 41){
      element.append(el1)
      element.append(el_sep)
      element.append(el2)
      element.append(el3)
      el1.setAttribute('class', 'tone1')
      el2.setAttribute('class', 'tone1')
      el3.setAttribute('class', 'tone1')
      el_sep.setAttribute('class', 'tone1')
    }
    else{
      element.append(el1)
      element.append(el_sep)
      element.append(el2)
      element.append(el_sep1)
      element.append(el3)
    }

    chatMonitor.appendChild(element)
    scroller.scrollTop = scroller.scrollHeight
}

// function addReplicasFromDB(data){
//   if(data){
//     addReplica(data)
//   }
// }

function addUserOnline(name){
  let x = Array.from(chatRooms.children).map((item)=>{return item.textContent})
  name = name.trim()
  if(x.indexOf(name) != -1) return
  else{
    let element = document.createElement('span')
    element.setAttribute('class', 'names')
    element.textContent = name
    chatRooms.appendChild(element)
  }
}
function removeUserOnline(name){
  let x = Array.from(chatRooms.children).map((item)=>{return item.textContent})
  if(x.indexOf(name) != -1){
     let index = x.indexOf(name)
     chatRooms.children[index].remove()
   }
  }


function acceptReplica(event){
  if(event.keyCode == 13 && (document.activeElement.getAttribute('id') == 'textReplica')){
    let replica = textReplica.value
    let username = document.querySelector('#hello').textContent.trim()
    let date = new Date(Date.now()).toString()
    socket.emit('userPostedReplica', {date:date.slice(16, 24), replica:replica, username:username})
    textReplica.value = ''
    textReplica.focus()
  }
}

document.onkeydown = function(event){
  acceptReplica(event)
}
postReplica.onclick = function(){
  let replica = textReplica.value
  let username = document.querySelector('#hello').textContent.trim()
  let date = new Date(Date.now()).toString()
  socket.emit('userPostedReplica', {date:date.slice(16, 24), replica:replica, username:username})
  textReplica.value = ''
  textReplica.focus()
}
showUsers.addEventListener('click', showUsersOnline)
let onlineUsersState = false
function showUsersOnline(){
  let start = -300
  let end = 5

  if(!onlineUsersState){
    let animationA = setInterval(function(){
      start += 5
      if(start >= end){clearInterval(animationA)}
      chatRooms.style.right = start + 'px'
    }, 1)
    chatRooms.style.display = 'block'
    onlineUsersState = true
  }
  else{
    let animationB = setInterval(function(){
      end -= 5
      if(end <= start){clearInterval(animationB);chatRooms.style.display = 'none'}
      chatRooms.style.right = end + 'px'
    }, 1)
    onlineUsersState = false

  }

}



socket.emit('userConnected', document.querySelector('#hello').textContent.trim())



socket.on('addUserToOnlineList', function(data){
 addUserOnline(data)
})


socket.on('userDisconnected', function(data){
  removeUserOnline(data)
})

//add one last replica from anybody to HTML
socket.on('addLastReplica', function(data){
  addReplica(data)
})



//24px
let name = hello.textContent.trim()
Array.from(chatRooms.children).forEach(function(item){
  if(item.textContent == name){
    item.setAttribute('class', 'tone1 names')
  }
})
