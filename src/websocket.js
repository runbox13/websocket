const webSocketServerPort = 8080;
const webSocketServer = require('websocket').server;
const http = require('http');

const server = http.createServer();
server.listen(webSocketServerPort);

const wsServer = new webSocketServer({
    httpServer: server
});

const connections = {
};

console.log("Server running");

function getUserId(request) {
    
}

wsServer.on('request', function(request) {
    const connection = request.accept(null, request.origin); 
    
    connection.on('message', function(message) {
            var payload = JSON.parse(message.utf8Data);
            var room = JSON.parse(payload.room);
            
            if(payload.messageType === "join") {
                
                //assume connection exists
                if(!connections.hasOwnProperty([room.id]))
                connections[room.id] = {
                    users: {},
                    room: room
                }

                connections[room.id].users[payload.userId] = {
                    connection: connection,
                    userId: payload.userId
                }

                var listOfIds = [];
                console.log("User: " + payload.userId + " joined chatroom: " + room.id);

                console.log(connections[room.id].users[payload.userId].userId + " connected to " + 
                connections[room.id].room.id);

                for(key in connections[room.id].users) {
                    listOfIds.push(connections[room.id].users[key].userId);
                    console.log(connections[room.id].users[key].userId);
                    console.log("te");
                }

                for(key in connections[room.id].users) {
                    connections[room.id].users[key].connection.sendUTF(JSON.stringify(
                        {
                            type: "getList",
                            payload: listOfIds
                        }))
                    console.log(listOfIds);
                }
            }
    })

});



