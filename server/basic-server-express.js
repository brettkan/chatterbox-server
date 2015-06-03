var express = require('express');
var app = express();

var messages = [{username: 'defaultName', text: 'defaultText', roomname: 'defaultRoom'}];

var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

app.use(function(req, res, next){
  res.header(headers);
  if (req.method === "OPTIONS") {
    res.send(200);
  } else {
    next();
  }
});

// app.get('/', function (req, res) {
//   res.status(200).set(headers).send({results: messages});
// });

app.get('/classes/messages', function (req, res) {
  res.status(200).set(headers).send({results: messages});
});

app.post('/classes/messages', function(req, res) {
  var tempData = '';
  res.on('data', function(chunk) {
    tempData += chunk;
  });

  res.on('end', function(){
    messages.push(tempData);
  });

  res.status(200).set(headers).send({results: messages});
});

var server = app.listen(1337, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
