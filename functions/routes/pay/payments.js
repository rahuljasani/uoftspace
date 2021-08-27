const stripe = require("stripe")("");
const uuid = require("uuid/v4");
const router = require('express').Router();

router.post("/stripe", async (req, res) => {
    let error, status;
    let token = JSON.stringify(request.body);
    console.log(token.email);
    try{
        const customer = await stripe.customers.create({
            email: token.email,
            sourcer: token.id
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

        response.status(200).json({error, status: "Good to go"});
        console.log(charge);
    }
    catch(err){
        console.log(err)
        response.status(500).json({error: err, status})
    }
})

module.exports = router;