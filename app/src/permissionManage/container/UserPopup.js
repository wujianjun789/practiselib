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

class UserPopup extends Component{
    constructor(props){
        super(props);
        const {data} = this.props;
        this.state={
            toggle:'hidden',
            userName:Immutable.fromJS({value:!!data.userName?data.userName:'',checked:'',reminder:''}),
            lastName:Immutable.fromJS({value:!!data.lastName?data.lastName:'',checked:'',reminder:''}),
            firstName:Immutable.fromJS({value:!!data.firstName?data.firstName:'',checked:'',reminder:''}),
            password:Immutable.fromJS({value:!!data.password?data.password:'',checked:'',reminder:''}),
            rePassword:Immutable.fromJS({value:!!data.rePassword?data.rePassword:'',checked:'',reminder:''}),
            grade:Immutable.fromJS({list:[{id:1, value:'访客'},{id:2, value:'系统管理员'},{id:3, value:'设备管理员'},{id:4, value:'设备操作员'}], index:0, value:'访客'}),
            domainList:['中国-杭州','中国-上海','中国-北京','中国-武汉','中国-长沙','中国-上海-闵行','中国-上海-闵行-莘庄']
        }
        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.checkOut = this.checkOut.bind(this);
        this.toggleOpen = this.toggleOpen.bind(this);
    }

    onCancel(){
        this.props.action.overlayerHide();
    }

    onConfirm(){
        this.props.action.overlayerHide();
    }

    gradeChange(selectIndex){
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

    toggleOpen(){
        this.setState({toggle:''});
    }

    render() {
        let {className = '',modules} = this.props;
        let {userName,lastName,firstName,password,rePassword,toggle,domainList} = this.state;
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
                                {modules.slice(0,4).map(item=>{
                                    return <label className="checkbox-inline" key={item.key}>
                                        <input type="checkbox" id={item.key} value={item.key}/> {item.title}
                                    </label>
                                })}
                            </div>
                            {modules.length>4?<div className = 'row'>
                                {modules.slice(5).map(item=>{
                                    return <label className="checkbox-inline" key={item.key}>
                                        <input type="checkbox" id={item.key} value={item.key}/> {item.title}
                                    </label>
                                })}
                            </div>:''}
                        </div>
                    </div>
                    <div className = 'form-group row domain-per'>
                        <label className="col-sm-2 control-label">域权限:</label>
                        <div className="col-sm-10">
                            <div className='col-sm-6 domain-add'>
                                <div className='row'>
                                    <button className="btn btn-primary" onClick = {this.toggleOpen}>添加域</button>
                                </div>
                                <div className={`dropdown ${toggle}`}>
                                    <button className="dropdown-toggle" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                        选择区域
                                        <span className="glyphicon glyphicon-triangle-bottom"></span>
                                    </button>
                                     <div className="dropdown-menu" aria-labelledby="dropdownMenu1" >
                                        
                                    </div> 
                                </div>
                                <ul className={`domain-list${toggle=='hidden'?'-l':''}`}>
                                    {
                                        domainList.map((item,index)=>{
                                            return <li key = {index}>
                                                <span className="icon-table-delete"></span>
                                                    {item}
                                            </li>
                                        })
                                    }
                                </ul>
                            </div>
                            <div className='col-sm-6 domain-add-map'></div>
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