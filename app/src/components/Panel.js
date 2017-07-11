/**
 * create by Azrael on 2017/02/21
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import {FormattedMessage} from 'react-intl';
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
export default class Panel extends Component {

    closeClick() {
        this.props.closeClick ? this.props.closeClick() : null;
    }

    render() {
        let clsName = 'panel ' + (!!this.props.className ? this.props.className : 'panel-primary');
        let style = this.props.style ? this.props.style : null;
        let props = this.props;
        let _props = {
            title: props.title ? props.title : '　',
            body: props.body ? props.body : 
                <div className="row pull-center">{props.text ? props.text : '无相关数据'}</div>,
            footer: props.footer ? <div className="panel-footer clearfix">{props.footer}</div> : null,
            closeBtn: props.closeBtn ? true : false
        };
        
        return (
            <div className={clsName} style={style}>
                <div className="panel-heading clearfix">
                    <h3 className="panel-title">{_props.title}</h3>
                    {_props.closeBtn ? <button type="button" className="close" onClick={()=>this.closeClick()}><span>&times;</span></button> : null}
                </div>
                <div className="panel-body">
                {this.props.children ? this.props.children : _props.body }
                </div>
                { _props.footer }
            </div>
        )
    }
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