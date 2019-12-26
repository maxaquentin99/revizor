import React from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Employee from './employee.js';
import '../assets/admin.css'
export default class Admin  extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      client: {},
      questions: [],
      employees: [],
      eindex: null,
      employeeForm:{
        name: '',
        img: '',
        role: '',
      },
      modalIsOpen: false,
      token: localStorage.getItem('token'),
      types: ['yes-no', 'comment', 'smile', 'num_smile', 'like'],
    };
  }
  
  componentDidMount() {
    this.getClient();
  }
  
  openModal = (index) => {
    this.setState({eindex: index})
    this.setState({modalIsOpen: true});
  }

  closeModal = () => {
    this.setState({modalIsOpen: false});
  }
 
  addQuestion = () => {
    let questions = this.state.questions;
    questions.push({
      type: 'yes-no',
      text: '',
      bot_text: '',
      reasons: []
    })
    this.setState({questions: questions})
  }
  
  getClient   = async () => {
    try {
      let res = await axios.get('/api/get/questions', {headers: {token: this.state.token}});
      if(!res.data.questions) res.data.questions = []
      res.data.questions.forEach(item => {
        if(!item.reasons) item.reasons = [];
      });
      console.log(res.data);
      if(!res.data.employees) res.data.employees = []; 
      this.setState({
        questions: res.data.questions,
        client: res.data,
        employees: res.data.employees,
      });
    } catch (err) {
      throw err;
    }
  }
  
  deleteQuestion = (index) => {
    let questions = this.state.questions;
    questions.splice(index,1);
    this.setState({questions: questions})
  }
  deleteEmployee = (index) => {
    let employees = this.state.employees;
    employees.splice(index,1);
    this.setState({employees: employees})
  }

  addReason = (index) => {
    let questions = this.state.questions;

    if(!questions[index].reasons) questions[index].reasons = [];
    questions[index].reasons.push({
      text: '',
      eCheck: false,
    });
    this.setState({
      questions: questions
    })
  }
  
  addEmployee = () => {
    let employees = this.state.employees;
    employees.push(this.state.employeeForm);
    this.setState({
      employees: employees,
    });
  }
  
  saveUser = async (questions, employees) => {
    try {
      this.setState({questions: questions});
      this.setState({employees: employees});
      let res = await axios.post('/api/update/questions/', {
        ...this.state.client,
        questions: this.state.questions,
        employees: this.state.employees
      },{
        headers: {
          token: this.state.token,
        }
      })
      console.log(res)
      alert('OK')
    } catch (err) {
      throw err;
    }
  }

  saveState = (questions) => {
    this.setState({questions: questions})
  }


  render(){
    let questions = this.state.questions
    let employees = this.state.employees
    return (
      <div className="questionblock">
        {
          questions.map((q, index) => { return (
              <div key={index}>
                <input placeholder="Text" value={q.text} onChange={(e) => {questions[index].text = e.target.value;this.saveState(questions) }} ></input>
                <input placeholder="Bot text" value={q.bot_text} onChange={(e) => {questions[index].bot_text  = e.target.value;this.saveState(questions) }} ></input>
                <select placeholder="type" name="type" defaultValue={q.type} onChange={(e) => {questions[index].type  = e.target.value;this.saveState(questions) }} >
                  {
                    this.state.types.map((t, tindex) => { 
                      return (
                        <option value={t} key={tindex}>
                          {t}
                        </option>
                      )
                    })
                  }
                </select>
                <button onClick={() => {this.deleteQuestion(index)}}>Delete</button>
                {q.type === 'like' &&
                  <button onClick={() => {this.addReason(index)}}>Add a reason</button>
                }
                {q.reasons &&
                  <div>
                    {
                      q.reasons.map((r, rindex) => { return (
                        <div key={rindex}>
                          <input placeholder="text" value={q.reasons[rindex].text} onChange={(e) => {q.reasons[rindex].text  = e.target.value; this.saveState(questions) }}></input>
                          Employee photos
                          <input type='checkbox' value={true} checked={q.reasons[rindex].eCheck === true} onChange={(e) => {q.reasons[rindex].eCheck = !q.reasons[rindex].eCheck; this.saveState(questions) }}></input>
                          <button onClick={() => {questions[index].reasons.splice(rindex, 1); this.saveState(questions)}}>Delete da reason</button>
                        </div>
                      )})
                    }
                  </div>
                }
              </div>
          )})
        }
        <button onClick={() => {this.addQuestion()}}>Add a question</button>
        {employees.length > 0 &&
          <h2>Employees</h2> && 
          employees.map((employee, i) => { return (
            <div key={i}>
                <div>
                  <input value={employee.name} onChange={(e)=> {employees[i].name = e.target.value;this.setState({employees:employees})}} />
                  <br/>
                  <input value={employee.role} onChange={(e)=> {employee.role = e.target.value;this.setState({employees:employees})}}/>
                </div>
              <img key={'ava'+i} src={'/avatars/'+employee.img} alt={employee.name} className="employee-ava" />
              <button onClick={()=> {this.openModal(i)}}>Edit photo</button>
              <button onClick={()=> {this.deleteEmployee(i)}}>Delete</button>
            </div>
          )})
        }
        <Modal isOpen={this.state.modalIsOpen}
          ariaHideApp={false}
        >
          <Employee 
            eindex={this.state.eindex}
            employees={employees}
            onRequestClose={this.closeModal}
          />
        </Modal>
        <button onClick={() => {this.addEmployee()}}>Add an employee</button>

        <button onClick={() => {this.saveUser(questions, employees)}}>Save it!</button>

      </div>
    )
  }
}