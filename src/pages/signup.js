import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Badge from '@material-ui/core/Badge';
import SaveIcon from '@material-ui/icons/Save';
import axios from 'axios';
import '../assets/signup.css';    

class SignUp extends Component {

    state = {
        username: '',
        password: '',
        clients: [],
        show: false
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
            brandname: this.state.brandname,
            username: this.state.username,
            password: this.state.password
            })
            this.getclients();
            // this.setState({signup: true})
            }catch(err){
                throw err
        }
    }

    show = async (e) => {
        this.setState({
            showResults: !this.state.showResults 
          });
    }

    render() {    

        const { clients } = this.state;

        return (
            <div>


                <div className="mainsignup">
                <div style={{fontSize: '3rem'}} >Create a User</div>
                <br></br>
                <Grid item>
                <TextField id="signupbrandname" label="BrandName" variant="outlined" onChange={(e) => this.setState({ brandname: e.target.value })} />
                </Grid>
                <br></br>
                <Grid item>
                <TextField id="signupusername" label="Username" variant="outlined" onChange={(e) => this.setState({ username: e.target.value })} />
                </Grid>
                <br></br>
                <Grid item>
                <TextField id="signuppassword" label="Password" variant="outlined" onChange={(e) => this.setState({ password: e.target.value })} />
                </Grid>
                <br></br>
                <Grid item>
                <Button variant="outlined" color="primary" onClick={() => {this.show()}}> List Of Users </Button>
                <Button variant="outlined" color="primary" onClick={() => {this.signup()}}> Create a User </Button>
                </Grid>
                <br></br>
                </div>

                <hr></hr>
                <div style={{ display: this.state.showResults ? "block" : "none"}}>
                {clients.map((client, index) => (
                <div key={index}>
               
                <Badge color="secondary" badgeContent={index+1}>
                <AccountCircle className="loginicon" />
                </Badge>

                <br></br>
                <br></br>
               
                <TextField
                label="Brandname"
                variant="outlined"
                defaultValue="Brandname"
                onChange={(e) => this.setState({ brandname: e.target.value })}
                />

                <br></br>
                <br></br>
               
                <TextField
                label="Username"
                variant="outlined"
                defaultValue={client.username}
                onChange={(e) => this.setState({ username: e.target.value })}
                />
               
                <br></br>
                <br></br>
               
                <TextField
                label="Password"
                variant="outlined"
                defaultValue={client.password}
                onChange={(e) => this.setState({ password: e.target.value })}
                />

                <br></br>
                <br></br>

                <Button
                variant="contained"
                color="secondary"
                onClick={() => this.deleteclient(client._id)}>
                Delete
                <DeleteIcon />
                </Button>

                <Button
                variant="contained"
                color="primary"
                onClick={() => this.updateclient(client._id, this.state.brandname, this.state.username, this.state.password)}>
                Update
                <SaveIcon />
                </Button>



                <hr></hr>
                </div>
                ))}
                </div>


            </div>
            )
    }

}

export default SignUp;

