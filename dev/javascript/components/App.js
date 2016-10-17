/**
 * Created by jahansj on 21/05/2016.
 */
import React, {Component} from 'react';
import Post from './Post';
import HeaderNav from './HeaderNav';

export default class App extends Component {
  constructor() {
    super();

    this.messages = [];
    this.socket = io();
    this.state = {};
  }

  componentDidMount() {
    this.socket.on('thing', function (socket) {
      console.log(`A user connected: ${socket.data}`)
    });
  }

  render() {
    return (
        <div>
          <HeaderNav />
        </div>
    )
  }
}