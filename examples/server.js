var currencyExchange = require('currencyExchange');
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var router = express.Router();

//Routes
var activityRoute = router.route('/activity');
var currencyConversionRoute = router.route('/currencyConversion');
var conversionRateRoute = router.route('/conversionRate');

app.use('/paypal', router);

activityRoute.get(function(req, res) {
     res.json({ message: 'activityRoute' });
});

currencyConversionRoute.get(function(req, res) {
     res.json({ message: 'currencyConversionRoute' });
});

conversionRateRoute.get(function(req, res) {
     res.json({ message: 'conversionRateRoute' });
});

// Start the server
app.listen(port);
console.log('Running on port ' + port);