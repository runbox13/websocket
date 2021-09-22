const webSocketServerPort = 8080;
const webSocketServer = require('websocket').server;
const http = require('http');

const server = http.createServer();
server.listen(webSocketServerPort);

const wsServer = new webSocketServer({
    httpServer: server
});

const connections = {};

console.log("Server running");

function getUserId(request) {
    
}

wsServer.on('request', function(request) {
    var user;

    const connection = request.accept(null, request.origin); 
    
    connection.on('message', function(message) {
            user = JSON.parse(message.utf8Data);
            console.log("Received message: " + user.id);
            connections[user.id] = connection; 

        for(key in connections) {
            connections[key].sendUTF(message.utf8Data);
            console.log("Sent message to: " + connections[key].id);
        }
    })

});



