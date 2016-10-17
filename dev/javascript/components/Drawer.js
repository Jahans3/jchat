/**
 * Created by jahansj on 04/06/2016.
 */
import React, {Component} from 'react';

export default class Drawer extends Component {

  render() {
    return (
        <div className="mdl-layout__drawer">

          <span className="mdl-layout-title">Account</span>

          <nav className="mdl-navigation">
            <a href="/login" className="mdl-navigation__link">Login</a>
            <a href="/signup" className="mdl-navigation__link">Sign Up</a>
            <a href="/profile" className="mdl-navigation__link">View Profile</a>
          </nav>

          <div className="mdl-layout-spacer"></div>

          <nav className="mdl-navigation">
            <a href="/logout" className="mdl-navigation__link">Logout</a>
          </nav>
        </div>
    )
  }
}