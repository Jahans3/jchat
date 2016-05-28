/**
 * Created by jahansj on 29/05/2016.
 */
import React, { Component } from 'react';

export default class Drawer extends Component {

    constructor(){
        super();

        this.state = {
            formType: 'login',
            action: '',
            message: 'Create an account'
        }
    }

    switchFormType(){
        if (this.state.formType === 'login'){
            this.setState({
                formType: 'signup',
                action: '/signup',
                message: 'Sign in'
            });
        } else {
            this.setState({
                formType: 'login',
                action: '/',
                message: 'Create an account'
            });
        }

        console.log(this.state)
    }

    render(){
        return (
            <div className="mdl-layout__drawer">
                <span className="mdl-layout-title">Account</span>

                <form className="form-signin" action={this.state.action} method="POST">
                    <input type="text" name="username" class="form-control" placeholder='Email' required autofocus/>
                    <input type="password" name="password" class="form-control" placeholder="Password" required/>
                    <button type="submit">Send</button>
                </form>

                <a href="#" onClick={this.switchFormType()} > {this.state.message} </a>
            </div>
        )
    }
}