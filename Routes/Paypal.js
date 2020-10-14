const express = require('express')
const router = express.Router()
const paypal = require('paypal-rest-sdk')

router.get('/',async (req,res,next) => {
    res.render('index')
})

function package(id){
    switch(id){
        case "1":
            return "4.99";
        case "2":
            return "29.99";
        case "3":
            return "59.99";
        case "4":
            return "119.99";
    }
}
// URL://pay?package=2
// Package == 1, 2, 3, 4
router.get('/pay',async (req,res,next) => {
    console.log(req.query.userId,req.query.package)
    console.log("pack",package(req.query.package))
    var cost = package(req.query.package)
    var create_payment_json = {
        intent: "sale",
        payer: {
            payment_method: "paypal"
        },
        redirect_urls: {
            return_url: "http://localhost:3002/success",
            cancel_url: "http://localhost:3002/cancel"
        },
        transactions: [
            {
                item_list: {
                    items: [
                        {
                            name: "item",
                            sku: "item",
                            price: cost,
                            currency: "USD",
                            quantity: 1
                        }
                    ]
                },
                amount: {
                    currency: "USD",
                    total: cost
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