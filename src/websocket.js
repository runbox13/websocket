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




wsServer.on('request', function (request) {
    const connection = request.accept(null, request.origin);

    connection.on('message', function (message) {
        var payload = JSON.parse(message.utf8Data);
        //Set a DJ from the queue
        var setDJ = (room, type) => {
            room.dj = room.queue.pop();

            for (var key in room.users) {
                room.users[key].connection.sendUTF(JSON.stringify({
                    type: "setDj",
                    payload: room.dj
                }));
            }
        }

        //If the DJ jumps off, set the next DJ
        if (payload.messageType === "jumpOff") {
            var room = connections[payload.roomId];
            setDJ(room);

            //Send every user in room the new queue list
            for (var key in room.users) {
                room.users[key].connection.sendUTF(JSON.stringify({
                    type: "getQueue",
                    payload: room.queue
                }));
            }
        }

        //Queue - Add, delete
        if (payload.messageType === "queue") {
            var room = connections[payload.roomId];
            //Delete user from array
            if (payload.action === "DELETE") {
                var index = room.queue.indexOf(payload.user);
                room.queue.splice(index, 1);
            } else { //Add user to queue array if user isn't already the dj
                if (payload.user !== room.dj) {
                    //If a DJ exists check if the user ID matches, if it doesn't add to queue
                    if (room.dj != null) {
                        if (room.dj.id !== payload.user.id) {
                            room.queue.push(payload.user);
                        }
                    }
                    else {// add user to queue if the DJ doesn't match
                        room.queue.push(payload.user);
                        setDJ(room);
                    }
                }
            }
            //Send every user in room the new queue list
            for (var key in room.users) {
                room.users[key].connection.sendUTF(JSON.stringify({
                    type: "getQueue",
                    payload: room.queue
                }));
            }
        }


        //When user joins
        if (payload.messageType === "join") {
            var room = payload.room;
            var user = payload.user;

            //assume connection exists
            if (!connections.hasOwnProperty([room.id]))
                connections[room.id] = {
                    users: {},
                    room: room,
                    dj: null,
                    //Array of user objects to use queue pop/push functionalities
                    queue: []
                }

            connections[room.id].users[user.id] = {
                connection: connection,
                user: user
            }

            console.log("User: " + user.display_name + " joined chatroom: " + room.name);

            console.log(connections[room.id].users[user.id].user.id + " connected to " +
                connections[room.id].room.id);

            //Send list of users to all users when a user joins
            var sendList = (action) => {
                var users = {};

                for (key in connections[room.id].users) {
                    users[connections[room.id].users[key].user.id] = connections[room.id].users[key].user;
                }

                for (key in connections[room.id].users) {
                    connections[room.id].users[key].connection.sendUTF(JSON.stringify(
                        {
                            type: "getList",
                            payload: users,
                            action: action,
                        }))
                }
            }

            //When user joins, send all users the list of users
            sendList("ADD");

            connection.on('close', message => {
                delete connections[room.id].users[payload.user.id];
                if (Object.keys(connections[room.id].users).length == 0) {
                    delete connections[room.id];
                }
                else sendList("DELETE");
                console.log(connections);
            });


        }


    })

});



