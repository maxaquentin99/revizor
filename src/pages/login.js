import React, { Component } from 'react';
import axios from 'axios';
import '../assets/login.css';

class LogIn extends Component {

    state = { 
        username: '',
        password: ''
    }

    login  = (username,password) => {
        axios.post('/login', {
        username: username,
        password: password,
        }).then((res) => {
        console.log(res)
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', res.data.user)
        window.location.assign('/')
      }).catch(err => {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          alert("Error!");
          throw err;
        });
    };

    render() {    

        return (
                
                <div className="mainlogin">

                <input type="login" className="username" placeholder="Enter username" onChange={(e) => this.setState({ username: e.target.value })} />
                <input type="password" className="password" placeholder="Enter password" onChange={(e) => this.setState({ password: e.target.value })} />
                <br></br>
                <button type="submit" className="login" onClick={() => this.login(this.state.username, this.state.password)}> Log In </button>

                </div>

            )

    }

}

export default LogIn;