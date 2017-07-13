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
import {TreeData} from '../../data/models'

import {onChange} from '../action/index';

import Immutable from 'immutable';
class AssetStatistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: Immutable.fromJS([
                {domain:"闵行区", deviceName:"灯集中控制器", soft_v:"1.0", sys_v:"1.0", core_v:"1.0", har_v:"1.0",
                    vendor_info:"上海三思", con_type:485},
                {domain:"闵行区", deviceName:"灯集中控制器", soft_v:"1.0", sys_v:"1.0", core_v:"1.0", har_v:"1.0",
                    vendor_info:"上海三思", con_type:485}
            ]),
            domain:Immutable.fromJS({list:[{id:1, value:'域'},{id:2, value:'域2'}], value:'域'}),
            device:Immutable.fromJS({list:[{id:1, value:'灯集中控制器'},{id:2, value:'集中控制'}], value:'灯集中控制器'}),
            search:Immutable.fromJS({placeholder:'输入素材名称', value:''}),
            collapse:false,
            page: Immutable.fromJS({
                pageSize:10,
                current: 1,
                total: 21
            }),
            deviceInfo:{
                total: 150,
                normal: 98
            },
            selectDevice:{
                position:{
                    "device_id":1,
                    "device_type":'DEVICE',
                    x:121.49971691534425,
                    y:31.239658843127756
                },
                data:{
                    id:1,
                    name:'example'
                }
            }
        }

        this.columns = [{field:"domain", title:"域"}, {field:"deviceName", title:"设备名称"},
            {field:"soft_v", title:"软件版本"}, {field:"sys_v", title:"系统版本"},
            {field:"core_v", title:"内核版本"}, {field:"har_v", title:"硬件版本"},
            {field:"vendor_info", title:"厂商信息"}, {field:"con_type", title:"控制器类型"}]

        this.onToggle = this.onToggle.bind(this);
        this.collpseHandler = this.collpseHandler.bind(this);
        this.tableClick = this.tableClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.domainChange = this.domainChange.bind(this);
        this.deviceChange = this.deviceChange.bind(this);
        this.searchChange = this.searchChange.bind(this);
    }

    componentWillMount(){
        const query = this.props.location.query;
    }

    onToggle(node){
        // console.log(node);
    }

    domainChange(selectIndex){
        // this.props.actions.onChange('domain', selectIndex);
        this.setState({domain:this.state.domain.update('value', v=>{
            return this.state.domain.getIn(['list', selectIndex, 'value']);
        })})
    }

    deviceChange(selectIndex){
        // this.props.actions.onChange('device', selectIndex);
        this.setState({device:this.state.device.update('value', v=>{
            return this.state.device.getIn(['list', selectIndex, 'value']);
        })})
    }

    searchChange(value){
        // this.props.actions.onChange('search', value);
        this.setState({search:this.state.search.update('value', v=>value)});
    }

    onChange(current, pageSize) {
        let page = this.state.page.set('current', current);
        this.setState({page: page});
    }

    tableClick(data){
        console.log(data);
    }

    collpseHandler(){
        this.setState({collapse: !this.state.collapse})
    }

    render() {
        const { data, domain, device ,search, collapse, page, deviceInfo, selectDevice } = this.state;

        return (
            <div className={"container-fluid asset-statistics "+(collapse?'collapsed':'')}>
                <HeadBar moduleName="资产统计"/>
                <SideBar TreeData={TreeData} onToggle={(node)=>this.onToggle(node)}/>
                <Content>
                    <div className="heading">
                        <Select className="domain" data={domain}
                                onChange={(selectIndex)=>this.domainChange(selectIndex)}/>
                        <Select className="device" data={device}
                                onChange={(selectIndex)=>this.deviceChange(selectIndex)}/>
                        <SearchText className="search" placeholder={search.get('placeholder')} value={search.get('value')}
                            onChange={value=>this.searchChange(value)}/>
                    </div>
                    <div className="table-container">
                        <Table columns={this.columns} data={data} rowClick={(row)=>this.tableClick(row)}/>
                        <Page className="pull-center" showSizeChanger pageSize={page.get('pageSize')}
                              current={page.get('current')} total={page.get('total')} onChange={this.onChange} />
                    </div>

                    <SideBarInfo deviceInfo={deviceInfo} mapDevice={selectDevice} collpseHandler={this.collpseHandler}/>
                </Content>

            </div>
        )
    }
}


function mapStateToProps(state) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            // onChange: onChange
        }, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AssetStatistics);