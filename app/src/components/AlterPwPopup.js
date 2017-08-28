import React, {PureComponent} from 'react';
import Panel from './Panel';
import PanelFooter from './PanelFooter';
import InputCheck from './InputCheck';
import {PassWordValid} from '../util/index';

export default class AlterPwPopup extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            oldPw: '',
            newPw: '',
            repPw: '',
            checkStatus: {
                oldPw: {checked: '', reminder: ''},
                newPw: {checked: '', reminder: ''},
                repPw: {checked: '', reminder: ''}
            }
        }
        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.checkOut = this.checkOut.bind(this);
        this.isSubmitBtnDisabled = this.isSubmitBtnDisabled.bind(this);
    }

    onCancel() {
        this.props.overlayerHide();
    }

    onConfirm() {
        this.props.modifyPassword && this.props.modifyPassword(this.state, () => {
            this.props.overlayerHide();
        }, (err) => {
            this.setState({ checkStatus: Object.assign( {}, this.state.checkStatus, { oldPw: Object.assign( {}, this.state.checkStatus.oldPw, {checked: 'fail', reminder: '旧密码输入不正确'} ) } ) });
        });
    }

    onChange(event) {
        let {id, value} = event.target;
        this.setState({[id]: value});
    }

    checkOut(id) {
        const {checkStatus} = this.state;
        let checked = '';
        let reminder = '';
        switch(id) {
            case 'oldPw':
            case 'newPw':
                if ( PassWordValid(this.state[id]) ) {
                    checked = 'success';
                } else {
                    checked = 'fail';
                    reminder = '密码只能为字母、数字';
                }
                break;
            case 'repPw':
                if( !PassWordValid(this.state[id]) ) {
                    checked = 'fail';
                    reminder = '密码只能为字母、数字';
                } else if ( this.state.newPw !== this.state.repPw ) {
                    checked = 'fail';
                    reminder = '两次密码不一致';
                } else {
                    checked = 'success';
                }
                break;
        }
        this.setState( { checkStatus: Object.assign( {}, checkStatus, { [id]: Object.assign( {}, checkStatus[id], { checked, reminder } ) } ) } );
    }

    onFocus(id) {
        this.setState({checkStatus: Object.assign({}, this.state.checkStatus, {[id]: {checked: '', reminder: ''}})});
    }

    isSubmitBtnDisabled() {
        let disabled = false;
        let {oldPw, newPw, repPw, checkStatus: {oldPw:_oldPw, newPw: _newPw, repPw: _repPw}} = this.state;
        if (oldPw == '' || newPw == '' || repPw == '') {
            disabled = true;
            return disabled;
        }
        if ( _oldPw.checked == 'fail' || _newPw.checked == 'fail' || _repPw.checked == 'fail') {
            disabled = true;
        }
        return disabled;
    }

    render() {
        let {className=''} = this.props;
        let {oldPw, newPw, repPw, checkStatus: {oldPw:_oldPw, newPw: _newPw, repPw: _repPw}} = this.state;
        let _disabled = this.isSubmitBtnDisabled();
        let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['取消','确认']} btnClassName={['btn-default', 'btn-primary']} btnDisabled={[false, _disabled]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;
        return <Panel className={className} title='修改密码'  footer={footer} closeBtn={true} closeClick={this.onCancel}>
            <InputCheck label='旧密码' id='oldPw' type='password' placeholder='输入旧密码' value={oldPw} 
                checked={_oldPw.checked} reminder={_oldPw.reminder} onBlur={this.checkOut} onFocus={this.onFocus} onChange={this.onChange}/>
            <InputCheck label='新密码' id='newPw' type='password' placeholder='输入新密码' value={newPw} 
                checked={_newPw.checked} reminder={_newPw.reminder} onBlur={this.checkOut} onFocus={this.onFocus} onChange={this.onChange}/>
            <InputCheck label='重复密码' id='repPw' type='password' placeholder='请再次输入密码' value={repPw} 
                checked={_repPw.checked} reminder={_repPw.reminder} onBlur={this.checkOut} onFocus={this.onFocus} onChange={this.onChange}/>
        </Panel>
    }
}