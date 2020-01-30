import React from 'react';

export default class Reasons extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        let title = 'Что вам не понравилось?'
        if(this.props.title) title = this.props.title
        return (
            <div>
                <div className="questiontext">{title}</div>
                <hr className="hr"></hr>
                {
                    this.props.reasons.map((r, index) => {
                        let class_name = 'reason';
                        if(this.props.chosen_reasons[index]) class_name += ' selected_reason' 
                        return (
                            <div className={class_name} onClick={() => {this.props.setReason(index)}} key={index} >
                                {r.text}
                            </div>
                        )
                    })
                }
                <div className="btn-container">
                    {
                        (this.props.length() > 0) &&
                        <span  className="ok-button" 
                            onClick={() => {this.props.checkEmployees(this.props.nextLink)}}
                        >
                            OK
                        </span>
                    }   
                </div>
            </div>
        );
    }
}