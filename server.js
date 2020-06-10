const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = process.env.PORT || 3000

// Node Get ICE STUN and TURN list
let o = {
    format: "urls"
};

let bodyString = JSON.stringify(o);
let https = require("https");
let options = {
    host: "global.xirsys.net",
    path: "/_turn/WoodenWheels",
    method: "PUT",
    headers: {
        "Authorization": "Basic " + Buffer.from("zonakyle:5cc95db4-9dc0-11ea-8d27-0242ac150003").toString("base64"),
        "Content-Type": "application/json",
        "Content-Length": bodyString.length
    }
};
let httpreq = https.request(options, function(httpres) {
    let str = "";
    httpres.on("data", function(data){ str += data; });
    httpres.on("error", function(e){ console.log("error: ",e); });
    httpres.on("end", function(){ 
        console.log("ICE List: ", str);
    });
});
httpreq.on("error", function(e){ console.log("request error: ",e); });
httpreq.end();

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
http.listen(port, () => console.log("Active on port " + port))

