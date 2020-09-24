let socket = io()

      socket.on('connect',function(){
    //    console.log("Connected To Server")
      })
      socket.on('disconnect',function(){
   //     console.log("DisConnected To Server")
      })
      socket.on('newMsg',function(msg){
 //       console.log("msg",msg)
      })
