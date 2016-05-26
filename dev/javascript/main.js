/**
 * Created by jahansj on 19/05/2016.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

const socket = io();

ReactDOM.render(<App />, document.getElementById('entry'));