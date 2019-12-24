import React from 'react';

export class YesNoQuestion  extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            queries: [
                {src: 'no.svg', value: 'Нет'},
                {src: 'partially.svg', value: 'Частично'},
                {src: 'yes.svg', value: 'Да'},
            ],
        };
    }
    saveAnswer  = (value) => {
        let answers = JSON.parse(localStorage.getItem('answers'));
        if(!answers) answers = []
        answers.push(value) 
        localStorage.setItem('asnwers', value)
        if(this.props.last) this.props.send()
    };
     render(){
        let next = "#question"+(this.props.index+1);
        if(this.props.last) next = "#finish"
         return (
            <div className="questionblock">
                <div className="questiontext" id={'question'+this.props.index}>{this.props.question.text}</div>
                <hr className="hr"></hr>
                {this.state.queries.map((item) => { return (
                    <a href={next} key={item.value} onClick={() => {this.props.save(item.value, this.props.last, this.props.index)}}>  
                        <img className="questionimagestwo  animated pulse infinite" src={item.src} alt=""/>
                    </a>
                )})}
            </div>
         )
     }
   }