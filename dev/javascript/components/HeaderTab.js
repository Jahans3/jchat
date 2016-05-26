/**
 * Created by jahansj on 26/05/2016.
 */

import React, { Component, PropTypes } from 'react';
import Post from './Post';

export default class HeaderTab extends Component {

    constructor(props){
        super(props);

        this.messages = [];
        this.socket = io();
        this.state = {
            messages: []
        }
    }

    componentDidMount(){

        //emit('register-component' ...
            //

        this.socket.on('connection', socket => {
            console.log(`tab-${this.props.tabId} connected`);
        });



        this.button = document.getElementById(`tab-button-${this.props.tabId}`);

        this.button.addEventListener('click', e => {
            this.socket.emit('message', {
                id: this.props.tabId,
                textContent: document.getElementById(`tab-input-${this.props.tabId}`).value
            });
        });

        this.socket.on(`distribute:channel-${this.props.tabId}`, socket => {

            this.messages.push(<Post username={socket.username} textContent={socket.textContent} />);

            this.setState({ messages: this.messages });
        });

        this.socket.on('thing', (data) => {
            console.log(`tab-input-${this.props.tabId} has connected`);
        })
    }

    render(){
        return (
            <section className="mdl-layout__tab-panel is-active" id={`fixed-tab-${this.props.tabId}`}>
                <div className="page-content">

                    <div className="mdl-card__title-text">
                        <input type="text" className="mdl-textfield__input" id={`tab-input-${this.props.tabId}`}/>
                    </div>

                    <button id={`tab-button-${this.props.tabId}`} className="mdl-button">Send</button>

                    <div className={"mdl-grid " + `mdl-grid-${this.props.tabId}`}>
                        {this.state.messages}
                    </div>

                </div>
            </section>
        )
    }
}