const express = require('express')
const router = express.Router()
const paypal = require('paypal-rest-sdk')

router.get('/',async (req,res,next) => {
    res.render('index')
})

function package(id){
    switch(id){
        case "1":
            return {
                cost : "4.99",
                expiryDays : '7'
            };
        case "2":
            return {
                cost : "29.99",
                expiryDays : '30'
            }
        case "3":
            return {
                cost : "59.99",
                expiryDays : '93'
            }
        case "4":
            return {
                cost : "119.99",
                expiryDays : '365'
            }
    }
}
// URL://pay?package=2
// Package == 1, 2, 3, 4
router.get('/pay',async (req,res,next) => {
    console.log(req.query.userId,req.query.package)
    console.log("pack",package(req.query.package))
    var cost = package(req.query.package)
    console.log("costNew",cost)
    var create_payment_json = {
        intent: "sale",
        payer: {
            payment_method: "paypal"
        },
        redirect_urls: {
            return_url: `https://dateumm.herokuapp.com/success?cost=${cost.cost}&day=${cost.expiryDays}&userId=${req.query.userId}`,
            cancel_url: "https://dateumm.herokuapp.com/cancel"
        },
        transactions: [
            {
                item_list: {
                    items: [
                        {
                            name: "item",
                            sku: "item",
                            price: cost.cost,
                            currency: "USD",
                            quantity: 1
                        }
                    ]
                },
                amount: {
                    currency: "USD",
                    total: cost.cost
                },
                description: "This is the payment description."
            }
        ]
    };

    paypal.payment.create(create_payment_json, function(error, payment) {
        if (error) {
            console.log(error);
        } else {
            console.log("Create Payment Response");
            console.log(payment);
            //res.send("Ok")
            res.redirect(payment.links[1].href);
        }
    });
})

module.exports = router;