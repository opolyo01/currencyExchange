#!/usr/bin/env node
var currencyConversion = require('../index');


currencyConversion.getDynamicConversionRates(function(rates){
  console.log(rates.length + " currencies updated");
});