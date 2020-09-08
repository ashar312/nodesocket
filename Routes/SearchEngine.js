const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
router.get('/',async (req,res,next) => {
 //   console.log("ss",req.query)
    try{
        var minAge = 18
        var maxAge = 96
        var minHeight = 3
        var maxHeight = 10
        if(req.query.minAge){
            minAge = req.query.minAge
            maxAge = req.query.maxAge
        }
        if(req.query.minHeight){
            minHeight = req.query.minHeight
            maxHeight = req.query.maxHeight
        }
        let results = await admin.firestore().collection("Users")
        .where("Age", ">", Number(minAge))
        .where("Age", "<", Number(maxAge))
        .get()
        var subQuery = req.query
        delete subQuery['minAge']
        delete subQuery['maxAge']
        delete subQuery['id']
       // console.log("assa",subQuery)
        results = results.docs.map(doc => doc.data())
   //     console.log(req.query)
        if(req.query){
       //     console.log("chala")
            results = filteration(subQuery,results)
        }
       // console.log(results)
        res.status(200).json({results})
    }catch(e){
        const results = {
            code : -1,
            message : e.message
        }
        res.status(200).json({results})
    }
})

function filteration(query,res){
    var tempArray = []
 //   console.log(query.length)
    if(Object.keys(query).length > 0){
        for(let i = 0; i < res.length; i ++){
            if(query.Sect){
                if(query.Sect !== res[i].Sect){
                    continue
                }
            }
            if(query.Body){
                if(query.Body !== res[i].Body){
                    continue
                }
            }
            if(query.Gender){
                if(query.Gender !== res[i].Gender){
                    continue
                }
            }
            if(query.Hijab){
                if(query.Hijab !== res[i].Hijab){
                    continue
                }
            }
            if(query.Profession){
                if(query.Profession !== res[i].Profession){
                    continue
                }
            }
            if(query.Religiousness){
                if(query.Religiousness !== res[i].Religiousness){
                    continue
                }
            }
            if(query.Beard){
                if(query.Beard !== res[i].Beard){
                    continue
                }
            }
            if(query.Smoke){
                if(query.Smoke !== res[i].Smoke){
                    continue
                }
            }
            if(query.HairColor){
                if(query.HairColor !== res[i].HairColor){
                    continue
                }
            }
            if(query.HaveChildren){
                if(query.HaveChildren !== res[i].HaveChildren){
                    continue
                }
            }
            if(query.WantChildren){
                if(query.WantChildren !== res[i].WantChildren){
                    continue
                }
            }
            if(query.Nationality){
                if(query.Nationality !== res[i].Nationality){
                    continue
                }
            }
            if(query.Country){
                if(query.Nationality !== res[i].Country){
                    continue
                }
            }
            if(query.Region){
                if(query.Region !== res[i].Region){
                    continue
                }
            }
            tempArray.push(res[i])
        }
        return tempArray
    }else{
        return res
    }
    
}

module.exports = router;