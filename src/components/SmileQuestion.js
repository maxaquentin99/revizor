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
            num_queries: [
                {src: '8.svg', value: '1'},
                {src: '9.svg', value: '2'},
                {src: '10.svg', value: '3'},
                {src: '11.svg', value: '4'},
                {src: '12.svg', value: '5'},
            ],
        };
        
    }
    render(){
        let next = "#question"+(this.props.index+1);
        if(this.props.last) next = "#finish"
        let queries = this.state.queries
        if(this.props.isNum) queries = this.state.num_queries
        return (
        <div className="questionblock">                
            <div className="questiontext" id={"question"+this.props.index}>{this.props.question.text}</div>
            <hr className="hr"></hr>
            {queries.map((item) => { return (
                <a href={next} key={item.value} onClick={() => {this.props.save(item.value, this.props.last)}}>  
                    <img className="questionimagesone animated pulse infinite" src={item.src} alt="" />
                </a>
            )})}
        </div>
        )
    }
}