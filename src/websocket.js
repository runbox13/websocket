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
    const connection = request.accept(null, request.origin); 
    
    connection.on('message', function(message) {
            var Object = JSON.parse(message.utf8Data);
            console.log(Object.userId);
            if(Object.messageType === "join") {
                console.log("Received message from: " + Object.userId);
                connections[Object.userId] = {
                    connection: connection,
                    userId: Object.userId
                }; 
                console.log(connections[Object.userId].userId + " connected");
                
                for(key in connections) {
                    console.log(connections[key].userId);
                    console.log("Sent message to: " + connections[key].userId);
                }
            }
            

        
    })

});



