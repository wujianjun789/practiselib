import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter';
import {overlayerHide} from '../../common/actions/overlayer';
import '../../../public/styles/permissionManage.less';
import InputCheck from '../../components/InputCheck';
import Select from '../../components/Select';
import Immutable from 'immutable';

class UserPopup extends Component{
    constructor(props){
        super(props);
        const {data} = this.props;
        this.state={
            userName:Immutable.fromJS({value:!!data.userName?data.userName:'',checked:'',reminder:''}),
            lastName:Immutable.fromJS({value:!!data.lastName?data.lastName:'',checked:'',reminder:''}),
            firstName:Immutable.fromJS({value:!!data.firstName?data.firstName:'',checked:'',reminder:''}),
            password:Immutable.fromJS({value:!!data.password?data.password:'',checked:'',reminder:''}),
            rePassword:Immutable.fromJS({value:!!data.rePassword?data.rePassword:'',checked:'',reminder:''}),
            grade:Immutable.fromJS({list:[{id:1, value:'访客'},{id:2, value:'系统管理员'},{id:3, value:'设备管理员'},{id:4, value:'设备操作员'}], index:0, value:'访客'}),
        }
        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.checkOut = this.checkOut.bind(this);
    }

    onCancel(){
        this.props.action.overlayerHide();
    }

    onConfirm(){
        this.props.action.overlayerHide();
    }

    gradeChange(){
        this.setState({grade:this.state.grade.update('index', v=>selectIndex)})
        this.setState({grade:this.state.grade.update('value', v=>{
            return this.state.grade.getIn(['list', selectIndex, 'value']);
        })})
    }

    checkOut(id){
        switch(id){
            case 'userName':
            case 'lastName':
            case 'firstName':
            case 'password':
            case 'rePassword':
        }
    }

    render() {
        let {className = ''} = this.props;
        let {userName,lastName,firstName,password,rePassword} = this.state;
        let footer = <PanelFooter funcNames={['onConfirm','onCancel']} btnTitles={['取消','确认']} btnClassName={['btn-default', 'btn-primary']} btnDisabled={[false, false]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;
        return (
            <div className = {className}>
                <Panel title = '用户资料' footer = {footer} closeBtn = {true} closeClick = {this.onCancel}>
                    <div className = 'form-group row basic-info'>
                        <InputCheck label='用户名' className='userName' placeholder='请输入用户名' value= {userName.get('value')} 
                            checked={userName.get('checked')} reminder={userName.get('reminder')} onBlur = {(id)=>this.checkOut(id)} />
                        <label className="col-sm-2 control-label">用户等级:</label>
                        <Select className="grade" data={this.state.grade}
                                onChange={(selectIndex)=>this.gradeChange(selectIndex)}/>
                        <InputCheck label='姓氏' className='lastName' placeholder='请输入姓氏' value= {userName.get('value')} 
                            checked={userName.get('checked')} reminder={userName.get('reminder')} onBlur = {(id)=>this.checkOut(id)}/>
                        <InputCheck label='名字' className='firstName' placeholder='请输入名字' value= {userName.get('value')} 
                            checked={userName.get('checked')} reminder={userName.get('reminder')} onBlur = {(id)=>this.checkOut(id)}/>
                        <InputCheck label='密码' className='password' type='password' placeholder='请输入密码' value= {userName.get('value')} 
                            checked={userName.get('checked')} reminder={userName.get('reminder')} onBlur = {(id)=>this.checkOut(id)}/>
                        <InputCheck label='重复密码' className='rePassword' type='password' placeholder='请再次输入密码' value= {userName.get('value')} 
                            checked={userName.get('checked')} reminder={userName.get('reminder')} onBlur = {(id)=>this.checkOut(id)}/>
                    </div>
                    <div className = 'form-group row module-per'>
                        <label className="col-sm-2 control-label">模块权限:</label>
                        <div className="col-sm-10">
                            <div className = 'row'>
                                <label className="checkbox-inline">
                                    <input type="checkbox" id="inlineCheckbox1" value="option1"/> 报表管理
                                </label>
                                <label className="checkbox-inline">
                                    <input type="checkbox" id="inlineCheckbox2" value="option2"/> 报表管理
                                </label>
                                <label className="checkbox-inline">
                                    <input type="checkbox" id="inlineCheckbox3" value="option3"/> 报表管理
                                </label>
                                <label className="checkbox-inline">
                                    <input type="checkbox" id="inlineCheckbox4" value="option4"/> 报表管理
                                </label>
                            </div>
                            <div className = 'row'>
                                <label className="checkbox-inline">
                                    <input type="checkbox" id="inlineCheckbox1" value="option1"/> 报表管理
                                </label>
                                <label className="checkbox-inline">
                                    <input type="checkbox" id="inlineCheckbox2" value="option2"/> 报表管理
                                </label>
                                <label className="checkbox-inline">
                                    <input type="checkbox" id="inlineCheckbox3" value="option3"/> 报表管理
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className = 'form-group row domain-per'>
                        <label className="col-sm-2 control-label">域权限:</label>
                        <div className="col-sm-10">

                        </div>
                    </div>
                </Panel>
            </div>
        )
    }
}

const mapStateToprops = (state, ownProps) => {
    return{
        permissionManage:state.permissionManage
    }
}

const mapDispatchToProps = (dispatch, ownProps) =>{
    return {
        action: bindActionCreators({
            overlayerHide:overlayerHide,
        }, dispatch)
    }
}

export default connect(mapStateToprops, mapDispatchToProps)(UserPopup) 