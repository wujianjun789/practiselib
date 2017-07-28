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

import {TreeData} from '../../data/domainModel'
import {getDomainListByName, deleteDomainById} from '../../api/domain'

import Immutable from 'immutable';

export class DomainEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listMode: true,
            collapse: false,
            selectDomain: {
                position: {
                    "device_id": 1,
                    "device_type": 'DEVICE',
                    x: 121.49971691534425,
                    y: 31.239658843127756
                },
                data: {
                    id: 1,
                    name: '上海市'
                }
            },

            page: Immutable.fromJS({
                pageSize: 10,
                current: 1,
                total: 21
            }),

            search: Immutable.fromJS({placeholder: '输入域名称', value: ''}),
            data: Immutable.fromJS([{id:1,name: '上海市', parentDomain: '无'},
                {id:2, name: '闵行区', parentDomain: '上海市'},
                {id:3, name: '徐汇区', parentDomain: '上海市'}])
        }

        this.columns = [{id: 1, field: "name", title: "域名称"}, {id:2, field: "parentDomain", title: "上级域"}]

        this.onToggle = this.onToggle.bind(this);
        this.initTreeData = this.initTreeData.bind(this);
        this.collpseHandler = this.collpseHandler.bind(this);
        this.searchChange = this.searchChange.bind(this);
        this.tableClick = this.tableClick.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.domainHandler = this.domainHandler.bind(this);

        this.requestSearch = this.requestSearch.bind(this);
        this.initDomainList = this.initDomainList.bind(this);
    }

    componentWillMount() {
        this.mounted = false;
        this.initTreeData();
        // this.requestSearch('');
    }

    componentWillReceiveProps(nextProps) {
        const {sidebarNode} = nextProps;
        if (sidebarNode) {
            this.onToggle(sidebarNode);
        }
    }

    componentWillUnmount() {
        this.mounted = true;
    }

    requestSearch(name){
        getDomainListByName(name, data=>{!this.mounted && this.initDomainList(data)})
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
        console.log(id);
        const {selectDomain} = this.state
        switch(id){
            case 'delete':
                deleteDomainById(selectDomain.data.id);
                break;
        }
    }

    pageChange(current, pageSize) {
        let page = this.state.page.set('current', current);
        this.setState({page: page}, ()=>{
        });
    }

    tableClick(row){
        const {selectDomain} = this.state;
        selectDomain.data.id = row.get('id');
        selectDomain.data.name = row.get('name');
        this.setState({selectDomain:selectDomain})
    }

    searchSubmit(){
        console.log('submit');
        const {search} = this.state
        this.requestSearch(search.get('value'));
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
                        <div className="topology-mode">topology</div>
                }
                <SideBarInfo mapDevice={selectDomain} collpseHandler={this.collpseHandler}>
                    <div className="panel panel-default device-statics-info">
                        <div className="panel-heading">
                            <span className="icon_statistics"></span>域属性
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
        actions: bindActionCreators({}, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DomainEdit);