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

    onCancel(){
        this.props.action.overlayerHide();
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
        this.props.action.overlayerHide();
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
        /*  case 'username':
            case 'lastName':
            case 'firstName':
            break;
         * 
         */
        switch(id){
            case 'username':
                break;
            case 'lastName':
                break;
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

    onChange(id,value){
        this.setState({[id]:this.state[id].update('value',v=>value)});
    }

    render() {
        let {className = '',title = '',modules,isEdit=false} = this.props;
        let {username,lastName,firstName,password,rePassword,toggle,domainList} = this.state;
        let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['取消','确认']} btnClassName={['btn-default', 'btn-primary']} btnDisabled={[false, false]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;
        return (
            <Panel className={className} title = {title} footer = {footer} closeBtn = {true} closeClick = {this.onCancel}>
                <div className = 'form-group row basic-info'>
                    <InputCheck label='用户名' className='username' id='username' placeholder='请输入用户名' value= {username.get('value')} disabled={isEdit?true:false}
                        checked={username.get('checked')} reminder={username.get('reminder')} onBlur = {(id)=>this.checkOut(id)} onFocus={(id)=>this.onFocus(id)} onChange = {(id,value)=>{this.onChange(id,value)}}/>
                    <label className="col-sm-2 control-label">用户等级:</label>
                    <Select className="role" data={this.state.role}
                            onChange={(selectIndex)=>this.roleChange(selectIndex)}/>
                    <InputCheck label='姓氏' className='lastName' id='lastName' placeholder='请输入姓氏' value= {lastName.get('value')}
                        checked={lastName.get('checked')} reminder={lastName.get('reminder')} onBlur = {(id)=>this.checkOut(id)} onFocus={(id)=>this.onFocus(id)} onChange = {(id,value)=>{this.onChange(id,value)}}/>
                    <InputCheck label='名字' className='firstName' id='firstName' placeholder='请输入名字' value= {firstName.get('value')}
                        checked={firstName.get('checked')} reminder={firstName.get('reminder')} onBlur = {(id)=>this.checkOut(id)} onFocus={(id)=>this.onFocus(id)} onChange = {(id,value)=>{this.onChange(id,value)}}/>
                    <InputCheck label='密码' className={`password ${isEdit?'hidden':''}`} id='password' type='password' placeholder='请输入密码' value= {password.get('value')} 
                        checked={password.get('checked')} reminder={password.get('reminder')} onBlur = {(id)=>this.checkOut(id)} onFocus={(id)=>this.onFocus(id)} onChange = {(id,value)=>{this.onChange(id,value)}}/>
                    <InputCheck label='重复密码' className={`rePassword ${isEdit?'hidden':''}`} id='rePassword' type='password' placeholder='请再次输入密码' value= {rePassword.get('value')} 
                        checked={rePassword.get('checked')} reminder={rePassword.get('reminder')} onBlur = {(id)=>this.checkOut(id)} onFocus={(id)=>this.onFocus(id)} onChange = {(id,value)=>{this.onChange(id,value)}}/>
                </div>
                <div className = 'form-group row module-per'>
                    <label className="col-sm-2 control-label">模块权限:</label>
                    <div className="col-sm-10">
                        <div className = 'row'>
                            
                            {modules.slice(0,4).map(item=>{
                                return <label className="checkbox-inline" key={item.key}>
                                    <input type="checkbox" name='module' value={item.key} defaultChecked={IsExitInArray(this.state.modules,item.key)}/> {item.title}
                                </label>
                            })}
                        </div>
                        {modules.length>4?<div className = 'row'>
                            {modules.slice(4,8).map(item=>{
                                return <label className="checkbox-inline" key={item.key}>
                                    <input type="checkbox" name='module' value={item.key} defaultChecked={IsExitInArray(this.state.modules,item.key)}/> {item.title}
                                </label>
                            })}
                        </div>:''}
                        {modules.length>8?<div className = 'row'>
                            {modules.slice(9).map(item=>{
                                return <label className="checkbox-inline" key={item.key}>
                                    <input type="checkbox" name='module'value={item.key} defaultChecked={IsExitInArray(this.state.modules,item.key)}/> {item.title}
                                </label>
                            })}
                        </div>:''}
                    </div>
                </div>
            </Panel>
        )
    }
}

const mapStateToprops = (state, ownProps) => {
    return{
        permissionManage:state.permissionManage,
        modules:state.app.items
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