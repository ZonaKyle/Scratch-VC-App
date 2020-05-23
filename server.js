const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = process.env.PORT || 3000

const Ministun = require("ministun");

const stunConfig = {
	udp4: true,
	upd6: true,
	port: 3478,
	log: null,
	err: null,
	sw: true
};

const stunServer = new Ministun(stunConfig);


app.use(express.static(__dirname + '/public'))
let clients = 0

io.on('connection', function(socket){
    socket.on("NewClient", function(){
        if (clients < 2){
            if (clients == 1){
                this.emit('CreatePeer')
            }
        }
        else
            this.emit('SessionActive')
        clients++;
    })
    socket.on('Offer', SendOffer)
    socket.on('Answer', SendAnswer)
    socket.on('disconnect', Disconnect)
})

function Disconnect(){
    if(clients > 0)
        clients--
}
function SendOffer(offer){
    this.broadcast.emit('BackOffer', offer)

}
function SendAnswer(data){
    this.broadcast.emit('BackAnswer', data)

}
async function startServer() {
	await server.start();
}

async function stopServer() {
	await server.stop();
}

http.listen(port, () => console.log("Active on port " + port))

