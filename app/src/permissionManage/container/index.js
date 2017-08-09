import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Overlayer from '../../common/containers/Overlayer'
import {overlayerShow,overlayerHide} from '../../common/actions/overlayer';
import UserPopup from './UserPopup'
import HeadBar from '../../components/HeadBar'
import Page from '../../components/Page'
import SearchText from '../../components/SearchText'
import '../../../public/styles/permissionManage.less';
import Immutable from 'immutable';
import Table2 from '../../components/Table2';
import ConfirmPopup from '../../components/ConfirmPopup';
import {getObjectByKeyObj,getListByKeyObj} from '../../util/algorithm';
import {requestUserData,deleteUser} from '../../api/permission';
import {addUser,editUser} from '../../api/permission';
import {getMomentDate,momentDateFormat} from '../../util/time'
export class PermissionManage extends Component{
    constructor(props){
        super(props);
        this.state = {
            datas:[],
            search:Immutable.fromJS({placeholder:'输入用户名称', value:''}),
            page: Immutable.fromJS({
                pageSize:10,
                current: 1,
                total: 21
            }),
            popupinfo:{
                username:'',
                lastName:'',
                firstName:'',
                modules:[]
            }
        }
        this.columns = [{field:"role", title:" "}, {field:"username", title:"用户名称"},
            {field:"lastLoginDate", title:"最后登录时间"}];
        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.searchChange = this.searchChange.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.requestData = this.requestData.bind(this);
        this.dataHandle = this.dataHandle.bind(this);
        this.confirmClick = this.confirmClick.bind(this);
    }

    componentWillMount(){
        this.mounted = true;
        this.requestData();
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    onClick(){
        // const popupinfo = this.props.permissionManage.popupinfo;
        this.props.action.overlayerShow(<UserPopup className='user-add-popup' title='添加用户' data={this.state.popupinfo} onConfirm={this.confirmClick}/>);
    }

    searchChange(value){
        this.setState({search:this.state.search.update('value', v=>value)});
    }

    searchSubmit(){
        let search = this.state.search.get('value');
        this.requestData(search);
    }

    onChange(current, pageSize) {
        let page = this.state.page.set('current', current);
        this.setState({page: page}, ()=>{
            this.requestData();
        });
    }

    requestData(username){
        const {search, page} = this.state;
        let cur = page.get('current');
        let size = page.get('pageSize');
        let offset = (cur-1)*size;
        requestUserData(offset,size,(response)=>{this.mounted && this.dataHandle(response)},username);
    }

    dataHandle(datas){
        let result = datas.map(item=>{
            item.role = <div className='role-icon'><span className={`icon role${item.roleId}`}></span></div>;
            item.lastLoginDate = item.lastLoginDate?momentDateFormat(getMomentDate(item.lastLoginDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ'),'YYYY-MM-DD HH:mm:ss'):'';
            return item;
        })
        this.setState({datas:result,page:this.state.page.update('total',v=>datas.length)})
    }

    rowEdit(id){
        let popupinfo = getObjectByKeyObj(this.state.datas,'id',id);
        switch(popupinfo.roleId){
            case 1:
                popupinfo.roleId = {index:3, value:'系统管理员'};
                break;
            case 2:
                popupinfo.roleId = {index:2, value:'设备管理员'};
                break;
            case 3:
                popupinfo.roleId = {index:1, value:'设备操作员'};
                break;
            case 4:
                popupinfo.roleId = {index:0, value:'访客'};
                break;
            default:
                popupinfo.roleId = {index:0, value:'访客'};
        }
        this.setState({popupinfo:Object.assign(this.state.popupinfo,popupinfo)},()=>this.props.action.overlayerShow(<UserPopup className='user-edit-popup' title='用户资料' data={this.state.popupinfo} isEdit onConfirm={this.confirmClick}/>))
        
    }

    rowDelete(id){
        this.props.action.overlayerShow(<ConfirmPopup tips="是否删除选中用户？" iconClass="icon_popup_delete" cancel={()=>{this.props.action.overlayerHide()}} confirm={()=>{
            this.props.action.overlayerHide()
            let page = this.state.page.set('current', 1);
            this.setState({page:page},deleteUser(id,this.requestData))
        }}/>);
    }

    confirmClick(datas,isEdit){
        if(isEdit){
            editUser(datas,this.requestData);
        }
        else{
            let page = this.state.page.set('current', 1);
            this.setState({page:page},addUser(datas,this.requestData))
        }
    }

    render() {
        const {datas,search, page} = this.state;
        return(
            <div className='container permission-manage'>
                <HeadBar moduleName='权限管理' router={this.props.router}/>
                <div className = 'content '>
                    <div className = 'heading'>
                        <SearchText className="search" placeholder={search.get('placeholder')} value={search.get('value')} onChange={(value)=>this.searchChange(value)} submit={()=>this.searchSubmit()}/>                        
                        <button className='btn btn-primary' onClick={this.onClick}>添加</button>
                    </div>
                    <div className="table-container">
                        <Table2 columns={this.columns} data = {this.state.datas} isEdit keyField='id' rowDelete={(id)=>this.rowDelete(id)} rowEdit={(id)=>this.rowEdit(id)}/>
                        <Page className="page" showSizeChanger pageSize={page.get('pageSize')} current={page.get('current')} total={page.get('total')} onChange={this.onChange} />
                    </div>
                </div>
                
                <Overlayer />
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
            overlayerShow:overlayerShow,
            overlayerHide:overlayerHide,
        }, dispatch)
    }
}

export default connect(mapStateToprops, mapDispatchToProps)(PermissionManage) 