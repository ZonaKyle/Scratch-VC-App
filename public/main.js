let Peer = require("simple-peer")
let socket = io()
const video = document.querySelector('video')
let client = {}

// This function handles the response from the asynchronous call to getice.php
function onIceSuccess(data){
    // Parse the JSON string. Then grab the value of v, which is the candidates
    iceObj = JSON.parse(data).v;
    // Pass the ICE candidates object to the constructor.
    var pc = new RTCPeerConnection(iceObj);
}
$(document).ready(function(){
     // Call post() to get the ICE candidates.
     $.post("getice.php", null, onIceSuccess);
});

//camera selection
const getCameraSelection = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    const options = videoDevices.map(videoDevice => {
      return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
    });
    cameraOptions.innerHTML = options.join('');
};
  

//get stream
/*navigator.mediaDevices.getUserMedia({video: true, audio: true})*/
if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia({video: true, audio: true})

    .then(stream => {
        socket.emit('NewClient')
        video.srcObject = stream
        video.play()

        //used to initialize peer
        function InitPeer(type){
            let peer = new Peer({ 
                initiator: (type == 'init') ? true : false, 
                /*CAN I ENTER 'iceObj' HERE AS SETTINGS? */
                iceObj,
                /*config: { iceServers: { urls: 'https://zonakyle:5cc95db4-9dc0-11ea-8d27-0242ac150003@global.xirsys.net/_turn/WoodenWheels' }},*/ 
                stream: stream, 
                trickle: false
            })
            /* var pc = peer(iceObj); is this needed with the settings above?*/

            peer.on('stream', function(stream){
                CreateVideo(stream)
            })
            peer.on('close', function(){
                document.getElementById("peerVideo").remove();
                peer.destroy()
            })
            return peer
        }
        //for peer of type init
        function MakePeer(){
            client.gotAnswer = false
            let peer = InitPeer('init')
            peer.on('signal', function(data){
                if(!client.gotAnswer) {
                    socket.emit('Offer', data)
                }
            })
            client.peer = peer
        }
         //for peer of type not init
        function FrontAnswer(offer){
            let peer = InitPeer('notInit')
            peer.on('signal', (data) => {
                socket.emit('Answer', data)
            })
            peer.signal(offer)
        }

        function SignalAnswer(answer){
            client.gotAnswer = true
            let peer = client.peer
            peer.signal(answer)
        }

        function CreateVideo(stream) {
            let video = document.createElement('video')
            video.id = 'peerVideo'
            video.srcObject = stream
            video.class = "embed-responsive-item"
            document.querySelector('#peerDiv').appendChild(video)
            video.play()
        }

        function SessionActive(){
            document.write("Eh, you sure someone invited you here, chief? Room's taken")
        }

        socket.on('BackOffer', FrontAnswer)
        socket.on('BackAnswer', SignalAnswer)
        socket.on('SessionActive', SessionActive)
        socket.on('CreatePeer', MakePeer)

    })
    ) 
        const updatedConstraints = {
          ...constraints,
          deviceId: {
            exact: cameraOptions.value
          }
        }       
    
.catch(err => document.write(err));
getCameraSelection();