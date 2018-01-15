/**
 * Created by a on 2017/9/4.
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import '../../../public/styles/notify.less';

import { removeNotify } from '../actions/notifyPopup'
import { getNotifyStateClass } from '../../util/index'
import {FormattedMessage} from 'react-intl'
export class NotifyPopup extends Component {
    constructor(props) {
        super(props);
    }

    onClick(id) {
        this.props.actions.removeNotify(id);
    }

    render() {
        const {notifyPopup, intl} = this.props;

        let notifyList = notifyPopup.get("notifyList");
        let curList = notifyList.slice(0, 3);
        return <ul className="list-group notify-popup">
                 {
                     curList.map((item, index) => {
                         let id = item.get("id");
                         let ani = item.get("animation");
                         let text = item.get("text");

                         if(text){
                             console.log(text, typeof text);
                             if(text instanceof Error){
                                 console.log('error:', text.error);
                                 text = text.error?text.error.message:text.toString();
                             }
                             else if(typeof text == "object"){
                                 console.log('object:')
                                 text = text.toString();
                             }
                         }else{
                             text = '';
                         }

                         if(typeof text == "string"){

                         }
                         return <li key={ id } className={ "list-group-item " + ("notify-" + index) + " " + getNotifyStateClass(item.get("notifyType")) + " " + (ani ? "active" : "") }>
                                <div className="notify-content">{intl[text]?<FormattedMessage id={text} />:text}</div>
                                <span className="glyphicon glyphicon-remove" onClick={ () => this.onClick(id) }></span>
                              </li>
                   }) }
               </ul>
    }
}

function mapStateToProps(state) {
    return {
        notifyPopup: state.notifyPopup,
        intl: state.intl
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            removeNotify: removeNotify
        }, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NotifyPopup);