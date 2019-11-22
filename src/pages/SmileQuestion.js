import React from 'react';

export class SmileQuestion extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            queries: [
                {src: '1.svg', value: 'Ужасно'},
                {src: '2.svg', value: 'Плохо'},
                {src: '3.svg', value: 'Нормально'},
                {src: '4.svg', value: 'Хорошо'},
                {src: '5.svg', value: 'Отлично'}
            ],
        };
        
    }
    saveAnswer  = (value) => {
        localStorage.setItem('questionone', JSON.stringify({questionone: value}))
    };
     render(){
         return (
            <div style={{height: '800px', display: 'block'}}>                
                <div className="question" id="questionone">{this.props.question.text}</div>
                <hr className="hr"></hr>
                {this.state.queries.map((item) => { return (
                    <a href="#" key={item.value} onClick={() => {this.state.saveAnswer(item.value)}}>  
                        <img className="questionone" src={item.src} alt="" />
                    </a>
                )})}
            </div>
         )
     }
   }