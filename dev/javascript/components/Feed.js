/**
 * Created by jahansj on 10/10/2016.
 */

import React, {Component} from 'react';

export default class Feed extends Component {
  constructor() {
    super();
  }
  
  render() {
    return (
        <div className={"mdl-grid " + `mdl-grid-${this.props.id}`}>
          {this.props.content}
        </div>
    )
  }
}