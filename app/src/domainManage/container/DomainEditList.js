/**
 * Created by a on 2017/4/19.
 */
import React, {Component} from 'react';
import {findDOMNode} from 'react-dom'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Content from '../../components/Content'
import SideBarInfo from '../../components/SideBarInfo'
import Table from '../../components/Table';
import SearchText from '../../components/SearchText'
import Page from '../../components/Page'

import DomainPopup from '../component/DomainPopup'
import ConfirmPopup from '../../components/ConfirmPopup'
import {overlayerShow, overlayerHide} from '../../common/actions/overlayer'
import {addNotify} from '../../common/actions/notifyPopup'

import {getDomainList, getDomainCountByName, getDomainListByName, addDomain, updateDomainById, deleteDomainById} from '../../api/domain'

import Immutable from 'immutable';
import {getIndexByKey} from '../../util/index'

export class DomainEditList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
            selectDomain: {
                id:"domain",
                latlng:{lng: null, lat: null},
                position: [/*{
                    "device_id": 1,
                    "device_type": 'DEVICE',
                    lng: 121.49971691534425,
                    lat: 31.239658843127756
                }*/],
                parentId:null,
                data: []
            },

            page: Immutable.fromJS({
                pageSize: 10,
                current: 1,
                total: 0
            }),

            search: Immutable.fromJS({placeholder: '输入域名称', value: ''}),
            data: Immutable.fromJS([/*{id:1,name: '上海市', parentId: null, parentName:'无'},
                {id:2, name: '闵行区', parentId:1, parentName: '上海市'},
                {id:3, name: '徐汇区', parentId:1, parentName: '上海市'}*/]),
            sidebarInfoStyle:{height:"100%"}
        }

        this.columns = [{id: 1, field: "name", title: "域名称"}, {id:2, field: "parentName", title: "上级域"}]
        this.domainList = [];

        this.initTreeData = this.initTreeData.bind(this);
        this.collpseHandler = this.collpseHandler.bind(this);
        this.searchChange = this.searchChange.bind(this);
        this.tableClick = this.tableClick.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.initSelectDomain = this.initSelectDomain.bind(this);
        this.updateSelectDomain = this.updateSelectDomain.bind(this);

        this.pageChange = this.pageChange.bind(this);
        this.domainHandler = this.domainHandler.bind(this);

        this.setSize = this.setSize.bind(this);
        this.requestDomain = this.requestDomain.bind(this);
        this.requestSearch = this.requestSearch.bind(this);
        this.initPageSize = this.initPageSize.bind(this);
        this.initDomainList = this.initDomainList.bind(this);

        this.getDomainParentList = this.getDomainParentList.bind(this);
    }

    componentWillMount() {
        this.mounted = true;
        this.requestDomain();
        this.initTreeData();
        this.requestSearch();

        window.onresize = event=>{
            this.mounted && this.setSize();
        }
    }

    componentWillUnmount() {
        this.mounted = false;
        window.onresize = event=>{
            this.setSize();
        }
    }

    setSize(){
        if(!this.mounted){
            return;
        }

        if(this.refs.domainEditList){
            let height = window.innerHeight-60;
            let faultHeight = findDOMNode(this.refs.domainEditList).offsetHeight+90;

            this.setState({sidebarInfoStyle:{height:height>faultHeight?"100%":faultHeight+"px"}});

        }

    }

    requestDomain(){
        getDomainList(data=>{if(this.mounted){this.domainList=data;this.domainList.unshift({id:null, name:"无"});}});
    }

    requestSearch(){
        const {search, page} = this.state
        let name = search.get('value');
        let cur = page.get('current');
        let size = page.get('pageSize');
        let offset = (cur-1)*size;
        getDomainCountByName(name, data=>{this.mounted && this.initPageSize(data)})
        getDomainListByName(name, offset, size, data=>{this.mounted && this.initDomainList(data)})
    }

    initPageSize(data){
        let page = this.state.page.set('total', data.count);
        this.setState({page:page});
    }

    initDomainList(data){
        let list = data.map(domain=>{
            return Object.assign({}, domain, {parentName:domain.parent?domain.parent.name:"无"})
        })


        this.setState({data:Immutable.fromJS(list)},()=>{this.setSize();});

        if(data.length){
            this.updateSelectDomain(data[0])
        }else{
            this.initSelectDomain();
        }
    }

    initTreeData() {

    }


    getDomainParentList(){
        const {selectDomain} = this.state;
        let domainList = this.domainList.slice(0);
        let domainId = selectDomain.data.length && selectDomain.data[0].id;
        if(domainId){
            let index = getIndexByKey(domainList, 'id', domainId);
            if(index>-1){
                domainList.splice(index, 1);
            }
        }

        return domainList;
    }

    domainHandler(id){
        const {listMode, selectDomain} = this.state
        const {actions} = this.props;
        switch(id){
            case 'add':
                actions.overlayerShow(<DomainPopup title={"添加域"} data={{domainId:"", domainName:"",
                lat:"", lng:"", prevDomain:''}}
                                                   domainList={{titleKey:'name', valueKey:'name', options:this.domainList}}
                                                   onConfirm={(data)=>{
                                                        let domain = {};
                                                        domain.name = data.domainName;
                                                        domain.geoType = 0;
                                                        domain.geoPoint = {lat:data.lat, lng:data.lng};
                                                        domain.parentId = data.prevDomain;

                                                        addDomain(domain, ()=>{
                                                            actions.addNotify(1, "添加域成功");
                                                            // actions.overlayerHide();
                                                            this.requestDomain();
                                                            this.requestSearch();
                                                        });
                                                   }} onCancel={()=>{actions.overlayerHide()}}/>);
                break;
            case 'update':
                let lat="", lng="",updateId="",name="",parentId="";

                if(selectDomain.position && selectDomain.position.length){
                    let latlng = selectDomain.position[0];
                    lat = latlng.lat?latlng.lat:"";
                    lng = latlng.lng?latlng.lng:"";
                }

                if(selectDomain.data && selectDomain.data.length){
                    let data = selectDomain.data[0];
                    updateId = data.id;
                    name = data.name;
                }

                actions.overlayerShow(<DomainPopup title={"修改域属性"} data={{domainId:updateId, domainName:name,
                lat:lat, lng:lng, prevDomain:selectDomain.parentId?selectDomain.parentId:''}}
                                                              domainList={{titleKey:'name', valueKey:'name', options:this.getDomainParentList()}}
                                                              onConfirm={(data)=>{
                                                                    let domain = {};
                                                                    domain.id = data.domainId;
                                                                    domain.name = data.domainName;
                                                                    domain.geoType = 0;
                                                                    domain.geoPoint = {lat:data.lat, lng:data.lng};
                                                                    domain.parentId = data.prevDomain;
                                                                    updateDomainById(domain, ()=>{
                                                                        actions.overlayerHide();
                                                                        this.requestDomain();
                                                                        this.requestSearch();
                                                                    });
                                                              }} onCancel={()=>{actions.overlayerHide()}}/>);
                break;
            case 'delete':
                let curId="";
                if(selectDomain.data && selectDomain.data.length){
                    let data = selectDomain.data[0];
                    curId = data.id;
                }
                actions.overlayerShow(<ConfirmPopup iconClass="icon_popup_delete" tips={"是否删除选中域？"}
                                                 cancel={()=>{actions.overlayerHide()}} confirm={()=>{deleteDomainById(curId,
                                                 ()=>{
                                                    actions.overlayerHide();
                                                    this.requestDomain();
                                                    this.requestSearch();
                                                })}}/>);
                break;
        }
    }

    pageChange(current, pageSize) {
        let page = this.state.page.set('current', current);
        this.setState({page: page}, ()=>{
            this.requestSearch();
        });
    }

    tableClick(row){
        this.updateSelectDomain(row.toJS());

    }

    initSelectDomain(){
        let selectDomain = this.state.selectDomain;
        this.setState({selectDomain:Object.assign({}, selectDomain, {latlng:{lng:null, lat:null}},{position:[]}, {parentId:null}, {data:[]})})
    }

    updateSelectDomain(domain){
        let selectDomain = this.state.selectDomain;
        selectDomain.latlng = domain.geoPoint;
        selectDomain.position.splice(0)
        selectDomain.position.push(Object.assign({}, {"device_id":domain.id, "device_type":"DEVICE"}, domain.geoPoint))
        selectDomain.parentId = domain.parentId;
        selectDomain.data.splice(0);
        selectDomain.data.push({id:domain.id, name:domain.name});
        this.setState({selectDomain:selectDomain})
    }

    searchSubmit() {
        let page = this.state.page.set('current', 1);
        this.setState({page:page},()=>{
            this.requestSearch();
        });    
    }

    searchChange(value){
        this.setState({search:this.state.search.update('value', v=>value)});
    }

    collpseHandler() {
        this.setState({collapse: !this.state.collapse})
    }

    render() {
        const {collapse, selectDomain, page, search, data, sidebarInfoStyle} = this.state
        let disabled = (data.size==0?true:false);
        return (
            <Content className={'offset-right list-mode '+(collapse?'collapsed':'')}>
                <div className="heading">
                    <SearchText placeholder={search.get('placeholder')} value={search.get('value')}
                                onChange={this.searchChange} submit={this.searchSubmit}/>
                    <button className="btn btn-primary add-domain" onClick={()=>this.domainHandler('add')}>添加</button>
                </div>
                <div ref="domainEditList" className="list-mode">
                    <div className="table-container">
                        <Table columns={this.columns} data={data} activeId={selectDomain.data.length?selectDomain.data[0].id:""}
                               rowClick={this.tableClick}/>
                        <Page className={"page "+(page.get('total')==0?"hidden":"")} showSizeChanger pageSize={page.get('pageSize')}
                              current={page.get('current')} total={page.get('total')} onChange={this.pageChange}/>
                    </div>
                </div>
                <SideBarInfo mapDevice={selectDomain} collpseHandler={this.collpseHandler} style={sidebarInfoStyle}>
                    <div className="panel panel-default device-statics-info">
                        <div className="panel-heading">
                            <svg><use xlinkHref={"#icon_domain_property"} transform="scale(0.08,0.08)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg>域属性
                        </div>
                        <div className="panel-body domain-property">
                            <span className="domain-name">{selectDomain.data.length?selectDomain.data[0].name:""}</span>
                            <button className="btn btn-primary pull-right" onClick={()=>this.domainHandler('update')} disabled = {disabled}>编辑</button>
                            <button className="btn btn-danger pull-right" onClick={()=>this.domainHandler('delete')} disabled = {disabled}>删除</button>
                        </div>
                    </div>
                </SideBarInfo>
            </Content>
        )
    }
}


function mapStateToProps(state) {
    return {
        sidebarNode: state.domainManage.get('sidebarNode')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            overlayerShow: overlayerShow,
            overlayerHide: overlayerHide,
            addNotify: addNotify
        }, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DomainEditList);