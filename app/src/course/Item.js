import React, { Component } from 'react';
export default class Item extends Component {

    render() {
        const { avatar = "", name = "", actived = false, onClick } = this.props;

        const avatarStyle = avatar ? { backgroundImage: `url(${avatar})` } : {};

        return (
            <div className={`entity ${actived ? "active" : ""}`} onClick={onClick}>
                <span className="p1">
                    <div className="person-icon" style={avatarStyle}></div>
                </span>
                <span className="p2">
                    <span className="name">{name}</span>
                </span>
            </div>
        )
    }
}