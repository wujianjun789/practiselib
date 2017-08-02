/**
 * Created by a on 2017/4/19.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import '../../../public/styles/domainmanage.less';
import Content from '../../components/Content'
import SideBarInfo from '../../components/SideBarInfo'
import Table from '../../components/Table';
import SearchText from '../../components/SearchText'
import Page from '../../components/Page'

import DomainPopup from '../../components/DomainPopup'
import ConfirmPopup from '../../components/ConfirmPopup'
import {overlayerShow, overlayerHide} from '../../common/actions/overlayer'

import Topology from './Topology';

import {getDomainList, getDomainCountByName, getDomainListByName, deleteDomainById} from '../../api/domain'

import Immutable from 'immutable';

export class DomainEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listMode: true,
            collapse: false,
            selectDomain: {
                id:"domain",
                latlng:{lng: 121.49971691534425, lat: 31.239658843127756},
                position: [{
                    "device_id": 1,
                    "device_type": 'DEVICE',
                    lng: 121.49971691534425,
                    lat: 31.239658843127756
                }],
                parentId:null,
                data: [{
                    id: 1,
                    name: '上海市'
                }]
            },

            page: Immutable.fromJS({
                pageSize: 10,
                current: 1,
                total: 21
            }),

            search: Immutable.fromJS({placeholder: '  输入域名称', value: ''}),
            data: Immutable.fromJS([{id:1,name: '上海市', parentId: null, parentName:'无'},
                {id:2, name: '闵行区', parentId:1, parentName: '上海市'},
                {id:3, name: '徐汇区', parentId:1, parentName: '上海市'}])
        }

        this.columns = [{id: 1, field: "name", title: "域名称"}, {id:2, field: "parentName", title: "上级域"}]

        this.onToggle = this.onToggle.bind(this);
        this.initTreeData = this.initTreeData.bind(this);
        this.collpseHandler = this.collpseHandler.bind(this);
        this.searchChange = this.searchChange.bind(this);
        this.tableClick = this.tableClick.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.topologyItemClick = this.topologyItemClick.bind(this);
        this.updateSelectDomain = this.updateSelectDomain.bind(this);

        this.pageChange = this.pageChange.bind(this);
        this.domainHandler = this.domainHandler.bind(this);

        this.requestSearch = this.requestSearch.bind(this);
        this.initPageSize = this.initPageSize.bind(this);
        this.initDomainList = this.initDomainList.bind(this);
    }

    componentWillMount() {
        this.mounted = true;
        this.initTreeData();
        // this.requestSearch();
    }

    componentWillReceiveProps(nextProps) {
        const {sidebarNode} = nextProps;
        if (sidebarNode) {
            this.onToggle(sidebarNode);
        }
    }

    componentWillUnmount() {
        this.mounted = false;
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
        this.setState({data:Immutable.fromJS(data)});
        if(data.length){
            let item1 = data[0]
            let selectDomain = this.state.selectDomain;
            selectDomain.data.id = item1.id;
            selectDomain.data.name = item1.name;
            this.setState({selectDomain:selectDomain});
        }
    }

    initTreeData() {

    }

    domainHandler(id){
        const {selectDomain} = this.state
        const {actions} = this.props;
        switch(id){
            case 'add':
            case 'update':
                actions.overlayerShow(<DomainPopup title={id=='add'?"添加域":"修改域属性"} data={{domainId:selectDomain.data[0].id, domainName:selectDomain.data[0].name,
                lat:selectDomain.position[0].lat, lng:selectDomain.position[0].lng, prevDomain:''}}
                                                              domainList={{titleKey:'name', valueKey:'name', options:[]}}
                                                              onConfirm={()=>{}} onCancel={()=>{actions.overlayerHide()}}/>);
                break;
            case 'delete':
                actions.overlayerShow(<ConfirmPopup iconClass="icon_popup_delete" tips={"是否删除选中域？"}
                                                 cancel={()=>{actions.overlayerHide()}} confirm={()=>{deleteDomainById(selectDomain.data.id,
                                                 (response)=>{ })}}/>);
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

    topologyItemClick(data){
        this.updateSelectDomain(data);
    }

    updateSelectDomain(domain){
        const {selectDomain} = this.state;
        selectDomain.latlng = domain.geoPoint;
        selectDomain.position.splice(0)
        selectDomain.position.push(Object.assign({"device_id":1, "device_type":"DEVICE"}, domain.geoPoint))
        selectDomain.parentId = domain.parentId;
        selectDomain.data.splice(0)
        selectDomain.data.push({id:domain.id, name:domain.name});
        console.log(selectDomain);
        this.setState({selectDomain:selectDomain})
    }

    searchSubmit(){
        console.log('submit');

        this.requestSearch();
    }

    searchChange(value){
        this.setState({search:this.state.search.update('value', v=>value)});
    }

    onToggle(node) {
        let mode = undefined;

        if(node.id == "list-mode"){
            mode = true;
        }else if(node.id == 'topology-mode'){
            mode = false;
        }

        mode != undefined && this.setState({listMode:mode});
    }

    collpseHandler() {
        this.setState({collapse: !this.state.collapse})
    }

    render() {
        const {listMode, collapse, selectDomain, page, search, data} = this.state
        return (
            <Content className={'offset-right '+(collapse?'collapsed':'')}>
                <div className="heading">
                    <SearchText placeholder={search.get('placeholder')} value={search.get('value')}
                                onChange={this.searchChange} submit={this.searchSubmit}/>
                    <button className="btn btn-default add-domain" onClick={()=>this.domainHandler('add')}>添加</button>
                </div>
                {
                    listMode ?
                        <div className="list-mode">
                            <div className="table-container">
                                <Table columns={this.columns} data={data} activeId={selectDomain.data.id}
                                       rowClick={this.tableClick}/>
                                <Page className="page" showSizeChanger pageSize={page.get('pageSize')}
                                      current={page.get('current')} total={page.get('total')} onChange={this.pageChange}/>
                            </div>
                        </div> :
                        <Topology itemClick={this.topologyItemClick}/>
                }
                <SideBarInfo mapDevice={selectDomain} collpseHandler={this.collpseHandler}>
                    <div className="panel panel-default device-statics-info">
                        <div className="panel-heading">
                            <span className="icon_domain_property"></span>域属性
                        </div>
                        <div className="panel-body domain-property">
                            <span className="domain-name">{selectDomain.data.name}</span>
                            <button className="btn btn-primary pull-right" onClick={()=>this.domainHandler('update')}>编辑</button>
                            <button className="btn btn-danger pull-right" onClick={()=>this.domainHandler('delete')}>删除</button>

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
            overlayerHide: overlayerHide
        }, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DomainEdit);