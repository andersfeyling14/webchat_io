const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

users = [];
connections = [];
messages = [];

let names = ["alice",
    "bobby",
    "charlie",
    "dave",
    "eric",
    "fredrick",
    "gavin",
    "henrietta",
    "ivan",
    "jean",
    "kate",
    "La-a",
    "Ronny"];

function getRandomUsername() {
    let index = Math.floor(Math.random() * Math.floor(names.length));
    console.log("index: ", index);
    let name = names[index];

    return name;
}

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/build/bundled/index.html");
});

app.use('/src', express.static(__dirname + '/build/bundled/src/'));

//Server side connection.
io.on("connection", socket => {
    let username = getRandomUsername();
    socket.username = username;

    connections.push(socket);
    messages.push({username: "Mr. Robot", msg: "*"+username + " connected to the channel"});
    io.emit('update-messages', messages);//Get "saved" messages
    io.emit('update-users', connections.map(con => con.username)); //Update username, except own

    console.log("A user connected. %s users connected", connections.length);


    socket.on("disconnect", () => {
        connections.splice(connections.indexOf(socket), 1);
        io.emit('update-users', connections.map(con => con.username));
        messages.push({username: "Mr. Robot", msg: "*"+username + " disconnected from the channel"});
        io.emit('update-messages', messages);

    });

    socket.on('new-message', msg => {
        messages.push({username, msg});

        console.log(username +": "+msg);
        io.emit('update-messages', messages);
    });

    //Send message list
    socket.on("new-message", () => {

    })
});

server.listen(3000, function () {
    console.log("Listening on *:3000");
});
