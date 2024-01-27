// create web server
// 1. load modules
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
// 2. create web server
var server = http.createServer(function(request,response){
    // 2.1 get url
    var parsedUrl = url.parse(request.url);
    var resource = parsedUrl.pathname;
    // 2.2 remove first slash
    if(resource == '/'){
        resource = '/index.html';
    }
    // 2.3 read file from web folder
    var resourcePath = '.' + resource;
    console.log(resourcePath);
    fs.readFile(resourcePath, 'utf-8', function(error, data){
        if(error){
            response.writeHead(500, {'Content-Type':'text/html'});
            response.end('500 Internal Server '+error);
        }else{
            response.writeHead(200, {'Content-Type':'text/html'});
            response.end(data);
        }
    });
});
// 3. start server
server.listen(80, function(){
    console.log('Server running at http://' + server.address().address + ':' + server.address().port);
}
);
// 4. add event listener
var comments = [];
server.on('request', function(request, response){
    // 4.1 get url
    var parsedUrl = url.parse(request.url);
    var resource = parsedUrl.pathname;
    // 4.2 remove first slash
    if(resource == '/'){
        resource = '/index.html';
    }
    // 4.3 check if posting comment
    if(resource == '/comment'){
        // 4.3.1 get data
        var body = '';
        request.on('data', function(data){
            body += data;
        });
        request.on('end', function(){
            var comment = qs.parse(body);
            comments.push(comment);
            console.log(comments);
            // 4.3.2 redirect to home page
            response.writeHead(302, {
                'Location': './'
            });
            response.end();
        });
    }
});
// 5. add event listener
server.on('request', function(request, response){
    // 5.1 get url
    var parsedUrl = url.parse(request.url);
    var resource = parsedUrl.pathname;
    // 5.2 remove first slash
    if(resource == '/'){
        resource = '/index.html';
    }
    // 5.3 check if posting comment
    if(resource == '/comment'){
        // 5.3.1 get data
        var body = '';
        request.on('data', function(data){
            body += data;
        });
        request.on('end', function(){
            var comment = qs.parse(body);
            comments.push(comment);
            console.log(comments);
            // 5.3.2 redirect to home page
            response.writeHead(302, {
                'Location': './'
            });
            response.end();
        });
    }
});