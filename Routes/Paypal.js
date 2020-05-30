const express = require('express')
const router = express.Router()
const paypal = require("paypal-rest-sdk");

// paypal.configure({
//     mode: "sandbox", //sandbox or live
//     client_id:
//         "",
//     client_secret:
//         ""
// });

//get all list for admin
router.get('/',async (req,res,next) => {
    try{
        let results = {
            code : 1,
            message : "successful"
        }
        res.status(200).json({results})
    }catch(e){
        var results = {
            code : -1,
            message : e
        }
        res.status(200).json({results})
    }
})

module.exports = router;