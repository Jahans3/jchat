/**
 * Created by jahansj on 26/05/2016.
 */

import React, { Component, PropTypes } from 'react';
import HeaderTab from './HeaderTab';

export default class HeaderNav extends Component {

    constructor(props){
        super(props);

    }

    render(){
        return (
            <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header mdl-layout--fixed-tabs">
                <header className="mdl-layout__header">
                    <div className="mdl-layout__header-row">
                        <span className="mdl-layout-title">@username</span>
                    </div>
                    <div className="mdl-layout__tab-bar mdl-js-ripple-effect">
                        <a href="#fixed-tab-1" className="headernav__tab mdl-layout__tab is-active">#Channel-1</a>
                        <a href="#fixed-tab-2" className="headernav__tab mdl-layout__tab">#Channel-2</a>
                        <a href="#fixed-tab-3" className="headernav__tab mdl-layout__tab">#Channel-3</a>
                    </div>
                </header>
                <div className="mdl-layout__drawer">
                    <span className="mdl-layout-title">Settings</span>
                </div>
                <main className="mdl-layout__content">
                    <HeaderTab tabId="1" />
                    <HeaderTab tabId="2" />
                    <HeaderTab tabId="3" />
                </main>
            </div>
        )
    }
}