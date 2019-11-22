import React from 'react';

export class CommentQuestion extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            queries: [
                {src: '6.svg', value: 'Да'},
                {src: '7.svg', value: 'Нет'},
            ],
            comment: ''
        };
    }
    render(){
        let next = "#question"+(this.props.index+1);
        if(this.props.last) next = "#finish"
        return (
            <div style={{height: '800px', display: 'block'}}>                
                <div className="question" id={"question"+this.props.index}>{this.props.question.text}</div>
                <hr className="hr"></hr>
                <input className="comment" type="text" placeholder="text" onChange={(e) => this.setState({ comment: e.target.value })}/>
                <a href={next}> 
                    <button className="commentok" onClick={() => {this.props.save(this.state.comment, this.props.last)}}>OK</button>
                </a>
            </div>
        )
    }
}