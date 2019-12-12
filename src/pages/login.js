import React, { Component } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import '../assets/login.css';

class LogIn extends Component {

    state = { 
        username: '',
        password: ''
    }

    login  = async () => {
        try{
            let resdata = await axios.post('/login', {
            username: this.state.username,
            password: this.state.password,
            })
            localStorage.setItem('token', resdata.data.token)
            this.setState({loggedIn: true})
            }catch(err){
            alert("Error!");
            throw err
        }
    }

    logout = async () => {
        try{
            localStorage.removeItem('token')
            this.setState({loggedIn: false})
            alert("LoggedOut!")
            }catch(err){
            throw err
        }
    }

    render() {    

        if (this.state.loggedIn) {
            return <Redirect to='/' />
        }

        return (
                
                <div className="mainlogin">

                <input type="login" className="username" placeholder="Enter username" onChange={(e) => this.setState({ username: e.target.value })} />
                <br></br>
                <input type="password" className="password" placeholder="Enter password" onChange={(e) => this.setState({ password: e.target.value })} />
                <br></br>
                <button type="submit" onClick={() => this.logout()}> LogOut </button>
                <button type="submit" onClick={() => this.login(this.state.username, this.state.password)}> LogIn </button>

                </div>

            )

    }

}

export default LogIn;