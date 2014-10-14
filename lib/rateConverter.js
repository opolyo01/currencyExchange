var fs = require('fs'),
    http = require('http'),
    _ = require('underscore'),
    config = require('./config'),
    auth_config = require('../auth_config');

module.exports = {
  getStaticConversionRates: function(cb) {
    fs.readFile('conversionTable.txt', 'utf8', function(err, data){
        if(err){
            throw err;
        }
        var array = data.toString().split("\n"),
            resp = [];
        for(var i in array) {
            var curAmountArr = array[i].split(/\s+/),
                symbolAndSign = curAmountArr[0],
                currencySymbolArr = symbolAndSign.split("="),
                symbol = currencySymbolArr[0],
                symbolSign = currencySymbolArr[1],
                amount =  curAmountArr[1];
            resp.push({
                symbol: symbol,
                symbolSign: symbolSign,
                amount: amount
            });
        }

        cb.call(this, resp);
    });
  },

  getDynamicConversionRates: function(cb){
    var options = {
      host: 'openexchangerates.org',
      path: '/api/latest.json?app_id='+auth_config.APP_ID
    };

    var self = this;
    var resp = [];

    callback = function(response) {
      var str = '';

      //another chunk of data has been recieved, so append it to `str`
      response.on('data', function (chunk) {
        str += chunk;
      });

      //the whole response has been recieved, so we just print it out here
      response.on('end', function () {
        var obj = JSON.parse(str);
        var rates = obj.rates;
        self._writeToConversionFile(rates);
        _.each(rates, function(amount, symbol){
            var symbolSign = config.symbolSignHash[symbol] ? config.symbolSignHash[symbol] : "?";
            resp.push({
                symbol: symbol,
                symbolSign: symbolSign,
                amount: amount.toFixed(2)
            });
        });
        cb.call(this, resp);
      });
    };

    http.request(options, callback).end();
  },

  _writeToConversionFile: function(rates){
    var stream = fs.createWriteStream("conversionTable.txt");
    var i = 0;
    var numRates = _.toArray(rates).length;
    _.each(rates, function(amount, symbol){
        var symbolSign = config.symbolSignHash[symbol] ? config.symbolSignHash[symbol] : "?";
        i++;
        if(i<numRates){
            fs.appendFileSync("./conversionTable.txt", symbol +"=" + symbolSign + "  "+amount+"\n");
        }
        else{
            fs.appendFileSync("./conversionTable.txt", symbol +"=" + symbolSign + "  "+amount);
        }
    });
  }

};