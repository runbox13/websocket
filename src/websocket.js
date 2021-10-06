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

    //Set a DJ from the queue
    var setDJ = (room) => {
        room.dj = room.queue.shift();

        for (var key in room.users) {
            room.users[key].connection.sendUTF(JSON.stringify({
                type: "setDj",
                payload: room.dj
            }));
        }
    }

    var jumpOff = (room) => {
        setDJ(room);

        //Send every user in room the new queue list
        for (var key in room.users) {
            room.users[key].connection.sendUTF(JSON.stringify({
                type: "getQueue",
                payload: room.queue
            }));
        }
    }

    connection.on('message', function (message) {
        var payload = JSON.parse(message.utf8Data);

        //If the DJ jumps off, set the next DJ
        if (payload.messageType === "jumpOff") {
            var room = connections[payload.roomId];

            jumpOff(room);
        }


        //Queue - Add, delete
        if (payload.messageType === "queue") {
            var room = connections[payload.roomId];
            //Delete user from array
            if (payload.action === "DELETE") {
                var index = room.queue.map(e => { return e.id }).indexOf(payload.user.id);
                room.queue.splice(index, 1);
            } else { //Add user to queue array if user isn't already the dj
                if (payload.user !== room.dj) {
                    //If a DJ exists check if the user ID matches, if it doesn't add to queue
                    if (room.dj != null) {
                        if (room.dj.id !== payload.user.id) {
                            room.queue.push(payload.user);
                        }
                    }
                    else {// add user as DJ if there is no current DJ
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
                    queue: [],
                    songPlaying: "",
                    songQueue: []
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

                //Create object of users in room
                for (key in connections[room.id].users) {
                    users[connections[room.id].users[key].user.id] = connections[room.id].users[key].user;
                }

                //Send instantiating object of room to clients
                for (key in connections[room.id].users) {
                    connections[room.id].users[key].connection.sendUTF(JSON.stringify(
                        {
                            type: "getRoom",
                            payload: users,
                            queue: connections[room.id].queue,
                            dj: connections[room.id].dj,
                            action: action,
                        }))
                }
            }

            connection.sendUTF(JSON.stringify({
                type: "setTrack",
                songPlaying: connections[room.id].songPlaying
            }));

            //When user joins, send all users the list of users
            sendList("ADD");

            //Delete connection in room and send a new list of users to clients
            connection.on('close', message => {
                var roomConnection = connections[room.id];

                delete connections[room.id].users[payload.user.id];
                if (roomConnection.dj != null) {
                    if (roomConnection.dj.id == payload.user.id) {
                        console.log("setting dj");
                        setDJ(roomConnection);
                    }
                }

                if (roomConnection.queue != null) {
                    for (var key in roomConnection.queue) {
                        if (roomConnection.queue[key].id == payload.user.id) {
                            var index = roomConnection.queue.map(e => { return e.id }).indexOf(payload.user.id);
                            roomConnection.queue.splice(index, 1);
                            break;
                        }
                    }
                }

                //If the room is empty, delete the room connection instance
                if (Object.keys(connections[room.id].users).length == 0) {
                    delete connections[room.id];
                }
                else sendList("DELETE");
            });
        }

        if (payload.messageType === "setTrack") {
            var room = connections[payload.roomId];
            room.songQueue.push(payload.track);
            for (var key in room.users) {
                room.users[key].connection.sendUTF(JSON.stringify({
                    type: "getSongQueue",
                    songQueue: room.songQueue,
                }));
            }
        }

        if(payload.messageType === "nextSong") {
            var room = connections[payload.roomId];
            room.songQueue.shift();
            for (var key in room.users) {
                room.users[key].connection.sendUTF(JSON.stringify({
                    type: "nextSong",
                    songQueue: room.songQueue,
                }));
            }
        }

        if(payload.messageType === "djPause") {
            var room = connections[payload.roomId];
            for(var key in room.users) {
                room.users[key].connection.sendUTF(JSON.stringify({
                    type: "djPause",
                    isPaused: true
                }))
            }
        }

        if(payload.messageType === "djPlay") {
            var room = connections[payload.roomId];
            for(var key in room.users) {
                room.users[key].connection.sendUTF(JSON.stringify({
                    type: "djPlay",
                    isPaused: false
                }));
            }
        }

        if(payload.messageType === "getTime") {
            var room = connections[payload.roomId];
            for(var key in room.users) {
                room.users[key].connection.sendUTF(JSON.stringify({
                    type: "getTime",
                    time: payload.time
                }));
            }
        }

    })

});



