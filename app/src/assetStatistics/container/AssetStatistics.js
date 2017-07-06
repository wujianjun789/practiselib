/**
 * Created by a on 2017/4/19.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import '../../../public/styles/assetStatistics.less'

import HeadBar from '../../components/HeadBar'
import SideBar from '../../components/SideBar'
import Content from '../../components/Content'

import Table from '../../components/Table'
import Page from '../../components/Page'
import SideBarInfo from '../../components/SideBarInfo'
import {TreeData} from '../../data/treeData'

class AssetStatistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse:false
        }
        this.columns = [{field:"domain", title:"域"}, {field:"deviceName", title:"设备名称"},
            {field:"soft_v", title:"软件版本"}, {field:"sys_v", title:"系统版本"},
            {field:"core_v", title:"内核版本"}, {field:"har_v", title:"硬件版本"},
            {field:"vendor_info", title:"厂商信息"}, {field:"con_type", title:"控制器类型"}]

        this.collpseHandler = this.collpseHandler.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange(current, pageSize) {

    }

    componentWillMount(){
        const query = this.props.location.query;
    }

    collpseHandler(){
        this.setState({collapse: !this.state.collapse})
    }

    render() {
        const { data } = this.props
        const { collapse } = this.state;
        return (
            <div className={"container-fluid asset-statistics "+(collapse?'collapsed':'')}>
                <HeadBar moduleName="资产统计"/>
                <SideBar TreeData={TreeData}/>
                <Content>
                    <div className="heading">
                        <select className="domain">
                            <option>域</option>
                            <option>域2</option>
                        </select>
                        <select className="device">
                            <option>灯集中控制器</option>
                            <option>集中控制</option>
                        </select>
                        <input className="search" type="search" placeholder="输入素材名称"/>
                    </div>
                    <div className="table-container">
                        <Table columns={this.columns} data={data}/>
                    </div>
                    <Page className="pull-center" showSizeChanger defaultPageSize={20} defaultCurrent={1}
                          pageSize={10} current={1} onChange={this.onChange} total={21}/>
                    <SideBarInfo collpseHandler={this.collpseHandler}/>
                </Content>

            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        data: state.assetStatistics.get('data')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
        }, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AssetStatistics);