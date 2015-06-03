var url = require("url");
var path = require("path");
var fs = require("fs");

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var requestHandler = function(request, response) {

  var uri = url.parse(request.url).pathname;


  var contentTypesByExtension = {
     ".html": "text/html",
     ".css":  "text/css",
     ".js":   "text/javascript"
   };

  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.

  console.log("Serving request type " + request.method + " for url " + request.url);
  // // The outgoing status.
  var statusCode = 200;
  var endResponse;

  var headers = defaultCorsHeaders;
  headers['Content-Type'] = contentTypesByExtension[path.extname(request.url)];
  console.log(headers);
  if (request.method === "OPTIONS") {
    response.writeHead(statusCode, headers);
    response.end();
  }
  else if (request.method === "GET") {

    if (request.url === "/" || request.url === "/index.html" ) {
      fs.readFile('/Users/student/2015-05-chatterbox-server/client/index.html', function(err, data){
        if (err){
          console.log(err);
        }
        else {
          console.log(data);
          statusCode = 200;
          response.writeHead(statusCode, headers);
          response.end(data);
        }
      });
    } else if (request.url === "/classes/messages" || request.url === "/classes/room1") {
      console.log('this should on send and fetch')
      statusCode = 200;
      response.writeHead(statusCode, headers);
      endResponse = JSON.stringify({results: messages});
      response.end(endResponse);
    } else {
      fs.readFile(request.url, "binary", function(err, data) {
        if (err) {
          statusCode = 404;
          response.writeHead(statusCode, headers);
          response.end();
        } else {
          console.log("this should fire on all urls outside of index");
          statusCode = 200;
          response.writeHead(statusCode, headers);
          response.write(data, "binary");
          response.end();
        }

      });

      statusCode = 404;
      response.end();
    }

  } else if (request.method === "POST") {

    statusCode = 201;

    var requestBody = {};

    request.on("data", function(data){
      requestBody = JSON.parse(data);
    });


    request.on("end", function(){
      messages.push(requestBody);
    });

    response.writeHead(statusCode, headers);
    var endResponse = JSON.stringify({results: messages});
    response.end(endResponse);

  }





  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.

  // response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.

  // response.end(endResponse);
};

var messages = [{username: 'defaultName', text: 'defaultText', roomname: 'defaultRoom'}];


exports.requestHandler = requestHandler;

