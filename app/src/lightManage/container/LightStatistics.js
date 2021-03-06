/**
 * created by m on 2018/01/8
 */
import '../../../public/styles/lightManage-statistics.less';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Content from '../../components/Content';
import Select from '../../components/Select.1';
import BarChart from '../utils/barChart';
import PieChart from '../utils/pieChart';

import { getDomainList } from '../../api/domain';
import { getEnergy, getDomainStatusByDomainId } from '../../api/statistics';
import { injectIntl, FormattedMessage } from 'react-intl';
import { getChildDomainList } from '../../api/domain';

export class LightStatistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color1:['#FE929E', '#FF9F02', '#FE3E5B'],
      // color1:['#4169E1', '#C0C0C0', '#FF6347'],
      // color1:['#00bcff', '#d3d8dd', '#ff5c68'],
      color2:['#3BCCFF', '#39A7FE'],
      color3:['#645FFF'],
      energyOption: 'month',
      energyFilt: {
        id: '',
        title: '',
        data: [
          // { x: '2018-04-01T00:00:00.000Z', y: 160 },
          // { x: '2018-04-02T00:00:00.000Z', y: 130 },
          // { x: '2018-04-03T00:00:00.000Z', y: 130 },
          // { x: '2018-04-04T00:00:00.000Z', y: 140 },
          // { x: '2018-04-05T00:00:00.000Z', y: 120 },
          // { x: '2018-04-06T00:00:00.000Z', y: 150 },
          // { x: '2018-04-07T00:00:00.000Z', y: 130 },
          // { x: '2018-04-08T00:00:00.000Z', y: 140 },
          // { x: '2018-04-09T00:00:00.000Z', y: 130 },
          // { x: '2018-04-10T00:00:00.000Z', y: 150 },
          // { x: '2018-04-11T00:00:00.000Z', y: 130 },
          // { x: '2018-04-12T00:00:00.000Z', y: 140 },
          // { x: '2018-04-13T00:00:00.000Z', y: 160 },
          // { x: '2018-04-14T00:00:00.000Z', y: 150 },
          // { x: '2018-04-15T00:00:00.000Z', y: 130 },
          // { x: '2018-04-16T00:00:00.000Z', y: 130 },
          // { x: '2018-04-17T00:00:00.000Z', y: 140 },
          // { x: '2018-04-18T00:00:00.000Z', y: 120 },
          // { x: '2018-04-19T00:00:00.000Z', y: 120 },
          // { x: '2018-04-20T00:00:00.000Z', y: 120 },
          // { x: '2018-04-21T00:00:00.000Z', y: 150 },
          // { x: '2018-04-22T00:00:00.000Z', y: 130 },
          // { x: '2018-04-23T00:00:00.000Z', y: 130 },
          // { x: '2018-04-24T00:00:00.000Z', y: 130 },
          // { x: '2018-04-25T00:00:00.000Z', y: 140 },
          // { x: '2018-04-26T00:00:00.000Z', y: 140 },
          // { x: '2018-04-27T00:00:00.000Z', y: 140 },
          // { x: '2018-04-28T00:00:00.000Z', y: 160 },
          // { x: '2018-04-29T00:00:00.000Z', y: 150 },
          // { x: '2018-04-30T00:00:00.000Z', y: 190 },
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
          // id: '',
          // domainId: '1',
          // deviceTotal: '100', deviceOnlineRunning: '90', deviceOnlineError: '3', deviceOffline: '7',
          // planTotal: '25', palnSuccess: '23', planFail: '2',
          // lightTotal: '180', lightOnPercent: '0.95', lighton: '195', lightOff: '10',
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
    this.formatIntl = this.formatIntl.bind(this);
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

  formatIntl(formatId) {
    const {intl} = this.props;
    return intl ? intl.formatMessage({id:formatId}) : null;
    // return formatId;
  }

  initData() {
    // getDomainList(data => {
    //   console.log("domaindata:", data)
    //   this.mounted && this.updateDomainData(data);
    // });
    getChildDomainList(data => {
      console.log("childdomaindata:", data)
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
      if (response.length !== 0) {
        data = [];
        for (var key in response) {
          totalEnergy += response[key].value;
          let dataItem = {};
          dataItem.x = response[key].dateTime;
          dataItem.y = response[key].value;
          data.push(dataItem);
        }
      };
      this.setState({
        energyFilt: Object.assign({}, this.state.energyFilt, { data }),
        totalEnergy: totalEnergy
      }, () => {
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
    this.setState({ energyOption: event.target.id });
    let id = event.target.id;
    let { energyList, type } = this.state;
    let index = 1;
    switch (id) {
      case 'year':
        index = '0';
        break;
      case 'month':
        index = '1';
        break;
      case 'day':
        index = '2';
        break;
    }
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
    const { domainStatus,color1, color2, color3 } = this.state;
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
        this.drawChart(ref, data, color1);
      } else if (refId == 'planState') {
        // data = [8, 4];
        data = [domainStatus.palnSuccess ? domainStatus.palnSuccess : 0,
        domainStatus.planFail ? domainStatus.planFail : 0];
        this.drawChart(ref, data, color2);
      } else if (refId == 'lightState') {
        // data = [9, 2];
        data = [domainStatus.lightOnPercent ? (domainStatus.lightOnPercent) * 100 : 0,
        (1 - domainStatus.lightOnPercent) ? (1 - domainStatus.lightOnPercent) * 100 : 0,
        ];
        // console.log("data:", data);
        let showText=true
        this.drawChart(ref, data, color3,showText);
      } else {
        return;
      }
    }
  }


  drawChart(ref, data, color,showText) {
    if (ref.id == 'energyStatistics') {
      this.barchart = new BarChart({
        wrapper: ref,
        width: ref.parentNode.offsetWidth,
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
        height: '170',
        color:color,
        showText:showText,
      });
      this.piechart && this.state.piechartList.push(this.piechart);
    }
  }
  updatePieChart() {

  }

  updateBarChart() {

  }
  render() {
    const { domainList, energyList, domainStatus, energyOption } = this.state;
    return (
      <Content>
        <div className="heading">
          <Select className="sort" id="domain" valueField={domainList.valueField} titleField={domainList.titleField}
            value={domainList.value} options={domainList.options} onChange={this.domainSelect} />
          {/* <button className="btn btn-primary" onClick={this.onClick}>应用</button> */}
        </div>

        <div className="energy-container panel panel-default">
          <div className="energy-container-header panel-heading">{this.formatIntl('lightManage.Statistics.energy')}
          <div className="timeSelect">
              <button className={`timeSelectItem ${energyOption == 'day' ? 'selected' : ''}`} id="day" onClick={this.energySelect}>{this.formatIntl('lightManage.Statistics.day')}</button>
              <button className={`timeSelectItem ${energyOption == 'month' ? 'selected' : ''}`} id="month" onClick={this.energySelect}>{this.formatIntl('lightManage.Statistics.month')}</button>
              <button className={`timeSelectItem ${energyOption == 'year' ? 'selected' : ''}`} id="year" onClick={this.energySelect}>{this.formatIntl('lightManage.Statistics.year')}</button>
            </div>
            {/* <Select className="sort" id="energy" valueField={energyList.valueField} titleField={energyList.titleField}
              value={energyList.value} options={energyList.options} onChange={this.energySelect} /> */}
          </div>
          <div className="row panel-body lightenergychart">
            <div className="col-sm-9 col-xs-9">
              <div id="energyStatistics" className="energyChart" ref={ref => { this.renderChart(ref); }}></div>
            </div>
            <div className="col-sm-3 col-xs-3">
              <div className="energyInfo">
                <div className="fontbold font">{this.formatIntl('lightManage.Statistics.domain')}： <span>{`${this.state.domainList.value}`}</span></div>
                <div className="fontbold font">{this.formatIntl('lightManage.Statistics.totalEnergy')}：<span>{`${this.state.totalEnergy}KWh`}</span></div>
              </div>
            </div>
          </div>
        </div>
        <div className="state-container">
          <div className="row" id="pieBox" >
            <div className="col-sm-4 col-xs-4">
              <div className=" panel">
                <div className="panel-heading">{this.formatIntl('lightManage.Statistics.deviceState')}
                </div>
                <div className="panel-body statecircle1 ">
                  <div className="boxLeft">
                    <div id="deviceState" className="circle" ref={ref => { this.renderChart(ref); }}></div>
                  </div>
                  <div className="boxRight">
                    <div className="stateInfo">
                      <div className="fontbold font">{this.formatIntl('lightManage.Statistics.domain')}： <span>{`${this.state.domainList.value}`}</span></div>
                      <div className="fontbold font">{this.formatIntl('lightManage.Statistics.deviceCount')}：<span>
                        {`${domainStatus.deviceTotal ? domainStatus.deviceTotal : ''}`}</span></div>
                      <div className="dot color11"></div><div className="font">{this.formatIntl('lightManage.Statistics.deviceOnlineRunning')}：<span>
                        {`${domainStatus.deviceOnlineRunning ? domainStatus.deviceOnlineRunning : ''}`}</span></div>
                      <div className="dot color12"></div><div className="font">{this.formatIntl('lightManage.Statistics.deviceOnlineError')}：<span>
                        {`${domainStatus.deviceOnlineError ? domainStatus.deviceOnlineError : ''}`}</span></div>
                      <div className="dot color13"></div><div className="font">{this.formatIntl('lightManage.Statistics.deviceOffline')}：<span>
                        {`${domainStatus.deviceOffline ? domainStatus.deviceOffline : ''}`}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-4 col-xs-4">
              <div className=" panel">
                <div className="panel-heading">{this.formatIntl('lightManage.Statistics.planState')}
                </div>
                <div className="panel-body statecircle2">
                  <div className="boxLeft">
                    <div id="planState" className="circle" ref={ref => { this.renderChart(ref); }}></div>
                  </div>
                  <div className="boxRight">
                    <div className="stateInfo">
                      <div className="fontbold font">{this.formatIntl('lightManage.Statistics.domain')}： <span>{`${this.state.domainList.value}`}</span></div>
                      <div className="fontbold font">{this.formatIntl('lightManage.Statistics.planCount')}：<span>
                        {`${domainStatus.planTotal ? domainStatus.planTotal : ''}`}</span></div>
                      <div className="dot color21"></div><div className="font">{this.formatIntl('lightManage.Statistics.palnSuccess')}：<span>
                        {`${domainStatus.palnSuccess ? domainStatus.palnSuccess : ''}`}</span></div>
                      <div className="dot color22"></div><div className="font">{this.formatIntl('lightManage.Statistics.planFail')}：<span>
                        {`${domainStatus.planFail ? domainStatus.planFail : ''}`}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-4 col-xs-4">
              <div className=" panel">
                <div className="panel-heading">{this.formatIntl('lightManage.Statistics.lightOn')}</div>
                <div className="panel-body statecircle3">
                  <div className="boxLeft">
                    <div id="lightState" className="circle" ref={ref => { this.renderChart(ref); }}></div>
                  </div>
                  <div className="boxRight">
                    <div className="stateInfo">
                      <div className="fontbold font">{this.formatIntl('lightManage.Statistics.domain')}：<span>{`${this.state.domainList.value}`}</span></div>
                      <div className="fontbold font">{this.formatIntl('lightManage.Statistics.lightOn')}：<span>{domainStatus.lightOnPercent ?
                        domainStatus.lightOnPercent * 100 + '%' : ''}</span></div>
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


function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(LightStatistics));