import React, { Component } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import '../assets/signup.css';    

class SignUp extends Component {

    state = {
        username: '',
        password: '',
        clients: []
    }

    componentDidMount(){
        this.getclient();
    }

    getclient  = async () => {
        try{
            let response = await axios.get('/api/getclient')
            this.setState({ clients: response.data })
            console.log(response);
        }catch (err) {
            throw err;
        } 
    };

    signup = async () => {
        try{
            axios.post('/signupclient', {
            username: this.state.username,
            password: this.state.password
        })
        this.setState({signup: true})
        }catch(err){
            throw err
        }
    }

    render() {    

        if (this.state.signup) {
            return <Redirect to='/login' />
        }

        const { clients } = this.state;

        return (
            <div>

            <div>Create a User</div>

            <input 
            type='text' 
            placeholder='Write Username' 
            required
            onChange={(e) => this.setState({username: e.target.value})}/>
            
            <br></br>

            <input 
            type='text' 
            placeholder='Write Password' 
            required
            onChange={(e) => this.setState({password: e.target.value})}/>

            <br></br>

            <button type='submit' onClick={() => this.signup(this.state.username, this.state.password)}> Create </button>

            <div>List of the users</div>

            {clients.map((client, index) => (
            <div key={index}> 
            {client.username}
            {client.password}
            </div>
            ))}

            </div>
            )
    }

}

export default SignUp;