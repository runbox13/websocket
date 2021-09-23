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
            if(Object.messageType === "join") {
                var listOfIds = [];
                console.log("Received message from: " + Object.userId);
                connections[Object.userId] = {
                    connection: connection,
                    userId: Object.userId
                }; 

                console.log(connections[Object.userId].userId + " connected");

                for(key in connections) {
                    listOfIds.push(connections[key].userId);
                }

                for(key in connections) {
                    connections[key].connection.sendUTF(JSON.stringify(
                        {
                            type: "getList",
                            payload: listOfIds
                        }))
                    console.log(listOfIds);
                }
            }
    })

});



