import React, { Component } from 'react';
import axios from 'axios';
import '../assets/main.css';

class Main extends Component {

    state = { 
        questionone: [
            {src: '1.svg', value: 'Ужасно'},
            {src: '2.svg', value: 'Плохо'},
            {src: '3.svg', value: 'Нормально'},
            {src: '4.svg', value: 'Хорошо'},
            {src: '5.svg', value: 'Отлично'}
        ],
        questiontwo: [
            {src: '6.svg', value: 'Да'},
            {src: '7.svg', value: 'Нет'},
        ],
        questionthree: [
            {src: '8.svg', value: '1'},
            {src: '9.svg', value: '2'},
            {src: '10.svg', value: '3'},
            {src: '11.svg', value: '4'},
            {src: '12.svg', value: '5'},
        ],
        client: {},
    }

    componentDidMount() {
        this.getask();
    }

    getask  = async () => {
    try {
        let token    = localStorage.getItem('token');
        let response = await axios.get('/ask', {headers:{ token: token}})
        this.setState({ client: response.data })
        } catch (err) {
        throw err
        }
    };

    UNSAFE_componentWillMount(){
        if(!localStorage.getItem('token')) window.location.assign('/login')
    }

    questionone  = (value) => {
        localStorage.setItem('questionone', JSON.stringify({questionone: value}))
    };

    questiontwo    = (value) => {
        localStorage.setItem('questiontwo', JSON.stringify({questiontwo: value}))
    };

    questionthree  = (value) => {
        localStorage.setItem('questionthree', JSON.stringify({questionthree: value}))
    };

    comment  = (value) => {
        localStorage.setItem('comment', JSON.stringify({comment: value}))
        let questionone = JSON.parse(localStorage.getItem('questionone'));
        let questiontwo = JSON.parse(localStorage.getItem('questiontwo'));
        let questionthree = JSON.parse(localStorage.getItem('questionthree'));
        let comment = JSON.parse(localStorage.getItem('comment'));
        axios.post('/result', {
            questionone: questionone.questionone,
            questiontwo: questiontwo.questiontwo,
            questionthree: questionthree.questionthree,
            comment: comment.comment
        }, {
            headers: {
                'x-token': localStorage.getItem('token')
            }
        }).then((res) => {
        console.log(res)
        }).catch(err => {
            console.log(err)
        })
        localStorage.removeItem('questionone');
        localStorage.removeItem('questiontwo');
        localStorage.removeItem('questionthree');
        localStorage.removeItem('comment');
        window.setTimeout(function () {
            window.location.href = "/";
        }, 2000)
    };

    render() {    
        
        const { client } = this.state;

        return (
                
                <div className="main">


                <div style={{height: '800px', display: 'block'}}>
                <div className="start">Не проходите мимо, оставьте свой отзыв!</div>
                <a href="#questionone"> 
                <button className="startok">НАЧАТЬ</button>
                </a>
                </div>

                <div style={{height: '800px', display: 'block'}}>                
                <div className="question" id="questionone">{client.qone}</div>
                <div className="question" id="questionone">{client.qonee}</div>
                <hr className="hr"></hr>
                {this.state.questionone.map((item) => { return (
                <a href="#questiontwo" key={item.value} onClick={() => {this.questionone(item.value)}}>  
                <img className="questionone" src={item.src} alt=""/>
                </a>
                )})}
                </div>

                <div style={{height: '800px', display: 'block'}}>
                <div className="question" id="questiontwo">{client.qtwo}</div>
                <div className="question" id="questiontwo">{client.qtwoo}</div>
                <hr className="hr"></hr>
                {this.state.questiontwo.map((item) => { return (
                <a href="#questionthree" key={item.value} onClick={() => {this.questiontwo(item.value)}}>  
                <img className="questiontwo" src={item.src} alt=""/>
                </a>
                )})}
                </div>


                <div style={{height: '800px', display: 'block'}}>
                <div className="question" id="questionthree">{client.qthree}</div>
                <div className="question" id="questionthree">{client.qthreee}</div>
                <hr className="hr"></hr>
                {this.state.questionthree.map((item) => { return (
                <a href="#comment" key={item.value} onClick={() => {this.questionthree(item.value)}}> 
                <img className="questionthree" src={item.src} alt=""/>
                </a>
                )})}
                <div className="hint"> минимальная вероятность - 1, максимальная вероятность - 5 </div>
                </div>

                <div style={{height: '800px', display: 'block'}}>
                <div className="question" id="comment">Оставьте ваш комментарий </div>
                <hr className="hr"></hr> 
                <input className="comment" type="text" placeholder="text" onChange={(e) => this.setState({ comment: e.target.value })}/>
                <a href="#finish"> 
                <button className="commentok" onClick={() => this.comment(this.state.comment)}>OK</button>
                </a>
                </div>

                <div style={{height: '800px', display: 'block'}}>
                <div className="question" id="finish">FeedBack</div>
                <hr className="hr"></hr>
                <div className="thanks">Спасибо за оставленный отзыв!</div>
                </div>

                <div className="logo">{client.logo}</div>

                </div>

            )

    }

}

export default Main;