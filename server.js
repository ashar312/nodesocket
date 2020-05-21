
const app = require('express')();
const http = require('http').Server(app)
const io = require('socket.io')(http)

const port = process.env.PORT || 3002

app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html')
})

const getVisitors = () => {
    let clients = io.sockets.clients().connected
    let sockets = Object.values(clients);
    let users = sockets.map(s => s.user);
    return users;
}

const emitVisitors = () => {
    io.emit('visitors',getVisitors())
}

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('new_visitor',user => {
        console.log("new_visitor",user);
        socket.user = user;
        emitVisitors()
    })

    socket.on("disconnect",function(){
        emitVisitors()
        console.log("a user disconnected")
    })

})

http.listen(port, function(){
    console.log("Port number is " + port)
})





// Tutorial : https://www.youtube.com/watch?v=WNNf5JPuwZg&list=PLrwNNiB6YOA1a0_xXvogmvSHrLcanVKkF&index=2