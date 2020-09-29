const express = require('express')
const router = express.Router()
const paypal = require('paypal-rest-sdk')

router.get('/',async (req,res,next) => {
    res.render('index')
})

router.get('/pay',async (req,res,next) => {
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
                            price: "1.00",
                            currency: "USD",
                            quantity: 1
                        }
                    ]
                },
                amount: {
                    currency: "USD",
                    total: "1.00"
                },
                description: "This is the payment description."
            }
        ]
    };

    paypal.payment.create(create_payment_json, function(error, payment) {
        if (error) {
            throw error;
        } else {
            console.log("Create Payment Response");
            console.log(payment);
            //res.send("Ok")
            res.redirect(payment.links[1].href);
        }
    });
})

module.exports = router;