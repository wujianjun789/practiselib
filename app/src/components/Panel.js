/**
 * create by Azrael on 2017/02/21
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
/**
 * Panel component
 * @param {String}      className   'panel theme,default:　panel-primary'
 * @param {String}      title       'panel title, default: '　'
 * @param {Any}         body        'panel body'
 * @param {Any}         footer      'panel footer,default:hidden'
 * @param {String}      text        'no body tips,default: '无相关数据!''
 * @param {Boolean}     closeBtn    'panel close,true: display, false: hidden, default: false'
 * @param {Func}        closeClick  'panel close button handler'
 * 
 */
const Panel = (props) => {
    let {className='', closeClick=null, title='', text, body, footer, closeBtn, children} = props;
    body = body ? body : <div className="row pull-center">{text ? text : '无相关数据'}</div>;
    footer = footer ? footer : null,
    closeBtn =  closeBtn ? true : false;
    return (
        <div className={`modal ${className}`} role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        {closeBtn ? <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeClick}><span aria-hidden="true">&times;</span></button> : null}
                        <h4 className="modal-title">{title}</h4>
                    </div>
                    <div className="modal-body">
                        {children ? children : body }
                    </div>
                    { footer }
                </div>
            </div>
        </div>
    )
}

Panel.propTypes = {
    className: PropTypes.string,
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]),
    body: PropTypes.any,
    footer: PropTypes.any,
    text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]),
    closeBtn: PropTypes.bool,
    closeClick: PropTypes.func
}

export default Panel;