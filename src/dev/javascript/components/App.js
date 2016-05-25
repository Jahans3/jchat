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

        this.socket.on('connection', function(socket){

        });

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
        //emit(`message:${this.children.nav.selectedChannel}`, this.ele);
    }

    updateList(message){

        this.messages.push(<Post username="@username" textContent={message} />);

        this.setState({output:this.messages})
    }

    render(){

        return (
            <div>
                <div className="mdl-card__title-text">
                    <input type="text" className="mdl-textfield__input" id="myInput"/>
                </div>
                <button id="myButton" className="mdl-button">Send</button>
                <div>{this.state.output}</div>
            </div>
        )
    }
}