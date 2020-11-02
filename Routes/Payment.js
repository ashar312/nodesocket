const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')

router.get('',async (req,res,next) => {
    //var userId = req.query.userId;
    var userId = "AlKvvpjSkjeiWhX5bFGQgc4dHEL2"
    try{
        var results = await admin.firestore().collection('Payments')
        .where("userId",'==',userId)
        .orderBy('createdAt',"asc")
        .get()
        results = results.docs.map(doc => doc.data())
        var createdAt = results[results.length - 1].createdAt.toDate()
        createdAt.setDate(createdAt.getDate() + Number(results[results.length - 1].day))
        var currentDate = new Date()
        if(createdAt > currentDate){
            admin.firestore().collection("Users").doc(userId)
            .update({
                payment : false
            })
            .then(() =>{
                results = {
                    code : -2,
                    message : "Your Permium payment has been completed please recharge to further use Dateumm Services"
                }
                res.status(200).json({results})
            })
            //yahan per Notification jaiga k payment off scene hai.
        }else{
            //yahan per 15 days wala notice period dena hai
            results = {
                code : 1,
                message : "All good"
            }
            res.status(200).json({results})
        }
    }catch (e) {
        let results = {
            code : -1,
            message : e.message
        }
        res.status(200).json({results})
    }
    
})

module.exports = router;
