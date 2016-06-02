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
            <div className={"mdl-card mdl-shadow--2dp through mdl-shadow--16dp mdl-cell mdl-cell--3-col post__wrapper"}>

                <div className={"mdl-card__title"}>
                    <h4 className="mdl-card__title-text post__title-text">
                        <a href="#"> { this.props.username } </a>
                    </h4>
                </div>

                <div className="mdl-card__supporting-text post__supporting-text">
                    { this.props.textContent }
                </div>

                <div className="mdl-card__actions post__actions">
                    <button className="mdl-button"> <i className="material-icons">grade</i> </button>
                    <button className="mdl-button"> <i className="material-icons">thumb_up</i> </button>
                    <button className="mdl-button"> <i className="material-icons">reply</i> </button>
                </div>

            </div>
        )
    }
}