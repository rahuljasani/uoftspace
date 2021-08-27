const bodyParser = require('body-parser');
const app = require('express')();
require("dotenv").config()
// Connect to database
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

// Define Express middleware routes
app.use('/api', require('./routes/pay/payments'));
const PORT = 3001;
app.listen(PORT, function() {
  console.log(`Node server listening on port ${PORT}!`);
});