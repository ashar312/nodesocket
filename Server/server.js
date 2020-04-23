const path = require('path')
const exrpress = require('express')
const socketIO = require('socket.io')
const http = require('http')
const publicPath = path.join(__dirname, '/../Public')
const app = exrpress();
const port = process.env.PORT || 3001


const server = http.createServer(app)
const io = socketIO(server)

io.on('connection', (socket) => {
    console.log("New User Connected")

    socket.on('create_msg',(msg)=>{
        console.log('msg',msg)
        io.emit("newMsg",{
            from : "Ahsun",
            text : "haan bhai",
            createAt : new Date().getTime()
        })
    })

    socket.on('disconnect',() => {
        console.log("DisConnected To Server")
      })
})
app.use(exrpress.static(publicPath));

server.listen(port, ()=>{
    console.log("Port number is " + port)
})





// Tutorial : https://www.youtube.com/watch?v=WNNf5JPuwZg&list=PLrwNNiB6YOA1a0_xXvogmvSHrLcanVKkF&index=2