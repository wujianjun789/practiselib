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
import {Treebeard} from 'react-treebeard';
// import treeStyle from '../../components/treeStyle';
import {PassWordValid} from '../../util/index';
import {IsExitInArray} from '../../util/algorithm';
import MapView from '../../../src/components/MapView'
import {getModule} from '../../app/action'
export class UserPopup extends Component{
    constructor(props){
        super(props);
        const {data,isEdit=false} = this.props;
        this.state={
            id:isEdit?data.id:'',
            username:Immutable.fromJS({value:isEdit?data.username:'',checked:'',reminder:''}),
            lastName:Immutable.fromJS({value:isEdit?data.lastName:'',checked:'',reminder:''}),
            firstName:Immutable.fromJS({value:isEdit?data.firstName:'',checked:'',reminder:''}),
            password:Immutable.fromJS({value:'',checked:'',reminder:''}),
            rePassword:Immutable.fromJS({value:'',checked:'',reminder:''}),
            role:Immutable.fromJS({list:[{id:4, value:'访客'},{id:3, value:'设备操作员'},{id:2, value:'设备管理员'},{id:1, value:'系统管理员'}], index:isEdit?data.roleId.index:0, value:isEdit?data.roleId.value:'访客'}),
            modules:isEdit?data.modules:[]
        }
        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.roleChange = this.roleChange.bind(this);
        this.checkOut = this.checkOut.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.getCheckedModule = this.getCheckedModule.bind(this);
    }

    componentWillMount(){
        const {actions} = this.props;
        actions && actions.getModule();
    }

    onCancel(){
        this.props.actions.overlayerHide();
    }

    onConfirm(){
        const {id,username,lastName,firstName,password,rePassword,role} = this.state;
        const datas = this.props.isEdit?{
            id:id,
            lastName:lastName.get('value'),
            firstName:firstName.get('value'),
            modules:this.getCheckedModule(),
            roleId:role.getIn(['list',role.get('index'),'id'])
        }:{
            username:username.get('value'),
            password:password.get('value'),
            lastName:lastName.get('value'),
            firstName:firstName.get('value'),
            modules:this.getCheckedModule(),
            roleId:role.getIn(['list',role.get('index'),'id'])
        }
        this.props.onConfirm(datas,this.props.isEdit);
        this.props.actions.overlayerHide();
    }

    getCheckedModule(){
        let modules = document.getElementsByName('module');
        let checked_val = [];
        for(let i in modules){
            if(modules[i].checked)
                checked_val.push(modules[i].value);
        }
        return checked_val;
    }

    roleChange(selectIndex){
        let role = this.state.role.update('index', v=>selectIndex).update('value', () => this.state.role.getIn(['list', selectIndex, 'value']));
        this.setState({role: role})
    }

    checkOut(id){
        switch(id){
            case 'username':
            case 'lastName':
            case 'firstName':
                break;
            case 'password':
                PassWordValid(this.state.password.get('value'))?
                    this.setState({password:this.state.password.update('checked',v=>'success')})
                :
                    this.setState({password:this.state.password.update(v=>{
                        return v.set('checked','fail')
                                .set('reminder','密码只能为字母或数字')})})
                
                break;
            case 'rePassword':
                if(this.state.password.get('value')!==this.state.rePassword.get('value')){
                    this.setState({rePassword:this.state.rePassword.update(v=>{
                        return v.set('checked','fail')
                                .set('reminder','两次密码不一致')})})
                }
                else{
                    this.setState({rePassword:this.state.rePassword.update('checked',v=>'success')})
                }
                
        }
    }

    onFocus(id){
        this.setState({[id]:this.state[id].update(v=>{
                        return v.set('checked','')
                                .set('reminder','')})});
    }

    onChange(e){
        this.setState({[e.target.id]:this.state[e.target.id].update('value',v=>e.target.value)});
    }

    render() {
        let {className = '',title = '',modules,isEdit=false} = this.props;
        let {username,lastName,firstName,password,rePassword,toggle,domainList} = this.state;
        let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['取消','确认']} btnClassName={['btn-default', 'btn-primary']} btnDisabled={[false, false]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;
        return (
            <Panel className={className} title = {title} footer = {footer} closeBtn = {true} closeClick = {this.onCancel}>
                <div className = 'form-group row basic-info'>
                    <InputCheck label='用户名' className='col-sm-6' id='username' placeholder='请输入用户名' value= {username.get('value')} disabled={isEdit?true:false}
                        checked={username.get('checked')} reminder={username.get('reminder')} onBlur = {this.checkOut} onFocus={this.onFocus} onChange = {this.onChange}/>
                    <div className="inputCheck col-sm-6">
                        <label className="col-sm-4 control-label">用户等级:</label>
                        <div className="has-feedback col-sm-8 ">
                            <Select className="role" data={this.state.role}
                                onChange={this.roleChange}/>
                            <span className="glyphicon  form-control-feedback" aria-hidden="true"></span><span className="reminder"></span>
                        </div>
                    </div>
                    <InputCheck label='姓氏' className='col-sm-6' id='lastName' placeholder='请输入姓氏' value= {lastName.get('value')}
                        checked={lastName.get('checked')} reminder={lastName.get('reminder')} onBlur = {this.checkOut} onFocus={this.onFocus} onChange = {this.onChange}/>
                    <InputCheck label='名字' className='col-sm-6' id='firstName' placeholder='请输入名字' value= {firstName.get('value')}
                        checked={firstName.get('checked')} reminder={firstName.get('reminder')} onBlur = {this.checkOut} onFocus={this.onFocus} onChange = {this.onChange}/>
                    <InputCheck label='密码' className={`col-sm-6 ${isEdit?'hidden':''}`} id='password' type='password' placeholder='请输入密码' value= {password.get('value')} 
                        checked={password.get('checked')} reminder={password.get('reminder')} onBlur = {this.checkOut} onFocus={this.onFocus} onChange = {this.onChange}/>
                    <InputCheck label='重复密码' className={`col-sm-6 ${isEdit?'hidden':''}`} id='rePassword' type='password' placeholder='请再次输入密码' value= {rePassword.get('value')} 
                        checked={rePassword.get('checked')} reminder={rePassword.get('reminder')} onBlur = {this.checkOut} onFocus={this.onFocus} onChange = {this.onChange}/>
                </div>
                <div className = 'form-group row module-per'>
                    <label className="col-sm-2 control-label">模块权限:</label>
                    <div className="col-sm-10">
                        {
                            modules.map(item=>{
                                return <label className="checkbox-inline" key={item.key}>
                                    <input type="checkbox" name='module' value={item.key} defaultChecked={IsExitInArray(this.state.modules,item.key)}/> {item.title}
                                </label>
                            })
                        }
                    </div>
                </div>
            </Panel>
        )
    }
}

const mapStateToprops = (state, ownProps) => {
    return{
        modules:state.app.items
    }
}

const mapDispatchToProps = (dispatch, ownProps) =>{
    return {
        actions: bindActionCreators({
            overlayerHide,
            getModule
        }, dispatch)
    }
}

export default connect(mapStateToprops, mapDispatchToProps)(UserPopup) 