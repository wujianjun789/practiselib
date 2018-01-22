/**
 * Created by a on 2017/8/23.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Content from '../../components/Content'

import Select from '../../components/Select';
import SearchText from '../../components/SearchText'
import Table from '../../components/Table'
import Page from '../../components/Page'
import SideBarInfo from '../../components/SideBarInfo'

import Pie from '../../components/SensorParamsPie'

import {getModelData, getModelList, getModelNameById} from '../../data/assetModels'

import {getSearchCount, getSearchAssets} from '../../api/asset'
import {getDomainList} from '../../api/domain'
import {getDeviceTypeByModel} from '../../util/index'
import {getObjectByKey} from '../../util/algorithm'

import {FormattedMessage,injectIntl} from 'react-intl';
import { intlFormat } from '../../util/index';

import Immutable from 'immutable';
export class Pole extends Component {
    constructor(props) {
        super(props);
        this.state = {
            model:"pole",
            data: Immutable.fromJS([
               /* {id:1,domain:"闵行区", deviceName:"灯集中控制器", soft_v:"1.0", sys_v:"1.0", core_v:"1.0", har_v:"1.0",
                    vendor_info:"上海三思", con_type:485, latlng:{lng:121.49971691534425, lat:31.239658843127756}},
                {id:2, domain:"闵行区", deviceName:"灯集中控制器", soft_v:"1.0", sys_v:"1.0", core_v:"1.0", har_v:"1.0",
                    vendor_info:"上海三思", con_type:485, latlng:{lng:121.49971691534425, lat:31.239658843127756}}*/
            ]),
            domain:Immutable.fromJS({list:[/*{id:1, value:'域'},{id:2, value:'域2'}*/], index:0, value:'域'}),
            // device:Immutable.fromJS({list:[{id:1, value:'灯集中控制器'},{id:2, value:'集中控制'}], index:0, value:'灯集中控制器'}),
            search:Immutable.fromJS({placeholder:'输入素材名称', value:''}),
            collapse:false,
            page: Immutable.fromJS({
                pageSize:10,
                current: 1,
                total: 0
            }),
            deviceInfo:{
                total: 0,
                normal: 0
            },
            selectDevice:{
                id:"assetStatistics",
                latlng:{/*lng:121.49971691534425, lat:31.239658843127756*/},
                position:[/*{
                    "device_id":1,
                    "device_type":'DEVICE',
                    lng:121.49971691534425,
                    lat:31.239658843127756
                }*/],
                data:[/*{
                    id:1,
                    name:'example'
                }*/]
            },
        }

        // this.columns = [{field:"domain", title:"域"}, {field:"name", title:"设备名称"},
        //  {field:"software", title:"软件版本"}, {field:"system", title:"系统版本"},
        //  {field:"core_v", title:"内核版本"}, {field:"hardware", title:"硬件版本"},
        //  {field:"vendor_info", title:"厂商信息"}, {field:"typeName", title:"控制器类型"}]

        this.columns = [{field:"domain", title:intlFormat({en:'domain',zh:'域'})}, {field:"name", title:intlFormat({en:'name',zh:'设备名称'})},
        {field:"software", title:intlFormat({en:'software',zh:'软件版本'})}, {field:"system", title:intlFormat({en:'system',zh:'系统版本'})},
        {field:"core_v", title:intlFormat({en:'core_v',zh:'内核版本'})}, {field:"hardware", title:intlFormat({en:'hardware',zh:'硬件版本'})},
        {field:"vendor_info", title:intlFormat({en:'vendor_info',zh:'厂商信息'})}, {field:"typeName", title:intlFormat({en:'typeName',zh:'控制器类型'})}]

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
        this.initPageTotal = this.initPageTotal.bind(this);
    }

    componentWillMount(){
        this.mounted = true;
        // const query = this.props.location.query;
        getModelData(()=>{this.mounted && this.initTreeData()});
        getDomainList(data=>{this.mounted && this.initDomain(data)});

        // getAssetsCount(data=>{this.mounted && this.deviceTotal(data)})
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    requestSearch(){
        const {model, domain, search, page} = this.state;
        let cur = page.get('current');
        let size = page.get('pageSize');
        let offset = (cur-1)*size;
        let domainId = domain.getIn(["list", domain.get("index"), "id"]);
        let modelId = model;
        let name = search.get('value')
        getSearchCount(domainId, modelId, name, (data)=>this.mounted && this.initPageTotal(data))
        getSearchAssets(domainId, modelId, name, offset, size, data=>this.mounted && this.searchResult(data));
    }

    initTreeData(){
        let modelList = getModelList();
        let list = modelList.map(model=>{
            return Object.assign({}, model, {value:model.name});
        })

        // this.setState({device:Immutable.fromJS({list:list, index:0, value:list.length>0?list[0].value:""})})
        this.requestSearch();
    }

    initDomain(data){
        if(data){
            let list = data.map(domain=>{
                return Object.assign({}, domain, {value:domain.name});
            })

            this.setState({domain:Immutable.fromJS({list:list, index:0, value:data.length>0?data[0]:""})})
        }

        this.requestSearch();
    }

    initPageTotal(data){
        let page = this.state.page.set('total', data.count);
        this.setState({page: page, deviceInfo:{total:data.count}});
    }

    searchResult(data){
        let list = data.map(item=>{
            let curDomain = getObjectByKey(this.state.domain.get("list"), 'id', item.domainId);
            return Object.assign({}, {domain:curDomain?curDomain.get("name"):""}, {typeName:getModelNameById(item.extendType)}, item, item.extend, item.geoPoint);
            // list.push(Object.assign({id:item.id, extendType:item.extendType, deviceName:item.name, latlng:item.geoPoint}, item.extend))
        })
        this.setState({data:Immutable.fromJS(list)}, ()=>{
            if(this.state.data && this.state.data.size>0){
                let data = this.state.data.get(0);
                this.tableClick(data);
            }
        })
    }

    deviceTotal(data){
        this.setState({deviceInfo:{total:data.count, normal:data.count==0 ? 0:data.count-1}});
    }

    searchSubmit(){
        this.requestSearch();
    }

    domainChange(selectIndex){
        // this.setState({domain:this.state.domain.update('index', v=>selectIndex)})
        this.state.domain = this.state.domain.update('index', v=>selectIndex);
        this.setState({domain:this.state.domain.update('value', v=>{
            return this.state.domain.getIn(['list', selectIndex, 'value']);
        })}, ()=>{this.requestSearch()})
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
        const latlng = data.get('geoPoint').toJS();
        this.setState({selectDevice: Object.assign({}, this.state.selectDevice, {
            latlng: latlng,
            position:[{"device_id":data.get('id'), "device_type":getDeviceTypeByModel(data.get('extendType')), lng:latlng.lng, lat:latlng.lat}],
            data:[{id:data.get('id'), name:data.get('name')}]
        })})
    }

    collpseHandler(){
        this.setState({collapse: !this.state.collapse})
    }

    render() {
        const { data, domain, search, collapse, page, deviceInfo, selectDevice } = this.state;

        const {total=0, normal=0} = deviceInfo;
        let width=145,height=145;

        return (
            <Content className={'offset-right '+(collapse?'collapsed':'')}>
                <div className="heading">
                    <Select className="domain" data={domain}
                            onChange={(selectIndex)=>this.domainChange(selectIndex)}/>
                    {/*<Select className="device" data={device}
                     onChange={(selectIndex)=>this.deviceChange(selectIndex)}/>*/}
                    <SearchText className="search" placeholder={search.get('placeholder')} value={search.get('value')}
                                onChange={value=>this.searchChange(value)} submit={()=>this.searchSubmit()}/>
                </div>
                <div className="table-container">
                    <Table columns={this.columns} data={data} activeId={selectDevice.data.length?selectDevice.data[0].id:""} rowClick={(row)=>this.tableClick(row)}/>
                    <Page className={"page "+(page.get('total')==0?"hidden":'')} showSizeChanger pageSize={page.get('pageSize')}
                          current={page.get('current')} total={page.get('total')} onChange={this.onChange} />
                </div>

                <SideBarInfo  mapDevice={selectDevice} collpseHandler={this.collpseHandler}>
                    <div className="panel panel-default device-statics-info">
                        <div className="panel-heading">
                            <span className="icon_chart"></span>{intlFormat({en:'asset information',zh:'设备统计信息'})}
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
        sidebarNode: state.assetStatistics.get('sidebarNode')
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
)(injectIntl(Pole));