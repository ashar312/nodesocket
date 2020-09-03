const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')


router.get('/username',async (req,res,next) => {
    var username = req.query.val
    try {
        let results = await admin.firestore().collection("Users").where("username", "==", username).get()
        results = results.docs.map(doc => doc.data())
        if(results.length > 0){
            results = {
                code : -1,
                message : "Username already exist"
            }
        }else{
            results = {
                code : 1,
                message : "Successful"
            }
        }
        res.status(200).json({results})
    } catch (e) {
        console.log(e)
        const results = {
            code : -1,
            message : e.message
        }
        res.status(200).json({results})
    }
})

module.exports = router;