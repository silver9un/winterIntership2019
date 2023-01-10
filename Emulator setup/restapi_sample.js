var request = require('request');
var url = 'http://localhost:8080/bridge/hue/1/action'


request({
    url: url,
    
    headers: {
        'Content-Type': 'application/json'
    },
    
    method: 'PUT',
    body: JSON.stringify({"on":false, "bri": 1}, null, '\t')
    
}, function(err, response, body) {
    var philips = JSON.parse(body);
    console.log(philips);
})