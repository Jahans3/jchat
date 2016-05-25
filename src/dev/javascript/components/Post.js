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
            <div className={"mdl-card mdl-shadow--2dp through mdl-shadow--16dp"}>

                <div className={"mdl-card__title"}>
                    <h4 className="mdl-card__title-text">
                        <a href="#"> { this.props.username } </a>
                    </h4>
                </div>

                <div className="mdl-card__supporting-text">
                    { this.props.textContent }
                </div>

                <div className="mdl-card__actions">
                    <button className="mdl-button"> <i className="material-icons">grade</i> </button>
                    <button className="mdl-button"> <i className="material-icons">thumb_up</i> </button>
                    <button className="mdl-button"> <i className="material-icons">comment</i> </button>
                </div>

            </div>
        )
    }
}