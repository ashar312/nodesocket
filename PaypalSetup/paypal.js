const paypal = require('paypal-rest-sdk')
const nodePaypal = {}
paypal.configure({
    "node" : "sandbox",
    "client_id" : "ATfyjMlEUW2tO26ZDHfnMoyizuD3NgBg4Z-EfD14tQ4OWNhfqHnnZze8HfUfgwxlTFO4aZRR5LKco_35",
    "client_secret" : "EJpVSHG_7Z9IqzAQAz5Okh132-TqH50eObazh9fGaVOrimAEM7Hl-4IWMSZ1BqmMQUyFuHWnPrQ46TAZ"
})

exports.data = nodePaypal