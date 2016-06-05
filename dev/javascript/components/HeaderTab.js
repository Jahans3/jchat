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

        this.socket.on('connection', socket => {

            console.log(`tab-${this.props.tabId} connected`);
        });

        this.button = document.getElementById(`tab-button-${this.props.tabId}`);
        this.form = document.getElementById(`channel-form-${this.props.tabId}`);

        this.form.addEventListener('submit', e => {

            this.socket.emit('message', {

                id: this.props.tabId,
                textContent: document.getElementById(`tab-input-${this.props.tabId}`).value
            });

            e.preventDefault();
        });

        this.socket.on(`distribute:channel-${this.props.tabId}`, socket => {

            this.messages.splice(0, 0, <Post username={socket.username} textContent={socket.textContent} />);

            if (this.messages.length > 9) {

                this.messages.pop();
            }

            this.setState({ messages: this.messages });
        });

        this.socket.on('thing', (data) => {

            console.log(`tab-input-${this.props.tabId} has connected`);
        })
    }

    prevDef(event){
        event.preventDefault();
    }

    render(){

        return (
            <section className={`mdl-layout__tab-panel ${this.props.customClass}`} id={`fixed-tab-${this.props.tabId}`}>
                <div className="page-content">

                    <div className="mdl-card__title-text">
                        <form id={`channel-form-${this.props.tabId}`} action="none">
                            <input type="text" className="mdl-textfield__input" id={`tab-input-${this.props.tabId}`}/>
                            <button id={`tab-button-${this.props.tabId}`} className="mdl-button">Send</button>
                        </form>
                    </div>


                    <div className={"mdl-grid " + `mdl-grid-${this.props.tabId}`}>
                        {this.state.messages}
                    </div>

                </div>
            </section>
        )
    }
}