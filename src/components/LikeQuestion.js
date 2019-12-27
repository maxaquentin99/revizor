import React from 'react';

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
        let creasons = this.state.chosen_reasons;
        if(!creasons[index]) creasons[index] = this.props.reasons[index]
        else creasons[index] = null;
        console.log(creasons);
        this.setState({chosen_reasons: creasons});
    }
    checkEmployees() {
        let employeesListShow = false;
        this.state.chosen_reasons.forEach(item => { 
            if(item && item.eCheck) employeesListShow = true;
        })
        this.setState({employeesListShow: employeesListShow});
        if(!employeesListShow){ 
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
                    <div>
                        <div className="questiontext">Что вам не понравилось?</div>
                        <hr className="hr"></hr>
                        {
                            this.props.reasons.map((r, index) => {
                                let class_name = 'reason';
                                if(this.state.chosen_reasons[index]) class_name += ' selected_reason' 
                                return (
                                    <div className={class_name} onClick={() => {this.setReason(index)}} key={index} >
                                        {r.text}
                                    </div>
                                )
                            })
                        }
                        <div className="btn-container">
                            {
                                length() > 0 &&
                                <a  className="ok-button" onClick={() => {
                                        this.checkEmployees()}}
                                    href={nextLink}
                                >OK
                                </a>
                            }   
                        </div>
                    </div>
                }
                {
                    this.state.employeesListShow && 
                    <div className='employee-container'>
                        <div className="employee-question">
                            <h1>Кто вас сегодня обслуживал?</h1>
                            {this.props.employees.map((employee, i) => {
                                return (
                                    <span
                                        key={i}
                                        onClick={() => {
                                            this.props.save({
                                                reasons: this.state.chosen_reasons,
                                                answer: this.state.answer,
                                                employee: employee.name
                                            }, this.props.last, this.props.index);
                                        }}
                                    >
                                        <img src={'/avatars/'+employee.img} className="employee-ava inline-photo" alt={employee.name}/>
                                    </span>
                                )
                            })}
                        </div>
                    </div>
                }
            </div>
         )
    }
}