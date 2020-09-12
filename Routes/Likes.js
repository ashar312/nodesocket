const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')

router.get('',async (req,res,next) => {
    const myId = req.query.myId
    const otherId = req.query.otherId
    // 1 = "You Have liked User"
    // 2 = "User have liked you"
    // 3 = "Both Have Liked eachother"
    // 4 = "User doesnt like eachother"
    try {
        const buildLikeID = [myId, otherId].sort().join('-');
        let results = await admin.firestore().collection("LikesList").doc(buildLikeID).get()
        if(results.exists){
            results = results.data();
            if(myId === results.FirstPerson){
                if(results.FirstLike === true && results.SecondLike === true){
                    results = {
                        code : 3,
                        message : "Both Likes eachother"
                    }
                }else if(results.FirstLike === true){
                    results = {
                        code : 1,
                        message : "You like user"
                    }
                } else if(results.SecondLike === true){
                    results = {
                        code : 2,
                        message : "Other Likes you"
                    }
                }
            }else if(myId === results.SecondPerson){
                if(results.FirstLike === true && results.SecondLike === true){
                    results = {
                        code : 3,
                        message : "Both Likes eachother"
                    }
                }else if(results.SecondLike === true){
                    results = {
                        code : 1,
                        message : "You like user"
                    }
                } else if(results.FirstLike === true){
                    results = {
                        code : 2,
                        message : "Other Likes you"
                    }
                }
            }
        }else{
            results = {
                code : -1,
                message : "Users has not like each other"
            }
        }
        // console.log(results)
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

router.get('/chat-initiate',async (req,res,next) => {
    const userEmail = req.query.userEmail
    const otherEmail = req.query.otherEmail
    const userId = req.query.userId
    const otherId = req.query.otherId
    try {
        const buildDoc = [userEmail,otherEmail].sort().join('-');
        let results = await admin.firestore().collection("Chats").doc(buildDoc).get()
        if(results.exists){
            results = {
                code : 1,
                message : "Message Node Exist already"
            }
        }else{
            let response = await admin.firestore().collection("Chats").doc(buildDoc)
            .set({
                UsersID : [userId,otherId],
                Users : [userEmail,otherEmail],
                messages : "Connected!",
                receiverHasRead : false
            })
            results = {
                code : 1,
                message : "Message Node Exist already"
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