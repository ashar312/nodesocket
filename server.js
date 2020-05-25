
const app = require('express')();
const http = require('http').Server(app)
const io = require('socket.io')(http)
const admin = require('firebase-admin')

const port = process.env.PORT || 3002

var serviceAccount = require("./Dateumm_Key/dateumm-62ec2-firebase-adminsdk-uzrai-a4f4897cb8.json");
// Initialize the app with a custom auth variable, limiting the server's access
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://dateumm-62ec2.firebaseio.com",
    databaseAuthVariableOverride: {
      uid: "my-service-worker"
    }
  });

app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html')
})



const getVisitors = () => {
    let clients = io.sockets.clients().connected
    let sockets = Object.values(clients);
    let users = sockets.map(s => s.user);
    console.log("u",users)
    return users;
}

const emitVisitors = (socket) => {
    console.log("socket",socket)
    io.emit('visitors',socket.client.id)
}

io.on('connection', function(socket){
    console.log('a user connected'); 
    io.emit('visitors',socket.client.id)
    socket.on('new_visitor',user => {
        if(user){
            try{
                OnlineUser(user.ID)
            }catch(e){
                console.log(e)
            }
        }
        console.log("new_visitor",user);
        socket.user = user;
        
     //   emitVisitors(socket)
    })

    socket.on("disconnect",function(){
        offlineUser(socket.user.ID)
    })

})

http.listen(port, function(){
    console.log("Port number is " + port)
})

function showUser(id){
    admin.auth().getUser(id)
    .then(function(doc) {
  //      console.log(doc.uid)
    }).catch(err => {
        console.log(err)
    })
}

function OnlineUser(id){
    admin.firestore().collection("Users")
    .doc(id)
    .update({
        Online : true,
        Last_Online : new Date().toISOString().slice(0, 19).replace('T', ' ')
    }).then(() => {
        console.log(id, "online")
        io.emit("CallBack"+id,"You are now connect to the server," + id)
    })
    .catch(e => {
        console.log(e)
    })
}
function offlineUser(id){
    admin.firestore().collection("Users")
    .doc(id)
    .update({
        Online : false
    }).then(() => {
        console.log(id, "offline")
    })
    .catch(e => {
        console.log(e)
    })
}





// Tutorial : https://www.youtube.com/watch?v=WNNf5JPuwZg&list=PLrwNNiB6YOA1a0_xXvogmvSHrLcanVKkF&index=2