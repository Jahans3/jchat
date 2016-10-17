/**
 * Created by jahansj on 10/10/2016.
 */

import React, { Component } from 'react';

export default class PostInput extends Component {
  constructor() {
    super();
  }

  render() {
    return (
        <div className="mdl-card__title-text chat-input-container">
          <form id={`channel-form-${this.props.id}`} action="none">
            <input type="text" className="mdl-textfield__input" id={`tab-input-${this.props.id}`}/>
            <button id={`tab-button-${this.props.id}`} className="mdl-button">Send</button>
          </form>
        </div>
    )
  }
}