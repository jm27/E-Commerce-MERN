import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import SignUp from './user/Signup'
import SignIn from './user/Signin'
import Home from './core/Home'
import Menu from './core/Menu'

const Routes = ()=>{
    return (<BrowserRouter>
    <Menu></Menu>
        <Switch>
            <Route path="/" exact component={Home}></Route>
            <Route path="/signup" exact component={SignUp}></Route>
            <Route path="/signin" exact component={SignIn}></Route>
        </Switch>
    </BrowserRouter>)
}

export default Routes;