import React from 'react'

export default class Camera extends  React.Component {
    constructor() {
        super();
        this.state = { 
            streaming : false,
            video : null,
            canvas : null,
            photo : null,
            startbutton : null,
            height : 300,
            width : 350,
        }
    }

    componentDidMount() {
        let video = document.getElementById('video');
        video = document.getElementById('video');
        let canvas = document.getElementById('canvas');
        let photo = document.getElementById('photo');
        let startbutton = document.getElementById('snapbtn');
        
        this.setState({
            canvas: canvas,
            photo: photo,
            startbutton: startbutton
        })
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function(stream) {
            video.srcObject = stream;
            video.play();
        })
        
        .catch(function(err) {
            console.log("An error occurred: " + err);
        });

        let state = this.state;
        let streaming = this.state.streaming
        video.addEventListener('canplay', function(ev){
            if (!streaming) {
                video.style.display = 'none';
                video.setAttribute('width', state.width);
                video.setAttribute('height', state.height);
                canvas.setAttribute('width', state.width);
                canvas.setAttribute('height', state.height);
                canvas.style.display = 'none';
            } else {
                streaming = true;
            }
        }, false);
        this.setState({
            streaming: streaming
          });
        let takepicture = this.takepicture;
        startbutton.addEventListener('click', function(ev){
            takepicture();
            ev.preventDefault();
        }, false);
    }
    takepicture = async () => {
        let canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        if (this.state.width && this.state.height) {
          canvas.width = this.state.width;
          canvas.height = this.state.height;
          let video = document.getElementById('video')
          context.drawImage(video, 0, 0, this.state.width, this.state.height);
          let data = canvas.toDataURL('image/png');
          this.props.snap(data);
          console.log(data)
        }
      }
    render() {
        return  (
            <div>
                <div className="none">
                    <video id="video"></video>
                    <canvas id="canvas"></canvas>
                    <button id="snapbtn"></button>
                </div>
            </div>
        );
    }
}