/**
 * Created by a on 2017/9/1.
 */
import React,{Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import Content from '../../components/Content'
import Select from '../../components/Select';
import SearchText from '../../components/SearchText';
import Table from '../../components/Table';
import Page from '../../components/Page';
import SideBarInfo from '../../components/SideBarInfo';
import StrategySetPopup from '../component/StrategySetPopup'

import {overlayerShow, overlayerHide} from '../../common/actions/overlayer'
import {timeStrategy, sensorStrategy} from '../util/chart'

import {getAssetsBaseByModel} from '../../api/asset'
import {getStrategyListByName, getStrategyCountByName, getDeviceByAssetControls, addDeviceToStrategy, updateDeviceToStrategy} from '../../api/strategy'
import {ASSET_CONTROL_MODE_STRATEGY} from '../../common/util/index'

import {getModelData, getSensorDefaultValues} from '../../data/assetModels'
import Immutable from 'immutable';
const lodash = require('lodash');
import {getIndexByKey} from '../../util/algorithm'
export class Strategy extends Component{
    constructor(props){
        super(props);
        this.state = {
            sort:Immutable.fromJS({list:[{id:1, value:'场景序号'},{id:2, value:'设备多少'}], index:0, value:'场景序号',placeholder:"排序"}),
            strategy:Immutable.fromJS({list:[{id:"time", value:'时间策略'},{id:"sensor", value:'传感器策略'},{id:"latlng", value:'经纬度策略'}],index:0, value:'时间策略',placeholder:'策略类型'}),
            search:Immutable.fromJS({placeholder:'输入策略名称', value:''}),

            collapse:false,
            page: Immutable.fromJS({
                pageSize:10,
                current: 1,
                total: 0
            }),

            selectDevice:{
                /*id:1, name:"策略1", type:'传感器策略', asset:'lc', setState:'已设定',
                deviceList:[{id:1, name:"屏幕", groupName:"疏影路组"},{id:2, name:"屏幕", groupName:"莘北路组"}],
                strategy:[]*/
            },

            data:Immutable.fromJS([
               /* {id:1, name:"策略1", type:'传感器策略', asset:'lc', setState:'已设定',
                    deviceList:[{id:1, name:"屏幕", groupName:"疏影路组"},{id:2, name:"屏幕", groupName:"莘北路组"}],
                    strategy:[]},
                {id:2, name:"策略2", type:'传感器策略', asset:'screen', setState:'未设定',
                    deviceList:[{id:1, name:"屏幕", groupName:"疏影路组"},{id:2, name:"屏幕", groupName:"莘北路组"}],
                    strategy:[]}*/
            ]),
            sensorTypeDefault:{}
        }

        this.columns = [{field:"name", title:"策略名称"}, {field:"type", title:"策略类型"},
            {field:"asset", title:"设备种类"}, {field:"setState", title:"设定状态"}]

        this.timeStrategy = null;
        this.sensorStrategy = null;
        this.renderChart = this.renderChart.bind(this);
        this.updateChart = this.updateChart.bind(this);

        this.onChange = this.onChange.bind(this);
        this.updatePage = this.updatePage.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.tableClick = this.tableClick.bind(this);
        this.collpseHandler = this.collpseHandler.bind(this);
        this.setHandler = this.setHandler.bind(this);

        this.requestSearch = this.requestSearch.bind(this);
        this.initData = this.initData.bind(this);
        this.initPageTotal = this.initPageTotal.bind(this);
        this.getStrategyDevice = this.getStrategyDevice.bind(this);
    }

    componentWillMount(){
        this.mounted = true;
        getModelData(()=>{
            this.mounted && this.setState({sensorTypeDefault:getSensorDefaultValues()}, ()=>{
                this.requestSearch();
            })
        })
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    requestSearch(){
        const {strategy, search, page} = this.state;
        let model = strategy.getIn(["list", strategy.get("index"), "id"]);
        let limit = page.get("pageSize");
        let offset = (page.get("current")-1)*limit;
        let value = search.get("value")
        getStrategyListByName(model, value, offset, limit, (data)=>{this.mounted && this.initData(data)})
        getStrategyCountByName(model, value, data=>{this.mounted && this.initPageTotal(data);})
    }

    initData(data){
        this.setState({data:Immutable.fromJS(data), page:this.state.page.update("total", v=>data.length)}, ()=>{
            data.map(strategy=>{
                this.getStrategyDevice(strategy, (id)=>{
                    if(data.length && id == data[0].id){
                        this.tableClick(this.state.data.get(0));
                    }
                });
            })
        });
    }

    initPageTotal(data){
        let page = this.state.page.set('total', data.count);
        this.setState({page: page});
    }
    getStrategyDevice(strategy, cb){
        getAssetsBaseByModel(strategy.asset, asset=>{
            // if(asset && asset.length){
                getDeviceByAssetControls("", ASSET_CONTROL_MODE_STRATEGY, strategy.id, (data)=>{
                    let curIndex = getIndexByKey(this.state.data, "id", strategy.id);
                    this.setState({data:this.state.data.updateIn([curIndex, "deviceList"], v=>this.findAssetById(asset, data))}, ()=>{
                        cb && cb(strategy.id);
                    })
                    this.setState({data:this.state.data.updateIn([curIndex, "setState"], v=>this.state.data.getIn([curIndex, "deviceList"]).length?"已设定":"未设定")})
                })
            // }
        })
    }

    findAssetById(asset, assetControl){
        let list = []
        assetControl.map(ac=>{
            let findAsset = lodash.find(asset, ass=>{return ass.id==ac.asset})
            if(findAsset){
                list.push(findAsset);
            }
        })

        return list;
    }

    setHandler(){
        const {selectDevice} = this.state;
        const {actions} = this.props
        actions.overlayerShow(<StrategySetPopup title="设定设备" deviceType={selectDevice.asset} deviceList={selectDevice.deviceList}
                                                onConfirm={(data)=>{
                                                    for(let key in data.curDeviceList){
                                                        let device = data.curDeviceList[key];
                                                        let ac = {
                                                            "asset": device.id,
                                                            "prop": "",
                                                            "mode": ASSET_CONTROL_MODE_STRATEGY,
                                                            "value": selectDevice.id
                                                        }
                                                        if(lodash.find(selectDevice.deviceList, dev=>{return dev.id == device.id})){
                                                            updateDeviceToStrategy(ac)
                                                        }else{
                                                            addDeviceToStrategy(ac)
                                                        }
                                                    }

                                                }} onCancel={()=>{
                                                    actions.overlayerHide();
                                                }}/>);
    }

    tableClick(row){
        this.setState({selectDevice:row.toJS()}, ()=>{
            this.updateChart();
        });
    }

    searchSubmit(){
        this.updatePage(1);
    }

    onChange(key, value){
        switch(key){
            case "sort":
            case "strategy":
                this.updatePage(1);
                this.setState({[key]:this.state[key].update("index", v=>value)},()=>{
                    this.requestSearch();
                    this.setState({[key]:this.state[key].update('value', v=>{
                        return this.state[key].getIn(['list', value, 'value']);
                    })})
                })
                break;
            case "search":
                this.setState({search:this.state.search.update("value", v=>value)});
                break;
            case "page":
                this.updatePage(value);
                break;
        }
    }

    updatePage(current){
        this.setState({page:this.state.page.update("current", v=>current)}, ()=>{
            this.requestSearch();
        });
    }

    collpseHandler(){
        this.setState({collapse: !this.state.collapse})
    }

    updateChart(){
        const {chart, sensorTypeDefault} = this.state;
        if(!chart) {
            return;
        }
        const {type, strategy} = this.state.selectDevice;
        if(!strategy){
            return;
        }

        this.timeStrategy && this.timeStrategy.destroy();
        this.sensorStrategy && this.sensorStrategy.destroy();

        if(type == "time"){

            this.timeStrategy = timeStrategy(chart.id, strategy);
        }else if(type=="sensor"){

            this.sensorStrategy = sensorStrategy(chart, strategy, sensorTypeDefault)
        }

    }

    renderChart(ref){
        if(ref){
            this.setState({chart:ref}, ()=>{
                this.updateChart();
            });
        }
    }

    render(){
        const {sort, strategy, search, selectDevice, page, collapse, data} = this.state;
        return (
            <Content className={collapse?'collapsed':''}>
                <div className="heading">
                    <Select className="sort" data={sort}
                            onChange={(selectIndex)=>this.onChange("sort", selectIndex)}/>
                    <Select className="strategy" data={strategy}
                     onChange={(selectIndex)=>this.onChange("strategy", selectIndex)}/>
                    <SearchText className="search" placeholder={search.get('placeholder')} value={search.get('value')}
                                onChange={value=>this.onChange("search", value)} submit={()=>this.searchSubmit()}/>
                </div>
                <div className="table-container">
                    <Table columns={this.columns} data={data} activeId={selectDevice.id} rowClick={(row)=>this.tableClick(row)}/>
                    <Page className={"page "+(page.get('total')==0?"hidden":'')} showSizeChanger pageSize={page.get('pageSize')}
                          current={page.get('current')} total={page.get('total')} onChange={(current,page)=>this.onChange("page", current)} />
                </div>
                <SideBarInfo IsHaveMap={false} collpseHandler={this.collpseHandler}>
                    <div className="panel panel-default strategy-info">
                        <div className="panel-heading">
                            <svg><use xlinkHref={"#icon_sys_select"} transform="scale(0.075,0.075)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg>选中设备
                        </div>
                        <div className="panel-body strategy-property">
                            <span className="strategy-name">{selectDevice.name}</span>
                            <button id="sys-update" className="btn btn-primary pull-right" onClick={this.setHandler} disabled={data.size==0 ? true : false}>设定
                            </button>
                        </div>
                    </div>
                    <div className="panel panel-default strategy-param">
                        <div className="panel-heading">
                            <svg><use xlinkHref={"#icon_sys_select"} transform="scale(0.075,0.075)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg>策略参数
                        </div>
                        <div className="panel-body strategy-chart" id="strategyChart" ref={this.renderChart}>

                        </div>
                    </div>
                    <div className="panel panel-default strategy-device">
                        <div className="panel-heading">
                            <svg><use xlinkHref={"#icon_sys_select"} transform="scale(0.075,0.075)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg>包含目标设备
                        </div>
                        <div className="panel-body">
                            <ul>
                            {
                                selectDevice.deviceList && selectDevice.deviceList.map(device=>{
                                    return <li key={device.id}><span>{device.name}</span>{/*({device.groupName})*/}</li>
                                })
                            }
                            </ul>
                        </div>
                    </div>
                </SideBarInfo>
            </Content>
        )
    }
}

const mapStateToProps = (state) => {
    return {
    }
}

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        overlayerShow: overlayerShow,
        overlayerHide: overlayerHide
    }, dispatch),
})

export default connect(
    mapStateToProps, mapDispatchToProps
)(Strategy);