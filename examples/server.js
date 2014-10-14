var currencyExchange = require('currencyExchange');
var mockData = require('./mockData');
var express = require('express');
var compression = require('compression');
var app = express();
var port = process.env.PORT || 3000;
var router = express.Router();
var oneDay = 86400000;

//Routes
var activityRoute = router.route('/activity');
var currencyConversionRoute = router.route('/currencyConversion');
var conversionRateRoute = router.route('/conversionRate');
var transactionHistoryRoute = router.route('/transactionHistory');

app.use(compression());
app.use('/paypal', router);

app.use(express.static(__dirname + '/public', { maxAge: oneDay }));

activityRoute.get(function(req, res) {
     res.sendfile(__dirname + '/public/index.html');
});

currencyConversionRoute.get(function(req, res) {
     res.json({ message: 'currencyConversionRoute' });
});

conversionRateRoute.get(function(req, res) {
     res.json({ message: 'conversionRateRoute' });
});

transactionHistoryRoute.get(function(req, res) {
    res.json(mockData.transactionHistory);
});

// Start the server
app.listen(port);
console.log('Running on port ' + port);