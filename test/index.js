var should = require('chai').should(),
    currencyConversion = require('../lib/rateConverter');

describe('#getStaticConversionRates', function() {
  it('getStaticConversionRates', function(done) {
    currencyConversion.getStaticConversionRates(function(rates){
      rates.length.should.equal(168);
      done();
    });
  });
});

describe('#getDynamicConversionRates', function() {
  it('getDynamicConversionRates', function(done) {
    currencyConversion.getDynamicConversionRates(function(rates){
      rates.length.should.equal(168);
      done();
    });
  });
});