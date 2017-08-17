/**
 * Created by a on 2017/8/14.
 */
import React,{Component} from 'react';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import '../../../public/styles/systemOperation-strategy.less';
import Content from '../../components/Content'
import SearchText from '../../components/SearchText'
import Table from '../../components/Table'
import Page from '../../components/Page'
import {overlayerShow, overlayerHide} from '../../common/actions/overlayer'
import Immutable from 'immutable';
import ConfirmPopup from '../../components/ConfirmPopup'

export class Latlngtrategy extends Component{
    constructor(props){
        super(props);
        this.state = {
            search: Immutable.fromJS({
                placeholder: '输入策略名称',
                value: ''
            }),
            page: Immutable.fromJS({
                pageSize: 10,
                current: 1,
                total: 14
            }),
            data:Immutable.fromJS([
                {id:1, name:"经纬度使用策略", lng:"000.000.000.000",lat:"000.000.000.000"},
                {id:2, name:"经纬度使用策略", lng:"000.000.000.000",lat:"000.000.000.000"},
            ]),
            popupInfo:{
                
            }
        }

        this.columns =  [
            {id: 0, field:"name", title:"策略名称"},
            {id: 1, field: "lng", title: "经度"},
            {id: 2, field: "lat", title: "纬度"}
        ];
        this.searchChange = this.searchChange.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.requestData = this.requestData.bind(this);
        this.dataHandle = this.dataHandle.bind(this);
        this.onClick = this.onClick.bind(this);
        this.rowEdit = this.rowEdit.bind(this);
        this.rowDelete = this.rowDelete.bind(this);
        this.pageChange = this.pageChange.bind(this);

    }

    searchChange(value){
        this.setState({search:this.state.search.update('value', v=>value)});
    }

    searchSubmit(){
        let search = this.state.search.get('value');
        this.requestData(search);
    }

    requestData(username){
        const {search, page} = this.state;
        let cur = page.get('current');
        let size = page.get('pageSize');
        let offset = (cur-1)*size;
        // requestData(offset,size,(response)=>{this.mounted && this.dataHandle(response)},username);
    }

    dataHandle(datas){
        
    }

    onClick(){
        // this.props.action.overlayerShow();
    }

    rowEdit(id){

    }

    rowDelete(id){
        this.props.action.overlayerShow(<ConfirmPopup tips="是否删除选中用户？" iconClass="icon_popup_delete" cancel={()=>{this.props.action.overlayerHide()}} confirm={()=>{
            this.props.action.overlayerHide()
            let page = this.state.page.set('current', 1);
            this.setState({page:page},deleteUser(id,this.requestData))
        }}/>);
    }

    pageChange(){
        let page = this.state.page.set('current', current);
        this.setState({page: page}, ()=>{
            this.requestData();
        });
    }

    render(){
        const {search, page, data} = this.state;
        
        return <Content className="latlng-strategy">
            <div className="heading">
                <SearchText placeholder={search.get('placeholder')} value={search.get('value')} onChange={this.searchChange} submit={this.searchSubmit}/>
                <button className="btn btn-primary" onClick={this.onClick}>添加</button>
            </div>
            <div className="table-container">
                <Table isEdit={true} columns={this.columns} data={data} rowDelete={this.rowDelete} rowEdit={this.rowEdit}/>
                <Page className={"page "+(page.get('total')==0?"hidden":'')} showSizeChanger pageSize={page.get('pageSize')}
                        current={page.get('current')} total={page.get('total')}  onChange={this.pageChange}/>
            </div>
        </Content>
    }
}

const mapStateToprops = (state, ownProps) => {
    return{
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

export default connect(mapStateToprops, mapDispatchToProps)(Latlngtrategy) 