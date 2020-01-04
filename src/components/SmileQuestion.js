import React from 'react';
import Reasons from './Reasons'
import EmployeeList from './EmployeeList'
export class SmileQuestion extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            queries: [
                {src: '1.svg', value: 'Ужасно'},
                {src: '2.svg', value: 'Плохо'},
                {src: '3.svg', value: 'Нормально'},
                {src: '4.svg', value: 'Хорошо'},
            ],
            num_queries: [
                {src: '8.svg', value: '1'},
                {src: '9.svg', value: '2'},
                {src: '10.svg', value: '3'},
                {src: '11.svg', value: '4'},
            ],
            answer: null,
            chosen_reasons: [],
            employees: [],
            employeesListShow: false
        };
    }

    setReason(index) {
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
            window.location.hash = nextLink; 
            console.log(nextLink)
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
        let next = nextLink;
        let queries = this.state.queries
        if(this.props.isNum) queries = this.state.num_queries
        return (
        <div className="questionblock">                
            {
                !this.state.answer &&
                <span>
                    <div className="questiontext" id={"question"+this.props.index}>{this.props.question.text}</div>
                    <hr className="hr"></hr>
                    {queries.map((item) => { 
                        if(this.props.reasons.length) {
                            return (
                                <span  key={item.value} onClick={() => {this.setState({answer: item.value})}}>  
                                    <img className="questionimagesone animated pulse infinite" src={item.src} alt="" />
                                </span>
                            )
                        } else {
                            return (
                                <a href={next} key={item.value} onClick={() => {this.props.save(item.value, this.props.last, this.props.index)}}>  
                                    <img className="questionimagesone animated pulse infinite" src={item.src} alt="" />
                                </a>
                            )
                        }
                    })}
                    {this.props.isNum &&             
                        <a href={next} onClick={() => {this.props.save('5', this.props.last, this.props.index)}}>  
                            <img className="questionimagesone animated pulse infinite" src='12.svg' alt='Success Like' />
                        </a>
                    }
                    {!this.props.isNum &&             
                        <a href={next} onClick={() => {this.props.save('Отлично', this.props.last, this.props.index)}}>  
                            <img className="questionimagesone animated pulse infinite" src='5.svg' alt='Success Like' />
                        </a>
                    }
                </span>
            }

            {
                !this.state.employeesListShow && this.state.answer &&
                <Reasons
                    length = {length}
                    reasons = {this.props.reasons}
                    nextLink = {nextLink}
                    chosen_reasons={this.state.chosen_reasons}
                    setReason={this.setReason.bind(this)}
                    checkEmployees={this.checkEmployees.bind(this)}
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
                    nextLink = {nextLink}
                    />
            }
        </div>
        )
    }
}