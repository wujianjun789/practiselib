/**
 * create by Azrael on 2017/7/4
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {overlayerShow, overlayerHide} from '../actions/overlayer';
import ConfirmPopup from '../../components/ConfirmPopup';
import AlterPwPopup from '../../components/AlterPwPopup';
import {confirmExit} from '../actions/userCenter';
import {modifyPassword} from '../../api/modifyPassword';
/**
 * @param {String} className  optional
 * @param {Object} router     isRequired
 */
export class UserCenter extends Component{
    constructor(props) {
        super(props);
        this.state = {
            active: false,
            list: [
                {name: '修改密码', key: 'alter',path:'#alter'},
                {name: '退出管理系统', key: 'exit',path:'#exit'}
            ]
        }
        this.userListToggle = this.userListToggle.bind(this);
        this.itemClick = this.itemClick.bind(this);
        this.cancel = this.cancel.bind(this);
        this.confirm = this.confirm.bind(this);
        this.AlterPwPopupConfirm = this.AlterPwPopupConfirm.bind(this);
    }

    userListToggle() {
        this.setState((prevState)=> {
            return {active: !prevState.active};
        });
        // if(this.state.active==false){
        //     setTimeout(() => {
        //         if(this.state.active==false){}else{
        //             this.setState((prevState)=> {
        //             return{active: !prevState.active}
        //             });
        //         }
        //     }, 3000);
        // }
    }

    cancel() {
        this.props.actions.overlayerHide();
    }

    confirm() {
        this.props.actions.confirmExit(() => {
            this.props.actions.overlayerHide();
        }, () => {
            this.props.actions.overlayerHide();
        });
    }

    AlterPwPopupConfirm(data) {
        modifyPassword(data,() => {
            this.props.actions.overlayerHide();
            this.props.router.push('/login');
        }, (err) => {
            console.log('密码错误');
        });
    }
 
    componentDidMount() {
    }

    itemClick(key) {
        let {overlayerHide, overlayerShow} = this.props.actions;
        if(key == 'alter') {
            overlayerShow(<AlterPwPopup className='alter-pw-popup' overlayerShow={overlayerShow} overlayerHide={overlayerHide} onConfirm={this.AlterPwPopupConfirm}/>);
        } else {
            overlayerShow(<ConfirmPopup tips="是否退出？" iconClass="icon-popup-exit" cancel={this.cancel} confirm={this.confirm}/>);
        }
    }

    render() {
        const {active, list} = this.state;
        const {className=""} = this.props;
        return (
            <div className={`user-center ${className}`} onClick={this.userListToggle}>
                <svg className="svgOnload"> 
                <symbol id="alter"><path fill="#8a8a8a" d="M100.5,3.5c-50.665,0-92.159,39.249-95.745,89h20.304C28.827,54.048,61.245,24,100.688,24
    c41.974,0,76,34.026,76,76s-34.026,76-76,76c-16.36,0-31.498-5.186-43.894-13.982c2.125-3.098,6.972-11.393,7.296-11.393
    c0.786,0,1.967-0.393,2.753-1.18l5.113-5.113l13.374-1.967c1.573-0.393,3.147-1.573,3.147-3.147l2.36-13.767l14.947-14.947
    c11.8,5.113,25.96,2.36,35.401-6.687c12.587-12.587,12.587-33.041,0-45.627c-12.587-12.587-33.041-12.587-45.627,0
    c-9.44,9.44-11.8,23.207-6.687,35.401l-38.941,38.94c-0.787,0.787-1.18,1.574-1.18,2.754s0.393,1.967,1.18,2.753L63.719,150.5
    c0.308,0.308-5.236,8.111-7.214,11.314C39.692,149.765,27.988,131.038,25.3,109.5H5.017c5.001,48.32,45.841,86,95.483,86
    c53.019,0,96-42.981,96-96S153.519,3.5,100.5,3.5z M119.551,69.99c5.507,0,9.833,4.327,9.833,9.833c0,5.507-4.327,9.833-9.833,9.833
    c-5.507,0-9.833-4.327-9.833-9.833S114.044,69.99,119.551,69.99z M61.73,136.858l-2.753-2.753l27.534-27.534l2.753,2.753
    L61.73,136.858z"/></symbol> 
                <symbol id="exit"><path fill="#ff5c68" d="M99.78,171.65c-39.805,0-71.732-32.341-71.732-71.732S60.39,28.187,99.78,28.187
    c14.927,0,28.61,4.561,40.22,12.439c14.512,0,17.415,0.415,35.244,0.415C157.829,18.65,130.463,4.553,99.78,4.553
    C46.707,4.553,4,47.26,4,100.333s42.707,95.78,95.78,95.78c30.683,0,57.634-14.098,75.463-36.488h-34.829
    C128.805,167.089,114.707,171.65,99.78,171.65z M137.463,131.431l14.512,14.512L198,99.919l-46.024-46.024l-14.512,14.512
    l19.902,19.902H73.195v23.22h84.171L137.463,131.431L137.463,131.431z"/></symbol>
            </svg>
                <div className="user-icon clearfix"><span className="glyphicon glyphicon-user" aria-hidden="true"></span></div>
                <ul className={`user-list ${active ? '' : 'hidden'}`}>
                {
                    list.map(item => <li key={item.key} onClick={()=>this.itemClick(item.key)}><svg><use xlinkHref={item.path} transform="scale(0.08,0.08)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg><span>{item.name}</span></li>)
                }
                </ul>
            </div>
        )
    }
}

UserCenter.propTypes = {
    className: PropTypes.string,
    router: PropTypes.any.isRequired
}

const mapStateToProps = (state, ownProps) => {
    return {}
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            overlayerShow,
            overlayerHide,
            confirmExit
        }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserCenter);