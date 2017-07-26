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
import Immutable from 'immutable';

export class DomainEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listMode: true,
            collapse: false,
            selectDevice: {
                position: {
                    "device_id": 1,
                    "device_type": 'DEVICE',
                    x: 121.49971691534425,
                    y: 31.239658843127756
                },
                data: {
                    id: 1,
                    name: 'example'
                }
            },

            page: Immutable.fromJS({
                pageSize: 10,
                current: 1,
                total: 21
            }),

            search: Immutable.fromJS({placeholder: '输入素材名称', value: ''}),
            data: Immutable.fromJS([{name: '上海市', parentDomain: '无'},
                {name: '闵行区', parentDomain: '上海市'},
                {name: '徐汇区', parentDomain: '上海市'}])
        }

        this.columns = [{id: 1, field: "name", title: "域名称"}, {field: "parentDomain", title: "上级域"}]

        this.onToggle = this.onToggle.bind(this);
        this.initTreeData = this.initTreeData.bind(this);
        this.collpseHandler = this.collpseHandler.bind(this);
    }

    componentWillMount() {
        this.initTreeData();
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

    initTreeData() {

    }

    onToggle(node) {

    }

    collpseHandler() {
        this.setState({collapse: !this.state.collapse})
    }

    render() {
        const {listMode, collapse, selectDevice, page, search, data} = this.state
        return (
            <Content className={'offset-right '+(collapse?'collapsed':'')}>
                {
                    listMode ?
                        <div className="list-mode">
                            <div className="heading">
                                <button className="btn btn-default add-domain">添加</button>
                                <SearchText placeholder={search.get('placeholder')} value={search.get('value')}/>
                            </div>
                            <div className="table-container">
                                <Table columns={this.columns} data={data}/>
                                <Page className="page" showSizeChanger pageSize={page.get('pageSize')}
                                      current={page.get('current')} total={page.get('total')}/>
                            </div>
                        </div> :
                        <div className="topology-mode">topology</div>
                }
                <SideBarInfo mapDevice={selectDevice} collpseHandler={this.collpseHandler}>
                    <div className="panel panel-default device-statics-info">
                        <div className="panel-heading">
                            <span className="icon_statistics"></span>域属性
                        </div>
                        <div className="panel-body domain-property">
                            <span className="domain-name">闵行区</span>
                            <button className="btn btn-default pull-right">删除</button>
                            <button className="btn btn-default pull-right">修改</button>
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