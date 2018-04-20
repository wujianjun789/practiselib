import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Overlayer from '../../common/containers/Overlayer'
import {overlayerShow,overlayerHide} from '../../common/actions/overlayer';
import UserPopup from './UserPopup'
import DomainPopup from './DomainPopup'
import HeadBar from '../../components/HeadBar'
import Page from '../../components/Page'
import SearchText from '../../components/SearchText'
import '../../../public/styles/permissionManage.less';
import Immutable from 'immutable';
import Table2 from '../../components/Table2';
import ConfirmPopup from '../../components/ConfirmPopup';
import {getObjectByKeyObj,getListByKeyObj} from '../../util/algorithm';
import {requestUserData,requestUserMount,deleteUser,addUser,editUser} from '../../api/permission';
import {getMomentDate,momentDateFormat} from '../../util/time'
import ModulePopup from './ModulePopup';
import {getModule} from '../../app/action'
import {FormattedMessage,injectIntl} from 'react-intl';
import {getModuleDefaultConfig} from '../../util/network';

export class PermissionManage extends Component{
    constructor(props){
        super(props);
        this.state = {
            datas:[],
            search:Immutable.fromJS({placeholder:'permission.input.username', value:''}),
            page: {
                pageSize:10,
                current: 1,
                total: 0
            },
            popupInfo:{
                username:'',
                lastName:'',
                firstName:'',
                modules:[]
            }
        }
        this.columns = [{field:"roleLabel", title:" "}, {field:"username", title:"permission.username"},
            {field:"lastLoginDate", title:"permission.lastLoginDate"}
        ];

        this.formatIntl = this.formatIntl.bind(this);

        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.searchChange = this.searchChange.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.requestData = this.requestData.bind(this);
        this.dataHandle = this.dataHandle.bind(this);
        this.confirmClick = this.confirmClick.bind(this);
        this.rowEdit = this.rowEdit.bind(this);
        this.rowDelete = this.rowDelete.bind(this);
        this.rowDomainEdit = this.rowDomainEdit.bind(this);
        this.rowModuleEdit = this.rowModuleEdit.bind(this);
    }

    componentWillMount(){        
        this.mounted = true;
        const {action} = this.props;
        action && action.getModule();
        this.requestData();
        getModuleDefaultConfig(response=>{
            this.moduleDefault = response;
        })
    }

    componentDidMount(){
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    formatIntl(formatId){
        const {intl} = this.props;
        return intl?intl.formatMessage({id:formatId}):null;
        // return formatId;
    }

    onClick(){
        this.props.action.overlayerShow(<UserPopup className='user-add-popup' title={<FormattedMessage id='permission.addUser'/>} intl={this.props.intl} onConfirm={this.confirmClick} overlayerHide={this.props.action.overlayerHide}/>);
    }

    searchChange(value){
        this.setState({search:this.state.search.update('value', v=>value)});
    }

    searchSubmit(){
        let search = this.state.search.get('value');
        this.requestData(search);
    }

    onChange(current, pageSize) {
        this.setState({page: Object.assign({}, this.state.page, {current: current})}, this.requestData);        
    }

    requestData(username){
        const {search, page} = this.state;
        if(username){
            page.current = 1;
            this.setState({page:page});
        }
        let cur = page.current;
        let size = page.pageSize;
        let offset = (cur-1)*size;
        requestUserData(offset,size,(response)=>{this.mounted && this.dataHandle(response)},search.get('value'));
        requestUserMount(data=>{this.mounted && this.initPageSize(data)},search.get('value'))
    }

    initPageSize(data){
        this.setState({page:Object.assign({},this.state.page,{total:data})});        
    }

    dataHandle(datas){
        let result = datas.map(item=>{
            if(item.role){
                let roleName = ''
                switch(item.role.name){
                    case 'admin':
                        roleName = {title:'permission.admin',cls:"sysManage"};
                        break;
                    case 'deviceAdmin':
                        roleName = {title:'permission.deviceAdmin',cls:"eqpManage"};
                        break;
                    case 'deviceOperator':
                        roleName = {title:'permission.deviceOperator',cls:"eqpOperate"};
                        break;
                    case 'guest':
                        roleName = {title:'permission.guest',cls:"guest"};
                        break;
                    default:
                        roleName = {title:'permission.guest',cls:"guest"};
                }
                item.roleLabel = <div className='role-icon'><span className={`icon btn-${roleName.cls}` }>{<FormattedMessage id={roleName.title}/>}</span></div>;
                item.lastLoginDate = item.lastLoginDate?momentDateFormat(getMomentDate(item.lastLoginDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ'),'YYYY-MM-DD HH:mm:ss'):'';
            }
            return item;
        })
        this.setState({datas:result})
    }

    rowEdit(id){
        let popupInfo = getObjectByKeyObj(this.state.datas,'id',id);
        this.setState({popupInfo:Object.assign(this.state.popupInfo,popupInfo)},()=>this.props.action.overlayerShow(<UserPopup className='user-edit-popup' intl={this.props.intl} title={<FormattedMessage id='permission.userData'/>} data={this.state.popupInfo} isEdit onConfirm={this.confirmClick} overlayerHide={this.props.action.overlayerHide}/>))
    }

    rowDelete(id){
        this.props.action.overlayerShow(<ConfirmPopup tips={this.formatIntl('delete.user')} iconClass="icon_popup_delete" cancel={()=>{this.props.action.overlayerHide()}} confirm={()=>{
            this.props.action.overlayerHide()
            let page = Object.assign(this.state.page,{current:1});
            this.setState({page:page},deleteUser(id,this.requestData))
        }}/>);
    }

    rowDomainEdit(id){
        this.props.action.overlayerShow(<DomainPopup className='user-domain-edit-popup' title={<FormattedMessage id='permission.domain'/>} id={id}/>)
    }

    rowModuleEdit(id){
        let row = getObjectByKeyObj(this.state.datas,'id',id);
        this.props.action.overlayerShow(<ModulePopup className='user-module-edit-popup' title={<FormattedMessage id='permission.module'/>} id={id} allModules={this.props.modules} modules={this.moduleDefault[row.role.name]} data = {row.modules} onConfirm={this.confirmClick} overlayerHide={this.props.action.overlayerHide}/>)
    }

    confirmClick(datas,isEdit){
        if(isEdit){
            editUser(datas,this.requestData);
        }
        else{
            this.setState({page:Object.assign({}, this.state.page, {current: 1})},addUser(datas,()=>this.requestData()))            
        }
    }

    render() {
        const {datas,search, page} = this.state;
        return(
            <div className='container permission-manage'>
                <HeadBar moduleName='app.permission.manage' router={this.props.router}/>
                <div className = 'content '>
                    <div className = 'heading'>
                        <SearchText className="search" placeholder={ this.formatIntl(search.get('placeholder'))} value={search.get('value')} onChange={(value)=>this.searchChange(value)} submit={()=>this.searchSubmit()}/>
                        <button className='btn btn-primary' onClick={this.onClick}><FormattedMessage id="button.add"/></button>
                    </div>
                    <div className="table-container">
                        <Table2 columns={this.columns} data = {this.state.datas} isEdit rowDelete={this.rowDelete} rowEdit={this.rowEdit} rowDomainEdit={this.rowDomainEdit} rowModuleEdit={this.rowModuleEdit}/>
                        <Page className={"page "+(page.total==0?"hidden":'')} showSizeChanger pageSize={page.pageSize}
                            current={page.current} total={page.total} onChange={this.onChange} />
                    </div>
                </div>
                <Overlayer />
            </div>
        )
    }
}

const mapStateToprops = (state, ownProps) => {
    return{
        userCenter:state.userCenter,
        modules:state.app.items
    }
}

const mapDispatchToProps = (dispatch, ownProps) =>{
    return {
        action: bindActionCreators({
            overlayerShow,
            overlayerHide,
            getModule            
        }, dispatch)
    }
}

export default connect(mapStateToprops, mapDispatchToProps)(injectIntl(PermissionManage))