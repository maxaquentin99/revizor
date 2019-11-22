import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Main from './pages/main';
import LogIn from './pages/login';

class App extends Component {
  render() {
  
    const App = () => (
      <div>
        <Switch>
          <Route exact path='/' component={Main}/>
          <Route exact path='/login' component={LogIn}/>
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