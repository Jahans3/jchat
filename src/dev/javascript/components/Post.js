/**
 * Created by jahansj on 25/05/2016.
 */
import React, { Component } from 'react';

export default class Post extends Component {

    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className={"mdl-card "}>

                <div className={"mdl-card__title "}>
                    <h4 className="mdl-card__title-text">{ this.props.username }</h4>
                </div>

                <div className="mdl-card__supporting-text">
                    <p> { this.props.textContent } </p>
                </div>

            </div>
        )
    }
}