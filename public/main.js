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
     
/* magnifying glass, credit to w3schools.com */
function magnify(imgID, zoom) {
    var img, glass, w, h, bw;
    img = document.getElementById(imgID);
    /*create magnifier glass:*/
    glass = document.createElement("DIV");
    glass.setAttribute("class", "img-magnifier-glass");
    /*insert magnifier glass:*/
    img.parentElement.insertBefore(glass, img);
    /*set background properties for the magnifier glass:*/
    glass.style.backgroundImage = "url('" + img.src + "')";
    glass.style.backgroundRepeat = "no-repeat";
    glass.style.backgroundSize = (img.width * zoom) + "px " + (img.height * zoom) + "px";
    bw = 3;
    w = glass.offsetWidth / 2;
    h = glass.offsetHeight / 2;
    /*execute a function when someone moves the magnifier glass over the image:*/
    glass.addEventListener("mousemove", moveMagnifier);
    img.addEventListener("mousemove", moveMagnifier);
    /*and also for touch screens:*/
    glass.addEventListener("touchmove", moveMagnifier);
    img.addEventListener("touchmove", moveMagnifier);
    function moveMagnifier(e) {
      var pos, x, y;
      /*prevent any other actions that may occur when moving over the image*/
      e.preventDefault();
      /*get the cursor's x and y positions:*/
      pos = getCursorPos(e);
      x = pos.x;
      y = pos.y;
      /*prevent the magnifier glass from being positioned outside the image:*/
      if (x > img.width - (w / zoom)) {x = img.width - (w / zoom);}
      if (x < w / zoom) {x = w / zoom;}
      if (y > img.height - (h / zoom)) {y = img.height - (h / zoom);}
      if (y < h / zoom) {y = h / zoom;}
      /*set the position of the magnifier glass:*/
      glass.style.left = (x - w) + "px";
      glass.style.top = (y - h) + "px";
      /*display what the magnifier glass "sees":*/
      glass.style.backgroundPosition = "-" + ((x * zoom) - w + bw) + "px -" + ((y * zoom) - h + bw) + "px";
    }
    function getCursorPos(e) {
      var a, x = 0, y = 0;
      e = e || window.event;
      /*get the x and y positions of the image:*/
      a = img.getBoundingClientRect();
      /*calculate the cursor's x and y coordinates, relative to the image:*/
      x = e.pageX - a.left;
      y = e.pageY - a.top;
      /*consider any page scrolling:*/
      x = x - window.pageXOffset;
      y = y - window.pageYOffset;
      return {x : x, y : y};
    }
  }      
/* Initiate Magnify Function
with the id of the image, and the strength of the magnifier glass:*/
magnify("david", 4);

getCameraSelection();