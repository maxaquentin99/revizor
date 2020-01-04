import React from 'react';

export default class EmployeeList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    goToNext = (e) => {
        console.log(e)
        if(!this.props.last) {
            window.location.href = this.props.nextLink
        }
    }
    render() {
        return (
            <div className='employee-container'>
                <div className="employee-question">
                    <h1>Кто вас сегодня обслуживал?</h1>
                    {this.props.employees.map((employee, i) => {
                        return (
                            <span
                                key={i}
                                onClick={(e) => {
                                    this.props.save({
                                        reasons: this.props.reasons,
                                        answer: this.props.answer,
                                        employee: employee.name
                                    }, this.props.last, this.props.index);
                                    this.goToNext();
                                }}
                            >
                                <img src={'http://revizor.space/avatars/'+employee.img} 
                                    className="employee-ava inline-photo" alt={employee.name}
                                />
                            </span>
                        )
                    })}
                </div>
            </div>
        );
    }
}