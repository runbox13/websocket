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


wsServer.on('request', function(request) {
    const connection = request.accept(null, request.origin); 
    
    connection.on('message', function(message) {
            var payload = JSON.parse(message.utf8Data);
            var room = JSON.parse(payload.room);
            var user = payload.user;
            
            if(payload.messageType === "queue") {
                connections[room.id].queue.push(payload.payload)
            }

            if(payload.messageType === "join") {
                
                //assume connection exists
                if(!connections.hasOwnProperty([room.id]))
                connections[room.id] = {
                    users: {},
                    room: room,
                    dj: "",
                    queue: []
                }

                connections[room.id].users[user.id] = {
                    connection: connection,
                    user: user
                }

                console.log("User: " + user.display_name + " joined chatroom: " + room.name);

                console.log(connections[room.id].users[user.id].id + " connected to " + 
                connections[room.id].room.id);

                var sendList = (action) => {
                    var users = {};

                    for(key in connections[room.id].users) {
                        users[connections[room.id].users[key].user.id] = connections[room.id].users[key].user;
                    }

                    for(key in connections[room.id].users) {
                        connections[room.id].users[key].connection.sendUTF(JSON.stringify(
                            {
                                type: "getList",
                                payload: users,
                                action: action,
                            }))
                    }
                }
                sendList("ADD");

                connection.on('close', message => {
                    delete connections[room.id].users[payload.user.id];
                    if(Object.keys(connections[room.id].users).length == 0) {
                        delete connections[room.id];
                    }
                    else sendList("DELETE");
                    console.log(connections);
                });     
                
                
            }
            
            
    })

});



