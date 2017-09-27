/**
 * Created by a on 2017/9/13.
 */
import React,{Component} from 'react';

import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter';
import SearchText from '../../components/SearchText';

import {getAssetsBaseByModelWithName} from '../../api/asset';
import {getDeviceByAssetControls, addDeviceToStrategy, updateDeviceToStrategy} from '../../api/strategy'
import {getModelData,getModelNameById} from '../../data/assetModels';

import Immutable from 'immutable';
const lodash = require('lodash');
export default class StrategySetPopup extends Component{
    constructor(props){
        super(props);
        this.state = {
            deviceTypeName:"",
            search:Immutable.fromJS({placeholder:'输入设备名称', value:''}),

            curDeviceList:props.deviceList
        }

        this.deviceList = [/*{id:1, name:"灯1"},{id:2, name:"灯2"},{id:3, name:"灯3"},
            {id:4, name:"屏"},{id:5, name:"屏2"},{id:6, name:"屏3"},{id:7, name:"屏4"}*/]

        this.onChange = this.onChange.bind(this);
        this.submitSearch = this.submitSearch.bind(this);
        this.addDevice = this.addDevice.bind(this);
        this.delDevice = this.delDevice.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onCancel = this.onCancel.bind(this);

        this.requestSearch = this.requestSearch.bind(this);
        this.deviceListInit = this.deviceListInit.bind(this);
    }

    componentWillMount(){
        this.mounted = true;
        const {deviceType} = this.props;
        getModelData(()=>{
            this.mounted && this.setState({deviceTypeName:getModelNameById(deviceType)})
        });
        this.requestSearch();
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    requestSearch(){
        const {deviceType} = this.props;
        const {search} = this.state;
        console.log(search);
        console.log(deviceType);
        getAssetsBaseByModelWithName(deviceType, search.get("value"), data=>{ this.mounted && this.deviceListInit(data)})
    }

    deviceListInit(data){
        console.log(data);
        this.deviceList = data;
        this.setState(this.deviceList);
    }

    onConfirm(){
        const {onConfirm} = this.props;
        onConfirm && onConfirm(this.state);
    }

    onCancel(){
        const {onCancel} = this.props;
        onCancel && onCancel();
    }

    addDevice(data){
        this.state.curDeviceList.push(data);
        this.setState({curDeviceList:this.state.curDeviceList})
    }

    delDevice(data){
        lodash.remove(this.state.curDeviceList, dev=>{return dev.id == data.id})
        this.setState({curDeviceList:this.state.curDeviceList})
    }

    submitSearch(){
        this.requestSearch();
    }

    onChange(value){
        this.setState({search:this.state.search.update("value", v=>value)}, ()=>{
            // this.requestSearch();
        })
    }

    render(){
        const {title} = this.props;
        const {deviceTypeName, search, curDeviceList} = this.state;
        console.log("bbb");
        console.log(curDeviceList);
        console.log(this.deviceList);
        let valid = false
        let footer = <PanelFooter funcNames={['onCancel','onConfirm']} btnTitles={['取消','保存']}
                                  btnClassName={['btn-default', 'btn-primary']}
                                  btnDisabled={[false, valid]} onCancel={this.onCancel} onConfirm={this.onConfirm}/>;

        return <Panel className="strategy-set-popup" title={title} closeBtn={true} closeClick={this.onCancel} footer={footer}>
                <div className="row form-group">
                    <label className="col-sm-2">设备种类:</label>
                    <input className="col-sm-10" type="text"  disabled="disabled" placeholder="设备种类" value={deviceTypeName}/>
                </div>
                <div className="row form-group">
                    <label className="col-sm-2">所属域:</label>
                    <div className="col-sm-5">
                        <SearchText placeholder={search.get("placeholder")} value={search.get("value")} onChange={this.onChange} submit={this.submitSearch}/>
                        <ul className="device-all">
                            {   
                                this.deviceList.map(device=>{
                                    let IsAdd = lodash.find(curDeviceList, dev=>{return dev.id == device.id});
                                    return <li key={device.id}>{device.name}<span className={IsAdd?"":"glyphicon glyphicon-plus"} onClick={()=>{!IsAdd && this.addDevice(device)}}>{IsAdd?"已添加":""}</span></li>
                                })
                            }
                        </ul>
                    </div>
                    <div className="col-sm-5 device-cur-container">
                        <ul className="device-cur">
                            {   
                                curDeviceList && curDeviceList.map(device=>{
                                    return <li key={device.id}>{device.name}<span className="icon-table-delete" onClick={()=>this.delDevice(device)}></span></li>
                                })
                            }
                        </ul>
                    </div>
                </div>
            </Panel>
    }
}