/**
 * Created by mx on 2017/9/12.
 * systemOperation/systemConfig/scene/SceneControllerPopup;
 */

import React, { Component } from 'react';
// import Panel from '../../components/Panel';
import Panel from '../../components/Panel';
// import PanelFooter from '../../components/PanelFooter';
import PanelFooter from '../../components/PanelFooter';
// import Select from '../../components/Select.1';
import Select from '../../components/Select.1';
import MapView from '../../components/MapView';
import PropTypes from 'prop-types';

// import LineChart from '../../common/util/LineChart';
import {timeStrategy,  sensorStrategy} from '../../common/util/chart'

import { Name2Valid, latlngValid, lngValid, latValid, MACValid } from '../../util/index'
export default class SceneControllerPopup extends Component {
    constructor(props) {
        super(props);
        const {assetName="",domain="", domainId="",id="", name="", mode="", sceneAssetList="", param="",  modelId="", model="",  lng=0, lat=0} = props.data;
        this.state = {
            domain: domain,
            domainId: domainId,     
            id: id,
            name: name,
            mode: mode, //控制模式
            sceneAssetList: sceneAssetList, //场景白名单
            param: param, //调整参数
            assetName: assetName,


            
            // id: id,
            // name: name,
            model: model,
            modelId: modelId,

            lng: lng,
            lat: lat,
            prompt: {
                // domainName:false,
                lng: false,
                lat: false,
                name: false,
                id: false
            },
            sensorTypeDefault:{},   //绘制图表
            selectDevice:{          //绘制图表
                // id:1, name:"策略1", type:'传感器策略', asset:'lc', setState:'已设定',
                // deviceList:[{id:1, name:"屏幕", groupName:"疏影路组"},{id:2, name:"屏幕", groupName:"莘北路组"}],
                // strategy:[]
                asset:"lc",
                deviceList:[],
                id:2,
                name:"test1",
                type:"time",
                strategy:[
                    {
                    condition:{time: "19:42"},
                    rpc:{brightness:"50"},
                    },
                    {
                    condition:{time: "23:42"},
                    rpc:{brightness:"70"},
                    }
                ]
            },
        };
        this.columns = [
            {field: "name"}
        ]
        
        this.timeStrategy = null;  //绘制图表
        this.sensorStrategy = null; //绘制图表
        this.renderChart = this.renderChart.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.renderHtmlForModel = this.renderHtmlForModel.bind(this);
    }

    onChange(e) {
        let id = e.target.id;
        if(id == "domain") {//域
            this.setState({
                domainId: this.props.domainList.options[e.target.selectedIndex].id
            });
        } 
        if (id == "device") {
            this.setState({
                assetName: this.props.assetList.options[e.target.selectedIndex].name
            });
        }
        if (id == "controlModel") {
            //控制模式
        }
        if (id == "controlParam") {
            //调整参数
        }

        let value = e.target.value;
        let newValue = '';
        let prompt = false;

       if (id == "name") {
            newValue = value; //过滤非法数据
            prompt = !Name2Valid(newValue); //判定输入数量
       } else {
            newValue = value;
       }

       this.setState({
            [id]: newValue,
            prompt: Object.assign({}, this.state.prompt, {
                [id]: prompt
            })
        });
    }


    renderHtmlForModel() {
        return <div className="form-group clearfix">
                 <label htmlFor="model" className="fixed-width-left control-label">型号：</label>
                 <div className="fixed-width-right">
                   <Select id="model" className="form-control" titleField={ this.props.modelList.titleField } 
                        valueField={ this.props.modelList.valueField } options={ this.props.modelList.options } 
                        value={ this.state.model } onChange={ this.onChange }
                        disabled={this.props.model === "xes" && this.props.popId=='edit'?true:false}/>
                 </div>
               </div>

    }

    onCancel() {
        this.props.overlayerHide();
    }

    onConfirm() {
        this.props.overlayerHide();
        this.props.onConfirm && this.props.onConfirm(this.state);
    }


    /*绘制图表参数*/
    updateChart(){
        const {chart, sensorTypeDefault} = this.state;
        if(!chart) {
            return;
        }
        const {type, strategy} = this.state.selectDevice;
        if(!strategy){
            return;
        }

        this.timeStrategy && this.timeStrategy.destory();
        this.sensorStrategy && this.sensorStrategy.destroy();

        if(type == "time"){

            this.timeStrategy = timeStrategy(chart.id, strategy, 115);
        }else if(type=="sensor"){

            this.sensorStrategy = sensorStrategy(chart, strategy, sensorTypeDefault)
        }

    }

    /*绘制图表参数*/
    renderChart(ref){
        if(ref){
            this.setState({chart:ref}, ()=>{
                this.updateChart();
            });
        }
    }

    render() {
        const {sceneAssetList, assetList} = this.props; 
        const {className, title, domainList, modelList, popId} = this.props;
        const {assetName, id, name, model, domain, lng, lat, prompt} = this.state;
        // console.log('sceneAssetListprops:', this.props.sceneAssetList);
        // console.log('sceneAssetListstate:', this.state.sceneAssetList);

        let valid = false;
        const footer = <PanelFooter funcNames={ ['onCancel', 'onConfirm'] } btnTitles={ ['取消', '确认'] } btnClassName={ ['btn-default', 'btn-primary'] } btnDisabled={ [false, valid] } onCancel={ this.onCancel }
                         onConfirm={ this.onConfirm } />;
        return (
            <div className={ "scene-centralized-popup" }>
              <Panel title={ title } closeBtn={ true } closeClick={ this.onCancel } footer = {footer}>
                <div className="popup-top">
                    <div className="form-group clearfix">
                        <label htmlFor="id" className="fixed-width-left control-label">场景名称：</label>
                        <div className="fixed-width-right">
                            <input type="text" className="form-control" id="name" placeholder="输入新建场景名称" value={ name } maxLength={ 16 } onChange={ this.onChange } disabled={ popId == 'edit' ? true : false }
                            />
                        <span className={ prompt.id ? "prompt " : "prompt hidden" }>{ "场景名已使用/仅能使用字母、数字、或者下划线" }</span>
                        </div>
                    </div>
                </div>
                <div className="popup-body"> 
                    <div className="col-sm-6 col-xm-6 popup-body-left">
                         <Select id="domain" titleField={ domainList.valueField } valueField={ domainList.valueField } options={ domainList.options } value={ domain } onChange={ this.onChange }/>
                        <div>
                         <Select id="device" titleField={ assetList.valueField } valueField={ assetList.valueField } options={ assetList.options } value={ assetName } onChange={ this.onChange }/>
                         <button id="sys-add" className="btn btn-primary add-domain" onClick={ this.domainHandler }>添加</button>
                        </div>
                        <div className="table-list">
                            <div className="table-body">
                                <ul>{
                                        sceneAssetList.map((item, index) => (
                                            <li key = {item.id} className = "body-row clearfix">
                                                {
                                                    this.columns.map((subItem, subIndex) => (
                                                        <div key={subIndex} className="tables-cell" title={item[subItem.field]}>{item[subItem.field]}</div>
                                                    ))
                                                }
                                                    <div className="tables-cell cell-right">
                                                        <span id = {item.id} className = "glyphicon glyphicon-trash" onClick={this.itemDelete}></span>
                                                    </div>
                                             </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 col-xm-6 popup-body-right">
                        <div className="selectBox">
                         <label htmlFor="id" className="fixed-width-left control-label">控制模式</label>
                         <Select id="controlModel" titleField={ domainList.valueField } valueField={ domainList.valueField } options={ domainList.options } value={ domainList.value } onChange={ this.domainSelect }/>
                        </div>
                        <div className="selectBox">
                         <label htmlFor="id" className="fixed-width-left control-label">调整参数</label>
                         <Select id="controlParam" titleField={ domainList.valueField } valueField={ domainList.valueField } options={ domainList.options } value={ domainList.value } onChange={ this.domainSelect }/>
                        </div>
                        <div className="panel panel-default strategy-param" hidden={ popId == 'add' ? true : false}>
                            <div className="chart-heading">策略参数</div>
                            <div className="panel-body strategy-chart" id="strategyChart" ref={this.renderChart}>
                            </div>
                        </div>
                    </div>
                </div> 
              </Panel>
            </div>
        )
    }
}

SceneControllerPopup.propTypes = {
    popId: PropTypes.string.isRequired
}
