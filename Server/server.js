const path = require('path')
const exrpress = require('express')
const publicPath = path.join(__dirname, '/../Public')
const app = exrpress();
const port = process.env.PORT || 3001
app.use(exrpress.static(publicPath));
app.listen(port, ()=>{
    console.log("Port number is " + port)
})





// Tutorial : https://www.youtube.com/watch?v=WNNf5JPuwZg&list=PLrwNNiB6YOA1a0_xXvogmvSHrLcanVKkF&index=2