/**
 * created by m on 2018/01/8
 */
import '../../../public/styles/lightManage-statistics.less';
import React, { Component } from 'react';

import Content from '../../components/Content';
import Select from '../../components/Select.1';
import BarChart from '../utils/barChart';
import PieChart from '../utils/pieChart';

import { getDomainList } from '../../api/domain';
import { getEnergy, getDomainStatusByDomainId } from '../../api/statistics';
// import { injectIntl, FormattedMessage } from 'react-intl';

export default class LightStatistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      energyFilt: {
        id: '',
        title: '',
        data: [
          // { x: '2018-01-01T00:00:00.000Z', y: 160 },
          // { x: '2018-01-02T00:00:00.000Z', y: 150 },
          // { x: '2018-01-03T00:00:00.000Z', y: 130 },
          // { x: '2018-01-04T00:00:00.000Z', y: 140 },
          // { x: '2018-01-05T00:00:00.000Z', y: 160 },
          // { x: '2018-01-06T00:00:00.000Z', y: 150 },
          // { x: '2018-01-07T00:00:00.000Z', y: 130 },
          // { x: '2018-01-08T00:00:00.000Z', y: 140 },
          // { x: '2018-01-09T00:00:00.000Z', y: 160 },
          // { x: '2018-01-10T00:00:00.000Z', y: 150 },
          // { x: '2018-01-11T00:00:00.000Z', y: 130 },
          // { x: '2018-01-12T00:00:00.000Z', y: 140 },
        ],
      },
      energyFilter: {
        id: '',
        domainId: '',
        // type:'2',
        dateTime: {},
        variable: 'power',
      },
      // curEnergy: 'dayEnergy', //默认显示列表第一项对应的能源消耗
      type: '2', //0,1,2,3是分别以年月日时为单位统计的标识
      totalEnergy: '10000', //显示设备总能耗
      energyList: {
        titleField: 'name',
        valueField: 'name',
        id: '',
        value: '月度能耗',
        curEnergy: 'dayEnergy',
        options: [
          { id: 1, name: '年度能耗', value: 'yearEnergy', type: '1', data: {} },
          { id: 2, name: '月度能耗', value: 'monthEnergy', type: '2', data: {} },
          { id: 3, name: '当日能耗', value: 'dayEenergy', type: '3', data: {} },
        ],
      },
      domainList: {
        id: '1',
        titleField: 'name',
        valueField: 'name',
        index: '',
        value: '', //域的名字
        options: [],
      },
      piechartList: [],
      dataIdBind: [
        { domainId: '', deviceId: '', planId: '' },
        {},
      ],
      // deviceState: {id:'1', domainId:'1', deviceTotal:'100', deviceOnlineRunning:'90',
      // deviceOnlineError:'3', deviceOffline:'7'},
      // planState: {id:'1', domainId:'1', planTotal:'25', palnSuccess:'23', planFail:'22'},
      // lightState: {id:'1', domainId:'1', lightTotal:'180', lightOnPercent:'95',lighton:'195', lightOff:'10'},
      domainStatus:
                {
                  id: '',
                  domainId: '1',
                  deviceTotal: '100', deviceOnlineRunning: '90', deviceOnlineError: '3', deviceOffline: '7',
                  planTotal: '25', palnSuccess: '23', planFail: '2',
                  lightTotal: '180', lightOnPercent: '0.95', lighton: '195', lightOff: '10',
                },
      pieWIdth: 150,
      pieHeight: 170,

    };

    this.onClick = this.onClick.bind(this);
    this.renderChart = this.renderChart.bind(this);
    this.drawChart = this.drawChart.bind(this);
    this.destroyBarChart = this.destroyBarChart.bind(this);
    this.destroyPieChart = this.destroyPieChart.bind(this);
    this.updatePieChart = this.updatePieChart.bind(this);
    this.updateDomainData = this.updateDomainData.bind(this);
    this.domainSelect = this.domainSelect.bind(this);
    this.energySelect = this.energySelect.bind(this);
    this.getEnergyDataByIdAndType = this.getEnergyDataByIdAndType.bind(this);
    this.getStatusDataByDomainId = this.getStatusDataByDomainId.bind(this);
  }

  componentWillMount() {
    this.mounted = true;
    this.initData();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidMount() {

    // let resiseWaiter = false;
    // window.onresize = function() {
    //   if (!resiseWaiter) {
    //     resiseWaiter = true;
    //     setTimeout(function() {
    //       window.location.reload();
    //       resiseWaiter = false;
    //     }, 1500);
    //   }
    // };
    
  }

  initData() {
    getDomainList(data => {
      this.mounted && this.updateDomainData(data);
    });
  }

  updateDomainData(data, selectedIndex) {
    let type = this.state.type;
    let { domainList } = this.state;
    let { id, options } = this.state.domainList;
    let index = selectedIndex == null ? 0 : selectedIndex;
    if (data.length == 0) {
      index = 0;
      options = [{ name: '请添加域' }];
      domainList.value = options[0].name;
      domainList.options = options;
      id = null;
    } else {
      options = data;
      domainList.value = options[index].name;
      domainList.options = options;
      id = options[index].id;
    }
    // let curDomain = options[index];
    this.setState({ domainList: { ...this.state.domainList, options, id } }, () => {
      id && this.getEnergyDataByIdAndType(id, type);
      id && this.getStatusDataByDomainId(id);
    });
  }

  //获取能耗参数并渲染
  getEnergyDataByIdAndType(id, type) {
    let myDate = new Date();
    let year = myDate.getFullYear();
    let month = ('0' + (myDate.getMonth() + 1)).slice(-2);
    let day = ('0' + (myDate.getDate())).slice(-2);
    var dateTime, str1a, str1b;
    switch (type) {
    case '1'://获取一年中每个月的能耗
      str1a = `${year}-01-01T00:00:00Z`;
      str1b = `${year}-12-31T23:59:59Z`;
      dateTime = { between: [str1a, str1b] };
      break;
    case '2'://获取一个月中每天的能耗
      str1a = `${year}-${month}-01T00:00:00Z`;
      str1b = `${year}-${month}-31T23:59:59Z`;
      dateTime = { 'between': [str1a, str1b] };
      break;
    case '3'://获取一天中每小时的能耗
      str1a = `${year}-${month}-${day}T00:00:00Z`;
      str1b = `${year}-${month}-${day}T23:59:59Z`;
      dateTime = { between: [str1a, str1b] };
      break;
    default:
      return dateTime;
    }
    // console.log("dateTime:", dateTime);
    //获取能耗数据并重新渲染
    getEnergy(id, type, dateTime, (response) => {
      let { data } = this.state.energyFilt;
      let { totalEnergy } = this.state;
      totalEnergy = 0;
      if (response) { data = []; }
      for (var key in response) {
        totalEnergy += response[key].value;
        let dataItem = {};
        dataItem.x = response[key].dateTime;
        dataItem.y = response[key].value;
        data.push(dataItem);
      }
      this.setState({ energyFilt: Object.assign({}, this.state.energyFilt, { data }),
        totalEnergy: totalEnergy }, () => {
      });
    });
  }

  //获取域状态参数
  getStatusDataByDomainId(id) {
    getDomainStatusByDomainId(id, (response) => {
      let { domainStatus } = this.state;
      domainStatus = [];
      for (var i = 0; i < response.length; i++) {
        switch (response[i].variable) {
        case 'deviceTotal':
          domainStatus.deviceTotal = response[i].value;
          break;
        case 'deviceOnlineRunning':
          domainStatus.deviceOnlineRunning = response[i].value;
          break;
        case 'deviceOnlineError':
          domainStatus.deviceOnlineError = response[i].value;
          break;
        case 'deviceOffline':
          domainStatus.deviceOffline = response[i].value;
          break;
        case 'planTotal':
          domainStatus.planTotal = response[i].value;
          break;
        case 'palnSuccess':
          domainStatus.palnSuccess = response[i].value;
          break;
        case 'planFail':
          domainStatus.planFail = response[i].value;
          break;
        case 'lightTotal':
          domainStatus.lightTotal = response[i].value;
          break;
        case 'lightOnPercent':
          domainStatus.lightOnPercent = response[i].value;
          break;
        case 'lighton':
          domainStatus.lighton = response[i].value;
          break;
        case 'lightOff':
          domainStatus.lightOff = response[i].value;
          break;
        default:
          return 1;
        }

      }
      domainStatus.domainId = response[0].domainId;
      this.setState({ domainStatus: domainStatus });
    });
  }


  domainSelect(event) {
    let { domainList, type } = this.state;
    let index = event.target.selectedIndex;
    domainList.index = index;
    domainList.id = domainList.options[index].id;
    domainList.value = domainList.options[index].name;
    this.setState({ domainList: domainList });
  }

  onClick() {
    let domainId = this.state.domainList.id;
    let type = this.state.type;
    this.getEnergyDataByIdAndType(domainId, type);
    this.getStatusDataByDomainId(domainId);
  }

  energySelect(event) {
    let { energyList, type } = this.state;
    let index = event.target.selectedIndex;
    type = energyList.options[index].type;
    energyList.index = index;
    energyList.value = energyList.options[index].name;
    this.setState(Object.assign({}, { energyList }, { type }), () => {
      let domainId = this.state.domainList.id;
      let type = this.state.type;
      this.getEnergyDataByIdAndType(domainId, type);
    });
  }

  destroyBarChart() {
    this.barchart.destroy();
  }

  destroyPieChart() {
    this.piechart.destroy();
    let list = this.state.piechartList;
    for (let key in list) {
      let curPie = list[key];
      curPie.destroy();
    }
  }

  renderChart(ref) {
    const { domainStatus } = this.state;

    if (ref == null) {
      this.destroyBarChart();
      this.destroyPieChart();
    } else {
      let data = {};
      let refId = ref && ref.id;
      if (refId == 'energyStatistics') {
        const { energyFilt } = this.state;
        let data = energyFilt.data;
        this.drawChart(ref, data);
      } else if (refId == 'deviceState') {
        // data = [5, 6, 3, 2];
        data = [domainStatus.deviceOnlineRunning ? domainStatus.deviceOnlineRunning : 0,
          domainStatus.deviceOnlineError ? domainStatus.deviceOnlineError : 0,
          domainStatus.deviceOffline ? domainStatus.deviceOffline : 0,
        ];
        this.drawChart(ref, data);
      } else if (refId == 'planState') {
        // data = [8, 4];
        data = [domainStatus.palnSuccess ? domainStatus.palnSuccess : 0,
          domainStatus.planFail ? domainStatus.planFail : 0];
        this.drawChart(ref, data);
      } else if (refId == 'lightState') {
        // data = [9, 2];
        data = [domainStatus.lightOnPercent ? (domainStatus.lightOnPercent) * 100 : 0,
          (1 - domainStatus.lightOnPercent) ? (1 - domainStatus.lightOnPercent) * 100 : 100,
        ];
        // console.log("data:", data);
        this.drawChart(ref, data);
      } else {
        return;
      }
    }
  }


  drawChart(ref, data) {
    if (ref.id == 'energyStatistics') {
      this.barchart = new BarChart({
        wrapper: ref,
        width:ref.parentNode.offsetWidth,
        // width:ref.clientWith,
        // wrapper: ref.parentNode,
        data: data,
        type: this.state.type,
      });
    } else {
      let box = document.getElementById('pieBox');
      let boxLeftwidth = box.offsetWidth * 0.125;
      // console.log("boxLeftwidth:", boxLeftwidth)
      this.piechart = new PieChart({
        wrapper: ref,
        data: data,
        width: boxLeftwidth,
        height:'170',        
      });
      this.piechart && this.state.piechartList.push(this.piechart);
    }
  }
  updatePieChart() {

  }

  updateBarChart() {

  }
  render() {
    const { domainList, energyList, domainStatus } = this.state;
    return (
      <Content>
        <div className="heading">
          <Select className="sort" id="domain" valueField={domainList.valueField} titleField={domainList.titleField}
            value={domainList.value} options={domainList.options} onChange={this.domainSelect} />
          <button className="btn btn-primary" onClick={this.onClick}>应用</button>
        </div>

        <div className="energy-container panel panel-default">
          <div className="energy-container-header panel-heading">能耗图
          <Select className="sort" id="energy" valueField={energyList.valueField} titleField={energyList.titleField}
            value={energyList.value} options={energyList.options} onChange={this.energySelect} />
          </div>
          <div className="row panel-body lightenergychart">
            <div className="col-sm-9 col-xs-9">
              <div id="energyStatistics" className="energyChart" ref={ref => { this.renderChart(ref); }}></div>
            </div>
            <div className="col-sm-3 col-xs-3">
              <div className="energyInfo">
                <div className="fontbold font">域： <span>{`${this.state.domainList.value}`}</span></div>
                <div className="fontbold font">设备总能耗：<span>{`${this.state.totalEnergy}KWh`}</span></div>
              </div>
            </div>
          </div>
        </div>
        <div className="state-container">
          <div className="row" id="pieBox" >
            <div className="col-sm-4 col-xs-4">
              <div className=" panel">
                <div className="panel-heading">设备状态图
                </div>
                <div className="panel-body statecircle1 ">
                  <div className="boxLeft">
                    <div id="deviceState" className="circle" ref={ref => { this.renderChart(ref); }}></div>
                  </div>
                  <div className="boxRight">
                    <div className="stateInfo">
                      <div className="fontbold font">域： <span>{`${this.state.domainList.value}`}</span></div>
                      <div className="fontbold font">设备数：<span>
                        {`${domainStatus.deviceTotal ? domainStatus.deviceTotal : '未读取'}`}</span></div>
                      <div className="dot color1"></div><div className="font">在线正常数：<span>
                        {`${domainStatus.deviceOnlineRunning ? domainStatus.deviceOnlineRunning : '未读取'}`}</span></div>
                      <div className="dot color2"></div><div className="font">在线故障数：<span>
                        {`${domainStatus.deviceOnlineError ? domainStatus.deviceOnlineError : '未读取'}`}</span></div>
                      <div className="dot color3"></div><div className="font">离线数：<span>
                        {`${domainStatus.deviceOffline ? domainStatus.deviceOffline : '未读取'}`}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-4 col-xs-4">
              <div className=" panel">
                <div className="panel-heading">计划执行状态
                </div>
                <div className="panel-body statecircle2">
                  <div className="boxLeft">
                    <div id="planState" className="circle" ref={ref => { this.renderChart(ref); }}></div>
                  </div>
                  <div className="boxRight">
                    <div className="stateInfo">
                      <div className="fontbold font">域： <span>{`${this.state.domainList.value}`}</span></div>
                      <div className="fontbold font">计划数：<span>
                        {`${domainStatus.planTotal ? domainStatus.planTotal : '未读取'}`}</span></div>
                      <div className="dot color1"></div><div className="font">成功计划数：<span>
                        {`${domainStatus.palnSuccess ? domainStatus.palnSuccess : '未读取'}`}</span></div>
                      <div className="dot color2"></div><div className="font">失败计划数：<span>
                        {`${domainStatus.planFail ? domainStatus.planFail : '未读取'}`}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-4 col-xs-4">
              <div className=" panel">
                <div className="panel-heading">亮灯率</div>
                <div className="panel-body statecircle3">
                  <div className="boxLeft">
                    <div id="lightState" className="circle" ref={ref => { this.renderChart(ref); }}></div>
                  </div>
                  <div className="boxRight">
                    <div className="stateInfo">
                      <div className="fontbold font">域：<span>{`${this.state.domainList.value}`}</span></div>
                      <div className="fontbold font">亮灯率：<span>{domainStatus.lightOnPercent ? 
                        domainStatus.lightOnPercent * 100 + '%' : '未读取'}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Content>
    );
  }
}