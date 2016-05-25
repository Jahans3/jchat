/**
 * Created by jahansj on 21/05/2016.
 */
import React, { Component } from 'react';
import Post from './Post';

export default class App extends Component {
    constructor(){
        super();

        this.messages = [];
        this.socket = io();
        this.state = {};
    }

    componentDidMount(){
        this.el = document.getElementById('myButton');
        this.cont = document.getElementById('messageContainer');

        this.socket.on('thing', function(socket){
            console.log('A user connected: ' + socket.data);
        });

        this.socket.on('distribute', socket => {
            this.updateList(socket)
        });

        this.el.addEventListener('click', e => {
            this.sendThing();
        });
    }

    sendThing(){
        this.ele = document.getElementById('myInput').value;
        this.socket.emit('message', this.ele);
    }

    updateList(message){

        this.messages.push(<Post username="@username" textContent={message} />);

        this.setState({output:this.messages})
    }

    render(){

        return (
            <div>
                <input type="text" id="myInput"/>
                <button id="myButton">Send</button>
                <div>{this.state.output}</div>
            </div>
        )
    }
}