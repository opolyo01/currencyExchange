Routes Tested
=========
http://localhost:3000/paypal/conversionRate?codeFrom=RUB&codeTo=EUR //Good
http://localhost:3000/paypal/currencyConversion?codeFrom=RUB&codeTo=EUR&amount=5 //Good
http://localhost:3000/paypal/currencyConversion?codeFrom=RUB&codeTo=EUR&amount=1 //Good
http://localhost:3000/paypal/currencyConversion?codeFrom=RUB&codeTo=EUR  //Invalid
http://localhost:3000/paypal/currencyConversion?codeFrom=RUB //Invalid

http://localhost:3000/paypal/activity