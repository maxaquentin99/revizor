import React, { Component } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import '../assets/login.css';

class LogIn extends Component {

    state = { 
        username: '',
        password: ''
    }

    login  = async () => {
        try{
            let resdata = await axios.post('/api/login', {
            username: this.state.username,
            password: this.state.password,
            })
            localStorage.setItem('token', resdata.data.token)
            this.setState({loggedIn: true})
            console.log(resdata)
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
                
                <div>

                <div className="mainlogin">
                
                <Grid container spacing={3} alignItems="flex-end" justify="center" size="small" >
                <Grid item>
                <AccountCircle className="loginicon" />
                </Grid>
                <Grid item>
                <TextField  id="loginusername" label="Username" onChange={(e) => this.setState({ username: e.target.value })} />
                </Grid>
                </Grid>

                <br></br>
                <br></br>
                <br></br>

                <Grid container spacing={3} alignItems="flex-end" justify="center">
                <Grid item>
                <VpnKeyIcon className="loginicon" />
                </Grid>
                <Grid item>
                <TextField id="loginpassword" label="Psssword" type="password" onChange={(e) => this.setState({ password: e.target.value })} />
                </Grid>
                </Grid>

                <br></br>
                <br></br>
                <br></br>

                <Grid container spacing={10} alignItems="flex-end" justify="center">
                <Grid item>
                <Button variant="outlined" color="secondary" onClick={() => this.logout()}> LogOut </Button>
                </Grid>
                <Grid item>
                <Button variant="outlined" color="primary" onClick={() => this.login()}> LogIn </Button>
                </Grid>
                </Grid>

                </div>

                </div>

            )

    }

}

export default LogIn;