/**
 * Created by a on 2017/9/1.
 */
import React,{Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import {injectIntl,FormattedMessage} from 'react-intl';

import Content from '../../components/Content'
import Select from '../../components/Select';
import SearchText from '../../components/SearchText';
import Table from '../../components/Table';
import Page from '../../components/Page';
import SideBarInfo from '../../components/SideBarInfo';
import StrategySetPopup from '../component/StrategySetPopup'

import {overlayerShow, overlayerHide} from '../../common/actions/overlayer'
import {timeStrategy, sensorStrategy} from '../../common/util/chart'

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
            sort:Immutable.fromJS({list:[{id:1, value:this.formatIntl('app.scene.order')},{id:2, value:this.formatIntl('app.device.number')}], index:0, value:this.formatIntl('app.device.number')}),
            strategy:Immutable.fromJS({list:[{id:"time", value:this.formatIntl('app.time.strategy')},
                {id:"sensor", value:this.formatIntl('app.sensor.strategy')},{id:"latlng", value:this.formatIntl('app.latlng.strategy')}],index:0, value:this.formatIntl('app.time.strategy')}),
            search:Immutable.fromJS({placeholder:this.formatIntl('app.input.strategy.name'), value:''}),

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

        this.columns = [{field:"name", title:this.formatIntl("app.strategy.name")}, {field:"type", title:this.formatIntl("app.strategy.type")},
            {field:"asset", title:this.formatIntl("app.device.type")}, {field:"setState", title:this.formatIntl("app.set.state")}]

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
        this.formatIntl = this.formatIntl.bind(this);
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

    formatIntl(formatId){
        return this.props.intl.formatMessage({id:formatId});
        // return formatId;
    }

    requestSearch(){
        const {strategy, search, page} = this.state;
        let model = strategy.getIn(["list", strategy.get("index"), "id"]);
        let limit = page.get("pageSize");
        let offset = (page.get("current")-1)*limit;
        let value = search.get("value")

        this.setState({selectDevice:{}}, ()=>{
            getStrategyListByName(model, value, offset, limit, (data)=>{this.mounted && this.initData(data)})
            getStrategyCountByName(model, value, data=>{this.mounted && this.initPageTotal(data);})
        })

    }

    initData(data){
        this.setState({data:Immutable.fromJS(data), page:this.state.page.update("total", v=>data.length)}, ()=>{
            data.map(strategy=>{
                this.getStrategyDevice(strategy, (id)=>{
                    console.log(data);
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
                                                   /* for(let key in data.curDeviceList){
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
                                                    }*/
                                                    actions.overlayerHide();

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
                            <span className="icon_select"></span><FormattedMessage id="sysOperation.selected.device"/>
                        </div>
                        <div className="panel-body strategy-property">
                            <span className="strategy-name">{selectDevice.name}</span>
                            <button id="sys-update" className="btn btn-primary pull-right" onClick={this.setHandler} disabled={data.size==0 ? true : false}><FormattedMessage id="button.set"/>
                            </button>
                        </div>
                    </div>
                    <div className="panel panel-default strategy-param">
                        <div className="panel-heading">
                            <span className="icon_list"></span><FormattedMessage id="app.strategy.param"/>
                        </div>
                        <div className="panel-body strategy-chart" id="strategyChart" ref={this.renderChart}>

                        </div>
                    </div>
                    <div className="panel panel-default strategy-device">
                        <div className="panel-heading">
                            <span className="icon_device_list"></span><FormattedMessage id="app.include.target.devices"/>
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
)(injectIntl(Strategy));