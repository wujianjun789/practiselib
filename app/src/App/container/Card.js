/**
 * create by Azrael on 2017/7/4
 */
import React from 'react';
import {Link} from 'react-router';

export const Card = ({_key, title, link}) => {
    return <Link to={link}>
        <div className={`card card-${_key}`}>
            <div className="ico"><span className={`icon icon-${_key}`}></span></div>
            <div className="title">{title}</div>
        </div>
    </Link>
}