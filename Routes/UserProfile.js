const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')

//side bar api
router.get('/:id',async (req,res,next) => {
    const id = req.params.id
    try {
        let results = await admin.firestore().collection("Users").doc(id).get()
        results = results.data()
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


module.exports = router;