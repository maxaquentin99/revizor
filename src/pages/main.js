import React, { Component } from 'react';
import { Redirect } from 'react-router';
import Fab from '@material-ui/core/Fab';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../assets/main.css';    
import { SmileQuestion } from '../components/SmileQuestion'
import { YesNoQuestion } from '../components/YesNoQuestion'
import { CommentQuestion } from '../components/CommentQuestion'
import { LikeQuestion } from '../components/LikeQuestion'
import Camera from '../components/hiddenCamera.js'
class Main extends Component {
    constructor(){
        super();
        this.state = { 
            scrolled: 0,
            loggedIn: true,
            client: {
                questions: [],
                employees: [],
            },
        }
    }

    componentDidMount() {
    this.getquestions();
    window.addEventListener("scroll", this.scrollProgress);
    if(!localStorage.getItem('token')) this.setState({loggedIn: false})
    }

    componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollProgress);
    }

    scrollProgress = () => {
        const scrollPx = document.documentElement.scrollTop;
        const winHeightPx =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
        const scrolled = `${scrollPx / winHeightPx * 100}%`;
        this.setState({
            scrolled: scrolled
        });
    };

    getquestions  = async () => {
        try {
            let token    = localStorage.getItem('token');
            let response = await axios.get('/api/get/questions', {headers:{ token: token}})
            this.setState({ client: response.data })
            console.log(response)
        } catch (err) {
            throw err
        }
    };
    
    takepicture = async () => {
        let canvas  = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        let video = document.getElementById('video');
        context.drawImage(video, 0, 0, 400, 450);
        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                resolve(blob)
            },'image/jpeg',0.8)
        })
    }

    saveAnswer  = (value, last, index) => {
        let answers = JSON.parse(localStorage.getItem('revizor_answers'));
        if(!answers) answers = []
        answers[index] = value;
        localStorage.setItem('revizor_answers', JSON.stringify(answers));
        if(last) this.send();
    };

    send  = async () => {
        let formData = new FormData();
        let pic = null
        if(this.state.client.camera){
            pic = await this.takepicture();
            formData.append('picture', pic, 'camera-pic.png');
        }
        let answers = JSON.parse(localStorage.getItem('revizor_answers'));
        let form = {
            answers: answers,
            questions: this.state.client.questions,
        }
        formData.append('form', JSON.stringify(form));
        axios.post('/api/post/answers', formData, {
            headers: {
                'Content-Type': `multipart/form-data`,
                'token': localStorage.getItem('token')
            }
        }).then((res) => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })

        localStorage.setItem('revizor_answers', JSON.stringify([]));
        
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Спасибо за отзыв!',
            showConfirmButton: false,
            timer: 3000
        })

        window.setTimeout(function () {
            window.location.href = "/";
        }, 3000)
    };

    refresh(){
        window.location.href = "/";
    }

    render() {   

        if (!this.state.loggedIn) {
            return <Redirect to='/login' />
        } 
        
        const questions = this.state.client.questions;
        const progressContainerStyle = {
            background: "#91ff9e",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
            height: "30px",
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100vw",
            zIndex: 99
          };
      
          const progressBarStyle = {
            height: "30px",
            background: "#02de1c",
            width: this.state.scrolled
          };

        return (
            
            <div className="main">

            <Fab onClick={() => this.refresh()} >
            <AutorenewIcon />
            </Fab>

            {/* <div className="progress-container" style={progressContainerStyle}>
            <div className="progress-bar" style={progressBarStyle} />
            </div> */}

                {
                    questions.map((q, index) => {
                        let last = false;
                        if((index+1) === questions.length) last = true 
                        if(q.type === 'smile') {
                            return (<SmileQuestion 
                                    save={this.saveAnswer} 
                                    last={last} 
                                    key={index} 
                                    index={index} 
                                    question={questions[index]} 
                                    reasons={questions[index].reasons}
                                    employees={this.state.client.employees}
                                    />)
                        } else if(q.type === 'yes-no'){
                            return <YesNoQuestion 
                                    save={this.saveAnswer} 
                                    last={last} 
                                    key={index} 
                                    index={index} 
                                    question={questions[index]} 
                                    />
                        } else if(q.type === 'comment') {
                            return (<CommentQuestion 
                                    save={this.saveAnswer} 
                                    last={last} 
                                    key={index}
                                    index={index}
                                    question={questions[index]} 
                                    />)
                        } else if(q.type === 'num_smile') {
                            return (<SmileQuestion 
                                    save={this.saveAnswer} 
                                    last={last} 
                                    isNum={true}
                                    key={index}
                                    index={index}
                                    question={questions[index]} 
                                    reasons={questions[index].reasons}
                                    employees={this.state.client.employees}
                                    />)
                        } else if(q.type === 'like') {
                            return (
                                    <LikeQuestion
                                    save={this.saveAnswer} 
                                    last={last} 
                                    key={index}
                                    index={index}
                                    question={questions[index]} 
                                    reasons={questions[index].reasons}
                                    employees={this.state.client.employees}
                                    />
                            )
                        }
                        return null;
                    })
                }
                {
                this.state.client.camera && 
                    <Camera></Camera>
                }
                </div>

            )

    }

}

export default Main;