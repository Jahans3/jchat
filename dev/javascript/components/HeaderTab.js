/**
 * Created by jahansj on 26/05/2016.
 */

import React, { Component, PropTypes } from 'react';
import Post from './Post';
import PostInput from './PostInput';
import Feed from './Feed';

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
                textContent: document.getElementById(`tab-input-${this.props.tabId}`).value,
                username: this.props.username
            });

            // prevent redirect
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

    render(){

        return (
            <section className={`feed__section mdl-layout__tab-panel ${this.props.customClass}`} id={`fixed-tab-${this.props.tabId}`}>
                <div className="page-content feed__container">

                    <PostInput id={this.props.tabId} />

                    <Feed id={this.props.tabId} content={this.state.messages} />

                </div>
            </section>
        )
    }
}