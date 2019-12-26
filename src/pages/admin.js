import React from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
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
    employees.push({
      name: '',
      img: 'revizor.svg',
      role: '',
    });
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

        <Button variant="outlined" color="primary" onClick={() => {this.addQuestion()}}> Add a Question </Button>
        <br></br>
        <br></br>
        <br></br>
        
        {
          questions.map((q, index) => { return (
              <div key={index}>

                <Grid container spacing={3} alignItems="flex-end" justify="center">
                <Grid item>
                <TextField
                label="Question"
                multiline
                value={q.text}
                onChange={(e) => {questions[index].text = e.target.value;this.saveState(questions) }}
                variant="outlined"
                id="questiontext"
                />                
                </Grid>
                <Grid item>
                <TextField
                label="Text for Bot"
                multiline
                value={q.bot_text}
                onChange={(e) => {questions[index].bot_text  = e.target.value;this.saveState(questions) }}
                variant="outlined"
                id="bottext"
                />
                </Grid>
                <Grid item>
                <InputLabel id="demo-simple-select-label">Question Type</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                defaultValue={q.type}
                onChange={(e) => {questions[index].type  = e.target.value;this.saveState(questions) }}
                >
                {
                this.state.types.map((t, tindex) => { 
                return (

                <MenuItem value={t} key={tindex}>{t}</MenuItem>
                )
                })
                }
                </Select>
                </Grid>
                <Grid item>
                {q.type === 'like' &&
                <Button variant="outlined" color="primary" onClick={() => {this.addReason(index)}}> Add a Reason </Button>
                }
                </Grid>
                <Grid item>
                <Button variant="outlined" color="secondary" onClick={() => {this.deleteQuestion(index)}}> Delete Question </Button>
                </Grid>
                </Grid>


                  <br></br>
                  <br></br>
                  <br></br>


                {q.reasons &&
                  <div>
                    {
                      q.reasons.map((r, rindex) => { return (
                        <div key={rindex}>
                        <Grid container spacing={10} alignItems="flex-end" justify="center">
                        <Grid item>
                        <TextField
                        label="Reason"
                        multiline
                        value={q.reasons[rindex].text}
                        onChange={(e) => {q.reasons[rindex].text  = e.target.value; this.saveState(questions) }}
                        variant="outlined"
                        id="questiontext"
                        />                
                        </Grid>
                        <Grid item>
                        Employee photos
                        <Switch
                        checked={q.reasons[rindex].eCheck === true}
                        onChange={(e) => {q.reasons[rindex].eCheck = !q.reasons[rindex].eCheck; this.saveState(questions) }}
                        value={true}
                        color="primary"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                        </Grid>
                        <Grid item>
                        <Button variant="outlined" color="secondary" onClick={() => {questions[index].reasons.splice(rindex, 1); this.saveState(questions)}}> Delete Reason </Button>
                        </Grid>
                        </Grid>
                        </div>
                      )})
                    }
                  </div>
                }
              </div>
          )})
        }
        <br></br>
        <br></br>
        <br></br>
        <br></br>

        <Button variant="outlined" color="primary" onClick={() => {this.addEmployee()}}>Add an Employee</Button>


        <br></br>
        <br></br>
        <br></br>
        <br></br>

        {employees.length > 0 &&
          <h2>Employees</h2> &&
          employees.map((employee, i) => { return (
            <div key={i}>
              <Grid container spacing={3} alignItems="flex-end" justify="center">
              <Grid item>
              <img key={'ava'+i} src={'/avatars/'+employee.img} alt={employee.name} className="employee-ava" />
              </Grid>
              <Grid item>
              <TextField
              label="Name"
              multiline
              value={employee.name}
              onChange={(e)=> {employees[i].name = e.target.value;this.setState({employees:employees})}}
              variant="outlined"
              id="questiontext"
              />                
              </Grid>
              <Grid item>
              <TextField
              label="Role"
              multiline
              value={employee.role}
              onChange={(e)=> {employee.role = e.target.value;this.setState({employees:employees})}}
              variant="outlined"
              id="bottext"
              />
              </Grid>
              <Grid item>
              <Button variant="outlined" color="primary" onClick={()=> {this.openModal(i)}}>Edit Photo</Button>
              </Grid>
              <Grid item>
              <Button variant="outlined" color="secondary" onClick={()=> {this.deleteEmployee(i)}}> Delete Photo</Button>
              </Grid>
              </Grid>
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
            <br></br>
        <br></br>
        <br></br>
        <br></br>

            <Button variant="outlined" color="primary" onClick={() => {this.saveUser(questions, employees)}}>Save All</Button>

      </div>
    )
  }
}