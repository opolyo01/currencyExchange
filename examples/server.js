var _ = require("underscore");
var currencyExchange = require('currencyExchange');
var mockData = require('./mockData');
var express = require('express');
var compression = require('compression');
var app = express();
var port = process.env.PORT || 3000;
var router = express.Router();
var oneDay = 86400000;
var staticRateConverter = "getStaticConversionRates";
var dynamicRateConverter = "getDynamicConversionRates";
var currentRateConverter = dynamicRateConverter;

//We should be calling Dynamic API after every 1 minute
setTimeout(function(){
    currentRateConverter = dynamicRateConverter;
}, 60000);

//Routes
var activityRoute = router.route('/activity');
var currencyConversionRoute = router.route('/currencyConversion');
var conversionRateRoute = router.route('/conversionRate');
var transactionHistoryRoute = router.route('/transactionHistory');
var symbolsRoute = router.route('/symbols');

app.use(compression());
app.use('/paypal', router);

app.use(express.static(__dirname + '/public', { maxAge: oneDay }));

activityRoute.get(function(req, res) {
     res.sendfile(__dirname + '/public/index.html');
});

currencyConversionRoute.get(function(req, res) {
    var amount = req.query.amount;
    var codeFrom = req.query.codeFrom;
    var codeTo = req.query.codeTo;
    if(!amount || !codeFrom || !codeTo){
        res.json({ conversionRate: "Invalid" });
        return;
    }
    getConversionRate(codeFrom, codeTo, function(resp){
        if(!resp || !resp.from.amount || !resp.to.amount){
            res.json({ conversionRate: "Invalid" });
        }
        var from = resp.from;
        var to = resp.to;
        var fromAmount = from.amount;
        var toAmount = to.amount;

        res.json({ conversionRate: (fromAmount/toAmount)*amount });
    });
});

conversionRateRoute.get(function(req, res) {
    var codeFrom = req.query.codeFrom.toUpperCase();
    var codeTo = req.query.codeTo.toUpperCase();
    
    getConversionRate(codeFrom, codeTo, function(resp){
        if(!resp){
            res.json({ conversionRate: "Invalid" });
        }
        var from = resp.from;
        var to = resp.to;
        var fromAmount = from.amount;
        var toAmount = to.amount;
        res.json({ conversionRate: fromAmount/toAmount, symbol: to.symbol, symbolSign: to.symbolSign});
    });
});

transactionHistoryRoute.get(function(req, res) {
    res.json(mockData.transactionHistory);
});

symbolsRoute.get(function(req, res){
    currencyExchange.getDynamicConversionRates(function(rates){
        res.json(rates);
    });
});

function getConversionRate(codeFrom, codeTo, cb){
    if(_.isEmpty(codeFrom) || _.isEmpty(codeTo)){
        cb.call(this, false);
        return;
    }
    console.log(currentRateConverter);
    currencyExchange[currentRateConverter](function(rates){
        var from = _.find(rates, function(rate){
            return rate.symbol === codeFrom;
        });
        var to = _.find(rates, function(rate){
            return rate.symbol === codeTo;
        });
        if(_.isEmpty(rates) || _.isEmpty(to) || _.isEmpty(from)){
            cb.call(this, false);
            return;
        }
        currentRateConverter = staticRateConverter;
        cb.call(this, {from: from, to: to});
    });
}
// Start the server
app.listen(port);
console.log('Running on port ' + port);