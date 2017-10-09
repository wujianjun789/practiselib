/**
 * Created by a on 2017/9/4.
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import '../../../public/styles/notify.less';

import { removeNotify } from '../actions/notifyPopup'
import { getNotifyStateClass } from '../../util/index'
export class NotifyPopup extends Component {
    constructor(props) {
        super(props);
    }

    onClick(id) {
        this.props.actions.removeNotify(id);
    }

    render() {
        const {notifyPopup} = this.props;

        let notifyList = notifyPopup.get("notifyList");
        let curList = notifyList.slice(0, 3);
        return <ul className="list-group notify-popup">
                 { curList.map((item, index) => {
                       let id = item.get("id");
                       setTimeout(()=>{
                            this.props.actions.removeNotify(id);
                       }, 1000);

                       let ani = item.get("animation");
                   
                       return <li key={ id } className={ "list-group-item " + ("notify-" + index) + " " + getNotifyStateClass(item.get("notifyType")) + " " + (ani ? "active" : "") }>
                                <div className="notify-content">{ item.get("text") }</div>
                                <span className="glyphicon glyphicon-remove" onClick={ () => this.onClick(id) }></span>
                              </li>
                   }) }
               </ul>
    }
}

function mapStateToProps(state) {
    return {
        notifyPopup: state.notifyPopup
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