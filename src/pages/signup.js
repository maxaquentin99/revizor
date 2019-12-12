import React, { Component } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import '../assets/signup.css';    

class SignUp extends Component {

    state = {
        username: '',
        password: '',
        clients: [],
    }

    componentDidMount(){
        this.getclients();
    }

    getclients  = async () => {
        try{
        let response = await axios.get('/api/get/clients')
        this.setState({ clients: response.data })
        }catch (err) {
            throw err;
        } 
    };

    updateclientusername = async (_id) => {
        try{
            await axios.post('/api/update/client/username', {
            _id,
            username: this.state.username,
            })
            this.getclients();
            }catch (err) {
                throw err;
        } 
    };

    updateclientpassword = async (_id) => {
        try{
            await axios.post('/api/update/client/password', {
            _id,
            password: this.state.password
            })
            this.getclients();
            }catch (err) {
                throw err;
        } 
    };

    deleteclient = async (_id) => {
        try{
            await axios.post('/api/delete/client', {
            _id,
            })
            this.getclients();
            }catch (err) {
                throw err;
        } 
    };

    signup = async () => {
        try{
            await axios.post('/api/signup/client', {
            username: this.state.username,
            password: this.state.password
            })
            this.getclients();
            // this.setState({signup: true})
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

            <button onClick={() => {this.signup()}}> Create a User </button>

            <div>List of the users</div>

            {clients.map((client, index) => (
            <div key={index}>
<           div> - user # {index+1} - </div> 
            <div> Username -  {client.username}</div>
            <input type="text" placeholder="Enter New Username" onChange={(e) => this.setState({ username: e.target.value })}/>
            <button onClick={() => this.updateclientusername(client._id, this.state.username)}> Update Username </button>
            <div> Password -  {client.password}</div>
            <input type="text" placeholder="Enter New Password" onChange={(e) => this.setState({ password: e.target.value })}/>
            <button onClick={() => this.updateclientpassword(client._id, this.state.password)}> Update Password </button>
            <br></br>
            <button onClick={() => this.deleteclient(client._id)}> Delete User </button>
            </div>
            ))}

            </div>
            )
    }

}

export default SignUp;

