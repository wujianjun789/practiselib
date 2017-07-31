import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Overlayer from '../../common/containers/Overlayer'
import {overlayerShow} from '../../common/actions/overlayer';
import UserPopup from './UserPopup'
import HeadBar from '../../components/HeadBar'
import Page from '../../components/Page'
import SearchText from '../../components/SearchText'
import '../../../public/styles/permissionManage.less';
import Immutable from 'immutable';
import Table2 from '../../components/Table2'

class PermissionManage extends Component{
    constructor(props){
        super(props);
        this.state = {
            search:Immutable.fromJS({placeholder:'输入用户名称', value:''}),
            page: Immutable.fromJS({
                pageSize:10,
                current: 1,
                total: 21
            }),
        }
        this.columns = [{field:"grade", title:" "}, {field:"userName", title:"用户名称"},
            {field:"loginTime", title:"最后登录时间"}]

        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.searchChange = this.searchChange.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.requestData = this.requestData.bind(this);
    }

    onClick(){
        const popupinfo = this.props.permissionManage.popupinfo;
        this.props.action.overlayerShow(<UserPopup className='user-add-popup' data={popupinfo}/>);
    }

    searchChange(value){
        this.setState({search:this.state.search.update('value', v=>value)});
    }

    searchSubmit(){
        this.requestData();
    }

    onChange(current, pageSize) {
        let page = this.state.page.set('current', current);
        this.setState({page: page}, ()=>{
            this.requestData();
        });
    }

    requestData(){
        const {search, page} = this.state;
        let cur = page.get('current');
        let size = page.get('pageSize');
        let offset = (cur-1)*size;
        // this.props.action.requestData();
    }

    render() {
        const {permissionManage} = this.props;
        let {datas} = permissionManage;
        const {search, page} = this.state;
        datas = datas.map((item)=>{
            item.grade = <div className='grade-icon'><span className={`icon ${item.grade}`}></span></div>;
            return item;
        })
        return(
            <div className='container permission-manage'>
                <HeadBar moduleName='权限管理' router={this.props.router}/>
                <div className = 'content '>
                    <div className = 'heading'>
                        <SearchText className="search" placeholder={search.get('placeholder')} value={search.get('value')} onChange={(value)=>this.searchChange(value)} submit={()=>this.searchSubmit()}/>                        
                        <button className='btn btn-primary' onClick={this.onClick}>添加</button>
                    </div>
                    <div className="table-container">
                        <Table2 columns={this.columns} data = {datas} isEdit/>
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
        }, dispatch)
    }
}

export default connect(mapStateToprops, mapDispatchToProps)(PermissionManage) 