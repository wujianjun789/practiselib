/**
 * Created by a on 2017/4/19.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import '../../../public/styles/assetStatistics.less'

import Content from '../../components/Content'

import Select from '../../components/Select';
import SearchText from '../../components/SearchText'
import Table from '../../components/Table'
import Page from '../../components/Page'
import SideBarInfo from '../../components/SideBarInfo'

import Pie from '../../components/SensorParamsPie'

import {getModelData, getModelList} from '../../data/assetModels'

import {onChange} from '../action/index';
import {getSearchAssets, getDomainList, getAssetsCount} from '../../api/assetStatistics/index'
import {getDeviceTypeByModel} from '../../util/index'

import Immutable from 'immutable';
export class AssetStatistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: Immutable.fromJS([
                {domain:"闵行区", deviceName:"灯集中控制器", soft_v:"1.0", sys_v:"1.0", core_v:"1.0", har_v:"1.0",
                    vendor_info:"上海三思", con_type:485, latlng:{lng:121.49971691534425, lat:31.239658843127756}},
                {domain:"闵行区", deviceName:"灯集中控制器", soft_v:"1.0", sys_v:"1.0", core_v:"1.0", har_v:"1.0",
                    vendor_info:"上海三思", con_type:485, latlng:{lng:121.49971691534425, lat:31.239658843127756}}
            ]),
            domain:Immutable.fromJS({list:[{id:1, value:'域'},{id:2, value:'域2'}], index:0, value:'域'}),
            device:Immutable.fromJS({list:[{id:1, value:'灯集中控制器'},{id:2, value:'集中控制'}], index:0, value:'灯集中控制器'}),
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
            },
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
        this.searchSubmit = this.searchSubmit.bind(this);
        this.initTreeData = this.initTreeData.bind(this);
        this.initDomain = this.initDomain.bind(this);
        this.searchResult = this.searchResult.bind(this);
        this.deviceTotal = this.deviceTotal.bind(this);
        this.requestSearch = this.requestSearch.bind(this);
    }

    componentWillMount(){
        this.mounted = false;
        // const query = this.props.location.query;
        getModelData(()=>{!this.mounted && this.initTreeData()});
        getDomainList(data=>{!this.mounted && this.initDomain(data)});

        getAssetsCount(data=>{!this.mounted && this.deviceTotal(data)})
    }

    componentWillUnmount(){
        this.mounted = true;
    }

    requestSearch(){
        const {domain, device, search, page} = this.state;
        let cur = page.get('current');
        let size = page.get('pageSize');
        let offset = (cur-1)*size;

        let model = device.getIn(['list', device.get('index')]);
        getSearchAssets(domain.get('value'), model && model.get('id'), search.get('value'), offset, size, this.searchResult);
    }

    initTreeData(){
        let modelList = getModelList();
        let list = [];
        modelList.map(model=>{
            list.push({id:model, value:model.name})
        })

        this.setState({device:Immutable.fromJS({list:list, index:0, value:list.length>0?list[0].value:''})})
        this.requestSearch();
    }

    initDomain(data){
        if(data){
            this.setState({domain:Immutable.fromJS({list:data}), value:data.length>0?data[0]:''})
        }

        this.requestSearch();
    }

    searchResult(data){
        let list = [];
        data.map(item=>{
            list.push(Object.assign({id:item.id, extendType:item.extendType, deviceName:item.name, latlng:item.geoPoint}, item.extend))
        })
        this.setState({data:Immutable.fromJS(list)})

        if(this.state.data && this.state.data.size>0){
            let data = this.state.data.get(0);
            this.tableClick(data);
        }

    }

    deviceTotal(data){
        this.setState({deviceInfo:{total:data.count, normal:data.count==0 ? 0:data.count-1}});
    }

    searchSubmit(){
        this.requestSearch();
    }

    onToggle(node){
        // console.log(node);
    }

    domainChange(selectIndex){
        // this.props.actions.onChange('domain', selectIndex);
        this.setState({domain:this.state.domain.update('index', v=>selectIndex)})
        this.setState({domain:this.state.domain.update('value', v=>{
            return this.state.domain.getIn(['list', selectIndex, 'value']);
        })})
    }

    deviceChange(selectIndex){
        // this.props.actions.onChange('device', selectIndex);
        this.setState({device:this.state.device.update('index', v=>selectIndex)});
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
        this.setState({page: page}, ()=>{
            this.requestSearch();
        });
    }

    tableClick(data){
        this.setState({selectDevice:{
            position:{"device_id":data.get('id'), "device_type":getDeviceTypeByModel(data.get('extendType')), x:data.getIn(["latlng", "lng"]), y:data.getIn(["latlng", "lat"])},
            data:{id:data.get('id'), name:data.get('deviceName')}
        }})
    }

    collpseHandler(){
        this.setState({collapse: !this.state.collapse})
    }

    render() {
        const { data, domain, device ,search, collapse, page, deviceInfo, selectDevice } = this.state;
        const {total=0, normal=0} = deviceInfo;
        let width=145,height=145;
        return (
                <Content className={'offset-right '+(collapse?'collapsed':'')}>
                    <div className="heading">
                        <Select className="domain" data={domain}
                                onChange={(selectIndex)=>this.domainChange(selectIndex)}/>
                        <Select className="device" data={device}
                                onChange={(selectIndex)=>this.deviceChange(selectIndex)}/>
                        <SearchText className="search" placeholder={search.get('placeholder')} value={search.get('value')}
                            onChange={value=>this.searchChange(value)} submit={()=>this.searchSubmit()}/>
                    </div>
                    <div className="table-container">
                        <Table columns={this.columns} data={data} rowClick={(row)=>this.tableClick(row)}/>
                        <Page className="page" showSizeChanger pageSize={page.get('pageSize')}
                              current={page.get('current')} total={page.get('total')} onChange={this.onChange} />
                    </div>

                    <SideBarInfo  mapDevice={selectDevice} collpseHandler={this.collpseHandler}>
                        <div className="panel panel-default device-statics-info">
                            <div className="panel-heading">
                                <span className="icon_statistics"></span>设备统计信息
                            </div>
                            <div className="panel-body view">
                                <div className="circle1">
                                    <Pie data={{type:"NOISE",val:total}} width={width} height={height} color="#E6BC00" className="noise" range={[0, total]}></Pie>
                                </div>
                                <div className="circle2">
                                    <Pie data={{type:"TEMPS", val:normal, unit:'%'}} width={width} height={height} color="#E6BC00" className="temps" range={[0, total]}></Pie>
                                </div>
                            </div>
                        </div>
                    </SideBarInfo>
                </Content>
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