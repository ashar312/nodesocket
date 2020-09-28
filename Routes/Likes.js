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
            await admin.firestore().collection("Chats").doc(buildDoc)
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

router.get('/send-like',async (req,res,next) => {
    const myId = req.query.myId
    const otherId = req.query.otherId
    const status = req.query.status === "1" ? true : false
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
                const obj = {
                    FirstLike : status
                }
                await admin.firestore().collection("LikesList").doc(buildLikeID).update(obj)
                results = {
                    code : 1,
                    message : "Successful"
                }
            }else if(myId === results.SecondPerson){
                const obj = {
                    SecondLike : status
                }
                await admin.firestore().collection("LikesList").doc(buildLikeID).update(obj)
                results = {
                    code : 1,
                    message : "Successful"
                }
            }
        }else{
            const obj = {
                FirstLike : true,
                FirstPerson : myId,
                SecondLike : false,
                SecondPerson : otherId,
                Users : [myId,otherId]
            }
            await admin.firestore().collection("LikesList").doc(buildLikeID).set(obj)
            results = {
                code : 1,
                message : "Successful"
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

router.get('/user-likes',async (req,res,next) => {
    const id = req.query.id
    var myLikes = []
    var likedBy = []
    var mutualLikes = []
    try {
        let results = await admin.firestore().collection("LikesList").where("Users","array-contains",id).get()
        results = results.docs.map(doc => doc.data())
        if(results.length > 0){
            for(let i = 0; i < results.length; i ++){
                if(results[i].FirstPerson === id){
                    if(results[i].FirstLike === true && results.SecondLike === false){
                        myLikes.push({
                            like : results[i],
                            otherPerson : results[i].SecondPerson
                        })
                        //melikes
                    }else if(results[i].FirstLike === false && results.SecondLike === true){
                        likedBy.push({
                            like : results[i],
                            otherPerson : results[i].SecondPerson
                        })
                        //other likes
                    }else if(results[i].FirstLike === true && results[i].SecondLike === true){
                        mutualLikes.push({
                            like : results[i],
                            otherPerson : results[i].SecondPerson
                        })
                        //mutual likes
                    }
                }else if(results[i].SecondPerson === id){
                    if(results[i].FirstLike === false && results.SecondLike === true){
                        myLikes.push({
                            like : results[i],
                            otherPerson : results[i].FirstPerson
                        })
                        //melikes
                    }else if(results[i].FirstLike === true && results[i].SecondLike === false){
                        //other likes
                        likedBy.push({
                            like : results[i],
                            otherPerson : results[i].FirstPerson
                        })
                    }else if(results[i].FirstLike === true && results[i].SecondLike === true){
                        mutualLikes.push({
                            like : results[i],
                            otherPerson : results[i].FirstPerson
                        })
                        //mutual likes
                    }
                }
            }
        }
        results = {
            myLikes,
            likedBy,
            mutualLikes
        }
      //  console.log(results)
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