/**
 * Created by mx on 2017/9/12.
 * systemOperation/systemConfig/scene/SceneControllerPopup;
 */

import React, { Component } from 'react';
import Panel from '../../components/Panel';
import PanelFooter from '../../components/PanelFooter';
import Select from '../../components/Select.1';
// import MapView from '../../components/MapView';
import PropTypes from 'prop-types';

import {timeStrategy,  sensorStrategy} from '../../common/util/chart';
// import { Name2Valid, MACValid } from '../../util/index';
import { Name2Valid } from '../../util/index';
export default class SceneControllerPopup extends Component {
  constructor(props) {
    super(props);
    const {assetName = '', domainId = '', id = '', name = '', sceneAssetList = '', param = ''} = props.data;
    this.state = {
      paramList:{
        titleField: 'name',
        valueField: 'name',
        index: 0,
        value: '',
        options:[
          {id: '1', name: '亮度'},
          {id: '2', name: '开关'},
        ]},
      modeValue:'STRATEGY',
      domainId: domainId,     
      id: id,
      name: name,
      sceneAssetList: sceneAssetList, //场景设备名单
      param: param, //调整参数
      assetName: assetName,
      prompt: {
        // domainName:false,
        name: false,
        id: false,
      },

      sensorTypeDefault:{},   //绘制图表
      selectDevice:{          //绘制图表
        // id:1, name:"策略1", type:'传感器策略', asset:'lc', setState:'已设定',
        // deviceList:[{id:1, name:"屏幕", groupName:"疏影路组"},{id:2, name:"屏幕", groupName:"莘北路组"}],
        // strategy:[]
        asset:'lc',
        deviceList:[],
        id:2,
        name:'test1',
        type:'time',
        strategy:[
          {
            condition:{time: '19:42'},
            rpc:{brightness:'50'},
          },
          {
            condition:{time: '23:42'},
            rpc:{brightness:'70'},
          },
        ],
      },

    };
    this.columns = [
      {field: 'name'},
    ];
    this.modeList = {
      titleField: 'name',
      valueField: 'name',
      index: 0,
      value: '',
      options:[
        {id: '1', name: 'MANUAL'},
        {id: '2', name: 'STRATEGY'},
      ]};
    this.data = {
      name:'',
      presets:
            [{
              id:'',
              asset:'',
              prop:'',
              mode:'',
              value:'',

            }],
    };

    this.timeStrategy = null;  //绘制图表
    this.sensorStrategy = null; //绘制图表
    this.renderChart = this.renderChart.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
  }

  onChange(e) {
    let id = e.target.id;
    if (id == 'domain') {//域
      this.setState({
        domainId: this.props.domainList.options[e.target.selectedIndex].id,
      }, );
    }
    if (id == 'device') {
      this.setState({
        assetName: this.props.assetList.options[e.target.selectedIndex].name,
      });
    }
    if (id == 'controlModel') {//控制模式
      this.setState({
        modeValue: this.modeList.options[e.target.selectedIndex].name,
      });
    }
    if (id == 'controlParam') {//调整参数
      this.setState({
        param: this.state.paramList.options[e.target.selectedIndex].name,
      });
    }

    let value = e.target.value;
    let newValue = '';
    let prompt = false;

    if (id == 'name') {
      newValue = value; 
      prompt = !Name2Valid(newValue); 
      this.setState({
        name: newValue,
        prompt: Object.assign({}, this.state.prompt, {
          [id]: prompt,
        }),
      });
    }
  }

  onCancel() {
    this.props.overlayerHide();
  }

  onConfirm() {
    this.data = { name: this.state.name, 
      presets:[{id: this.state.domainId, asset: this.state.assetName, mode: this.state.modeValue}]};
    let data = this.data;
    this.props.overlayerHide();
    this.props.onConfirm && this.props.onConfirm(data);
        
  }

  /*绘制图表参数*/
  updateChart() {
    const {chart, sensorTypeDefault} = this.state;
    if (!chart) {
      return;
    }
    const {type, strategy} = this.state.selectDevice;
    if (!strategy) {
      return;
    }

    this.timeStrategy && this.timeStrategy.destory();
    this.sensorStrategy && this.sensorStrategy.destroy();

    if (type == 'time') {
      this.timeStrategy = timeStrategy(chart.id, strategy, 115);
    } else if (type == 'sensor') {
      this.sensorStrategy = sensorStrategy(chart, strategy, sensorTypeDefault);
    }
  }

  /*绘制图表参数*/
  renderChart(ref) {
    if (ref) {
      this.setState({chart:ref}, () => {
        this.updateChart();
      });
    }
  }

  render() {
    const { assetList, domainList, popId, title} = this.props; 
    const { paramList, modeValue,  param, assetName,  name, domainId, prompt } = this.state;
    let valid = false;
    const footer = <PanelFooter funcNames={ ['onCancel', 'onConfirm'] } 
      btnTitles={ ['取消', '确认'] } btnClassName={ ['btn-default', 'btn-primary'] } 
      btnDisabled={ [false, valid] } onCancel={ this.onCancel }
      onConfirm={ this.onConfirm } />;
    return (
      <div className={ 'scene-centralized-popup' }>
        <Panel title={ title } closeBtn={ true } closeClick={ this.onCancel } footer={footer}>
          <div className="popup-top">
            <div className="form-group clearfix">
              <label htmlFor="id" className="fixed-width-left control-label">场景名称：</label>
              <div className="fixed-width-right">
                <input type="text" className="form-control" id="name" placeholder="请输入场景" 
                  value={ name } maxLength={ 16 } onChange={ this.onChange } disabled={ popId == 'edit' }/>
                <span id="nameTip" onChange={ this.onChange } 
                  className={ prompt.name ? 'prompt ' : 'prompt hidden' }>{ '场景名已使用/仅能使用字母、数字、或者下划线' }</span>
              </div>
            </div>
          </div>
          <div className="popup-body"> 
            <div className="col-sm-6 col-xs-6 popup-body-left">
              <Select id="domain" titleField={ domainList.titleField } 
                valueField={ domainList.valueField } options={ domainList.options } value={ domainId } 
                onChange={ this.onChange }/>
              <span id="domainTip" onChange={ this.onChange } 
                className={ domainList.options.length == 0 ? 'prompt ' : 'prompt hidden' }>
                { '请添加域' }</span>                         
              <div id="device-box">
                <Select id="device" titleField={ assetList.valueField } 
                  valueField={ assetList.valueField } options={ assetList.options } value={ assetName } 
                  onChange={ this.onChange }/>
                <button id="sys-add" className="btn btn-primary add-domain" onClick={ this.domainHandler }>添加</button>
              </div>
              <span id="deviceTip" onChange={ this.onChange } 
                className={ assetList.options.length == 0 ? 'prompt ' : 'prompt hidden' }>{ '请添场景设备' }</span>
              <div className="table-list">
                <div className="table-body">
                  {/* <ul>{
                                        sceneAssetList[0].id && sceneAssetList.map((item, index) => (
                                            <li key = {item.id} className = "body-row clearfix">
                                                {
                                                    this.columns.map((subItem, subIndex) => (
                                                        <div key={subIndex} className="tables-cell" 
                                                        title={item[subItem.field]}>{item[subItem.field]}</div>
                                                    ))
                                                }
                                                    <div className="tables-cell cell-right">
                                                        <span id = {item.id} className = "glyphicon glyphicon-trash" 
                                                        onClick={this.itemDelete}></span>
                                                    </div>
                                             </li>
                                        ))
                                    }
                                </ul> */}
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-xs-6 popup-body-right">
              <div className="selectBox">
                <label htmlFor="id" className="fixed-width-left control-label">控制模式</label>
                <Select id="controlModel" titleField={ this.modeList.valueField } 
                  valueField={ this.modeList.valueField } options={ this.modeList.options } 
                  value={ modeValue } onChange={ this.onChange }/>
              </div>
              <div className="selectBox" hidden={ popId == 'add'}>
                <label htmlFor="id" className="fixed-width-left control-label">调整参数</label>
                <Select id="controlParam" titleField={ paramList.valueField } 
                  valueField={ paramList.valueField } options={ paramList.options } value={ param } 
                  onChange={ this.onChange }/>
              </div>
              <div className="panel panel-default strategy-param" hidden={ popId == 'add'}>
                <div className="chart-heading">策略参数</div>
                <div className="panel-body strategy-chart" id="strategyChart" ref={this.renderChart}>
                </div>
              </div>
            </div>
          </div> 
        </Panel>
      </div>
    );
  }
}

SceneControllerPopup.propTypes = {
  popId: PropTypes.string.isRequired,
};
