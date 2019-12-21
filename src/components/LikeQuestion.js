import React from 'react';

export class LikeQuestion extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            queries: [
                {src: '6.svg', value: 'Like'},
                {src: '7.svg', value: 'Dislike'},
            ],
            answer: 'Like',
            reason: null
        };
    }
    render(){
        let nextLink = "#question"+(this.props.index+1) 
        if(this.props.last) nextLink = "#finish";
        return (
            <div className="questionblock">
                {
                    this.state.answer === 'Like' &&  
                    <div>
                        <div className="questiontext" id={'question'+this.props.index}>{this.props.question.text}</div>
                        <hr className="hr"></hr>
                        <a href={nextLink} onClick={() => {
                            this.setState({answer: 'Like'}); 
                            this.props.save({
                                reason: this.state.reason,
                                answer: this.state.answer
                            }, this.props.last, this.props.index)
                        }}>
                            <img className="questionimagestwo animated pulse infinite" src='6.svg' alt="Like"/>
                        </a>
                        <span onClick={() => {this.setState({answer: 'Dislike'})}}>  
                            <img className="questionimagestwo animated pulse infinite" src='7.svg' alt="Dislike"/>
                        </span>
                    </div>
                }
                {
                    this.state.answer === 'Dislike' && 
                    <div>
                        <div className="questiontext">Что вам не понравилось?</div>
                        <hr className="hr"></hr>
                        {
                            this.props.reasons.map((r, index) => {
                                return (
                                    <a className="reason" key={index} href={nextLink} onClick={() => {this.setState({reason: r});
                                    this.props.save({
                                        reason: this.state.reason,
                                        answer: this.state.answer
                                    }, this.props.last, this.props.index)}}>
                                        {r.text}
                                    </a>
                                )
                            })
                        }
                    </div>
                }
            </div>
         )
    }
}