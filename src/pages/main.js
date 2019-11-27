import React, { Component } from 'react';
import axios from 'axios';
import '../assets/main.css';    
import { SmileQuestion } from '../components/SmileQuestion'
import { YesNoQuestion } from '../components/YesNoQuestion'
import { CommentQuestion } from '../components/CommentQuestion'

class Main extends Component {
    constructor(){
        super();
        this.state = { 
            client: {
                question_kit: {
                    questions: []
                }
            },
            url: 'http://localhost',
            // url: 'http://46.101.234.112'
        }
    }

    componentDidMount() {
        this.getask();
    }

    getask  = async () => {
        try {
            let token    = localStorage.getItem('token');
            let response = await axios.get(this.state.url+'/ask', {headers:{ token: token}})
            console.log(response)
            localStorage.setItem('bg-color',response.data.question_kit.color)
            this.setState({ client: response.data })
        } catch (err) {
            throw err
        }
    };

    UNSAFE_componentWillMount(){
        if(!localStorage.getItem('token')) window.location.assign('/login')
    }
    saveAnswer  = (value, last) => {
        let answers = JSON.parse(localStorage.getItem('revizor_answers'));
        if(!answers) answers = []
        answers.push(value) 
        localStorage.setItem('revizor_answers', JSON.stringify(answers));
        console.log(answers);
        if(last) this.send()
    };

    send  = () => {
        let answers = JSON.parse(localStorage.getItem('revizor_answers'));
        axios.post(this.state.url+'/result', {
            questions: this.state.client.question_kit,
            answers: answers
        }, {
            headers: {
                'token': localStorage.getItem('token')
            }
        }).then((res) => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })

        localStorage.setItem('revizor_answers', JSON.stringify([]));
        
        window.setTimeout(function () {
            window.location.href = "/";
        }, 2000)
    };

    render() {    
        const { client } = this.state;
        const questions = this.state.client.question_kit.questions;
        return (
            <div className="main">
                <div style={{height: '800px', display: 'block', backgroundColor: localStorage.getItem('bg-color')}}>
                <div className="finallogo" >
                        {client.logo}
                        </div>
                    <div className="start">
                        Не проходите мимо,
                        <br></br>
                         оставьте свой отзыв!
                    </div>
                    <a href="#question0"> 
                        <img src={'startbutton.svg'} className="startbutton" alt="" />
                    </a>
                    <br></br>
                    <img className="logo" src={'revizor.svg'} alt=""/>
                </div>
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
                                    />)
                        }
                        return null;
                    })
                }
            {/* <div style={{height: '800px', display: 'block'}}>                
                    <div className="question" id="questionone">{client.qone}</div>
                    <div className="question" id="questionone">{client.qonee}</div>
                    <hr className="hr"></hr>
                    {this.state.questionone.map((item) => { return (
                        <a href="#questiontwo" key={item.value} onClick={() => {this.questionone(item.value)}}>  
                            <img className="questionone" src={item.src} alt="" />
                        </a>
                    )})}
                </div> */}

                {/* <div style={{height: '800px', display: 'block'}}>
                <div className="question" id="questiontwo">{client.qtwo}</div>
                <div className="question" id="questiontwo">{client.qtwoo}</div>
                <hr className="hr"></hr>
                {this.state.questiontwo.map((item) => { return (
                <a href="#questionthree" key={item.value} onClick={() => {this.questiontwo(item.value)}}>  
                <img className="questiontwo" src={item.src} alt=""/>
                </a>
                )})}
                </div> */}


                {/* <div style={{height: '800px', display: 'block'}}>
                    <div className="question" id="questionthree">{client.qthree}</div>
                    <div className="question" id="questionthree">{client.qthreee}</div>
                    <hr className="hr"></hr>
                    {this.state.questionthree.map((item) => { return (
                    <a href="#comment" key={item.value} onClick={() => {this.questionthree(item.value)}}> 
                    <img className="questionthree" src={item.src} alt=""/>
                    </a>
                    )})}
                    <div className="hint"> минимальная вероятность - 1, максимальная вероятность - 5 </div>
                </div> */}
                {/* 
                <div style={{height: '800px', display: 'block'}}>
                    <div className="question" id="comment">Оставьте ваш комментарий </div>
                    <hr className="hr"></hr>
                    <input className="comment" type="text" placeholder="text" onChange={(e) => this.setState({ comment: e.target.value })}/>
                    <a href="#finish"> 
                    <button className="commentok" onClick={() => this.comment(this.state.comment)}>OK</button>
                    </a>
                </div> */}

                    <div style={{height: '800px', display: 'block', backgroundColor: localStorage.getItem('bg-color')}} id="finish">
                        <div className="finallogo" >
                        {client.logo}
                        </div>
                        <div className="thanks">
                            Спасибо за 
                            <br></br>
                            оставленный отзыв!
                        </div>
                    <br></br>
                    <img className="logo" src={'revizor.svg'} alt=""/>
                    </div>

                </div>

            )

    }

}

export default Main;