import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Main from './pages/main';
import LogIn from './pages/login';
import SignUp from './pages/signup';
import Admin from './pages/admin';

class App extends Component {
  render() {
  
    const App = () => (
      <div>
        <Switch>
          <Route exact path='/' component={Main}/>
          <Route exact path='/login' component={LogIn}/>
          <Route exact path='/signup' component={SignUp}/>
          <Route exact path='/admin' component={Admin}/>
        </Switch>
      </div>
    )
    return (
      <Switch>
        <App/>
      </Switch>
    );
 
  }
}

export default App;