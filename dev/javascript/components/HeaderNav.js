/**
 * Created by jahansj on 26/05/2016.
 */

import React, { Component, PropTypes } from 'react';
import HeaderTab from './HeaderTab';
import Drawer from './Drawer';

export default class HeaderNav extends Component {

    constructor(props){
        super(props);

        this.socket = io();
        this.state = {
            user: 'jChat'
        }
    }

    componentDidMount(){

        let xhr = new XMLHttpRequest();

        xhr.open('GET', encodeURI('userdata_request'));
        xhr.onload = function (response) {
            if (xhr.status == 200) {

                let res = response.target.response;
                console.log(res);

                this.setState({ user: res });
                // res.local.email
                // res.twitter. ?? have to ask twitter for extra permissions
                // res.google.name.givenName + res.google.name.familyName
            }
            else {
                console.log('bad response');
            }

        }.bind(this);

        try {
            xhr.send();
        } catch (e) {
            console.log(e);
        }
    }

    render(){
        return (
            <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header mdl-layout--fixed-tabs">
                <header className="mdl-layout__header headernav__header">
                    <div className="mdl-layout__header-row">
                        <span className="mdl-layout-title">{ this.state.user }</span>
                    </div>
                    <div className="mdl-layout__tab-bar mdl-js-ripple-effect">
                        <a href="#fixed-tab-1" className="headernav__tab mdl-layout__tab is-active">#Channel-1</a>
                        <a href="#fixed-tab-2" className="headernav__tab mdl-layout__tab">#Channel-2</a>
                        <a href="#fixed-tab-3" className="headernav__tab mdl-layout__tab">#Channel-3</a>
                    </div>
                </header>
                <Drawer />
                <main className="mdl-layout__content">
                    <HeaderTab tabId="1" username={this.state.user} customClass="is-active" />
                    <HeaderTab tabId="2" username={this.state.user} />
                    <HeaderTab tabId="3" username={this.state.user} />
                </main>
            </div>
        )
    }
}