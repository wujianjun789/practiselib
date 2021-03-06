/**
 * create by Azrael on 2017/7/4
 */
import React from 'react';
import {Link} from 'react-router';
import PropTypes from 'prop-types';

/**
 * 
 * @param {String} _key     to add unique class. example Link>div.card.card-${_key}>div:first-child>span.icon.icon-${_key}
 * @param {String} title    item title to display
 * @param {String} link     direct to where when card click 
 * 
 */
const Card = ({_key, title, link}) => {
    /*const propTypes = {
        _key: PropTypes.string,
        title: PropTypes.string,
        link: PropTypes.string
    }

    const props = {
        _key: _key,
        title: title,
        link: link
    }

    PropTypes.checkPropTypes(propTypes, props, 'prop', 'Card');*/

    return <Link to={link}>
        <div className={`card card-${_key}`}>
            <div className="ico"><span className={`icon icon-${_key}`}></span></div>
            <div className="title">{title}</div>
        </div>
    </Link>
}

export default Card;