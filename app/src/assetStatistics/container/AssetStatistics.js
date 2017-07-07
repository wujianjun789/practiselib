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

import Select from '../../components/Select';
import SearchText from '../../components/SearchText'
import Table from '../../components/Table'
import Page from '../../components/Page'
import SideBarInfo from '../../components/SideBarInfo'
import {TreeData} from '../../data/treeData'

import Immutable from 'immutable';
class AssetStatistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse:false
        }

        this.page = Immutable.fromJS({
            pageSize:10,
            current: 1,
            total: 21
        })

        this.columns = [{field:"domain", title:"域"}, {field:"deviceName", title:"设备名称"},
            {field:"soft_v", title:"软件版本"}, {field:"sys_v", title:"系统版本"},
            {field:"core_v", title:"内核版本"}, {field:"har_v", title:"硬件版本"},
            {field:"vendor_info", title:"厂商信息"}, {field:"con_type", title:"控制器类型"}]

        this.collpseHandler = this.collpseHandler.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange(current, pageSize) {
        this.page = this.page.set('current', current);
        this.setState(this.page);
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
                        <Select className="domain" data={{list:[{id:1, value:'域'},{id:2, value:'域2'}], value:'域'}}/>
                        <Select className="device" data={{list:[{id:1, value:'灯集中控制器'},{id:2, value:'集中控制'}], value:'域'}}/>
                        <SearchText className="search" placeholder="输入素材名称"/>
                    </div>
                    <div className="table-container">
                        <Table columns={this.columns} data={data}/>
                        <Page className="pull-center" showSizeChanger pageSize={this.page.get('pageSize')}
                              current={this.page.get('current')} total={this.page.get('total')} onChange={this.onChange} />
                    </div>

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