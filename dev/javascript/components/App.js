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
                <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header
            mdl-layout--fixed-tabs">
                    <header class="mdl-layout__header">
                        <div class="mdl-layout__header-row">

                            <span class="mdl-layout-title">Title</span>
                        </div>

                        <div class="mdl-layout__tab-bar mdl-js-ripple-effect">
                            <a href="#fixed-tab-1" class="mdl-layout__tab is-active">Tab 1</a>
                            <a href="#fixed-tab-2" class="mdl-layout__tab">Tab 2</a>
                            <a href="#fixed-tab-3" class="mdl-layout__tab">Tab 3</a>
                        </div>
                    </header>
                    <div class="mdl-layout__drawer">
                        <span class="mdl-layout-title">Title</span>
                    </div>
                    <main class="mdl-layout__content">
                        <section class="mdl-layout__tab-panel is-active" id="fixed-tab-1">
                            <div class="page-content"> channel 1 </div>
                        </section>
                        <section class="mdl-layout__tab-panel" id="fixed-tab-2">
                            <div class="page-content"> channel 2 </div>
                        </section>
                        <section class="mdl-layout__tab-panel" id="fixed-tab-3">
                            <div class="page-content"> channel 3 </div>
                        </section>
                    </main>
                </div>
                <div className="mdl-card__title-text">
                    <input type="text" className="mdl-textfield__input" id="myInput"/>
                </div>
                <button id="myButton" className="mdl-button">Send</button>
                <div className="mdl-grid">
                    {this.state.output}
                </div>
            </div>
        )
    }
}