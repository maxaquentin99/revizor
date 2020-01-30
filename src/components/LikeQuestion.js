import React from 'react';
import EmployeeList  from './EmployeeList';
import Reasons  from './Reasons';

export class LikeQuestion extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            queries: [
                {src: 'like.svg', value: 'Like'},
                {src: 'dislike.svg', value: 'Dislike'},
            ],
            answer: 'Like',
            reason: null,
            chosen_reasons: [],
            employees: [],
            employeesListShow: false
        }
    }
    setReason(index) {
        console.log(this.state);
        let creasons = this.state.chosen_reasons;
        if(!creasons[index]) creasons[index] = this.props.reasons[index]
        else creasons[index] = null;
        console.log(creasons);
        this.setState({chosen_reasons: creasons});
    }
    checkEmployees(nextLink) {
        let employeesListShow = false;
        this.state.chosen_reasons.forEach(item => { 
            if(item && item.eCheck) employeesListShow = true;
        })
        this.setState({employeesListShow: employeesListShow});
        if(!employeesListShow){ 
            console.log('YEAP');
            window.location.hash = nextLink;
            this.props.save({
                reasons: this.state.chosen_reasons,
                answer: this.state.answer
            }, this.props.last, this.props.index)
        }
    }
    render(){
        let length = () =>{
            let l = 0;
            this.state.chosen_reasons.forEach(r => {
                if(r) l+=1
            });
            return l;
        }
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
                                reasons: null,
                                answer: this.state.answer
                            }, this.props.last, this.props.index)
                        }}>
                            <img className="questionimagestwo animated pulse infinite" src='like.svg' alt="Like"/>
                        </a>
                        <span onClick={() => {this.setState({answer: 'Dislike'})}}>  
                            <img className="questionimagestwo animated pulse infinite" src='dislike.svg' alt="Dislike"/>
                        </span>
                    </div>
                }
                {
                    !this.state.employeesListShow && this.state.answer === 'Dislike' && 
                    <Reasons
                        title = {this.props.question.reasonTitle}
                        length = {length}
                        reasons = {this.props.reasons}
                        nextLink = {nextLink}
                        chosen_reasons = {this.state.chosen_reasons}
                        setReason={this.setReason.bind(this)}
                        checkEmployees = {this.checkEmployees.bind(this)}
                    />
                }
                {
                    this.state.employeesListShow &&
                    <EmployeeList
                        save={this.props.save}
                        employees={this.props.employees}
                        last={this.props.last}
                        index={this.props.index}
                        reasons={this.state.chosen_reasons}
                        answer= {this.state.answer}
                    />
                }
            </div>
         )
    }
}