require("dotenv").config()
const stripe = require("stripe")("sk_test_a2tEhDvXIGjIzTZnboxshnCG00oGnw77x6");
const uuid = require("uuid/v4");
const router = require('express').Router();

router.post("/stripe", async (req, res) => {
    let error, status;
    let {token} = req.body;
    try{
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        });

        const idempotency_key = uuid();
        const charge = await stripe.charges.create(
            {
                amount: 100 * 100,  
                currency: "usd",
                customer: customer.id,
                receipt_email: token.email,
                description: `Purchased from UofTSpace`
            },
            {
                idempotency_key
            }
        );

        res.status(200).json({error, status: "Good to go"});
        console.log(charge);
    }
    catch(err){
        console.log(err)
        res.status(500).json({error: err, status})
    }
})

module.exports = router;

