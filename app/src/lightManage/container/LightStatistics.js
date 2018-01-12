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
import { getMomentDate, momentDateFormat } from '../../util/time';

import { injectIntl, FormattedMessage } from 'react-intl';

export default class LightStatistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            energy: {
                dayEnergy: {
                    id: 'dayEnergy',
                    title: 'index_hour',
                    data: [
                        { x: '1时', y: 10 },
                        { x: '2时', y: 12 },
                        { x: '3时', y: 13 },
                        { x: '4时', y: 14 },
                    ],

                },
                monthEnergy: {
                    id: 'monthEnergy',
                    title: 'index_day',
                    data: [
                        { x: '1日', y: 160 },
                        { x: '2日', y: 150 },
                        { x: '3日', y: 130 },
                        { x: '4日', y: 140 },

                    ]
                },
                yearEnergy: {
                    id: 'yearEnergy',
                    title: 'index_month',
                    data: [
                        { x: 'January', y: 2320 },
                        { x: 'February', y: 2520 },
                        { x: 'March', y: 2640 },
                        { x: 'April', y: 2840 },
                    ]
                }
            },
            curEnergy: 'dayEnergy', //默认显示列表第一项对应的能源消耗
            energyList: {
                titleField: 'name',
                valueField: 'name',
                options: ["dayEenergy", "monthEnergy", "yearEnergy"]
            },
            domainList: {
                titleField: 'name',
                valueField: 'name',
                options: []
            },
            piechartList: [],
        };

        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.renderChart = this.renderChart.bind(this);
        this.drawChart = this.drawChart.bind(this);
        this.destroyBarChart = this.destroyBarChart.bind(this);
        this.destroyPieChart = this.destroyPieChart.bind(this);
        this.updateEnergyData = this.updateEnergyData.bind(this);
        this.updatePieChart = this.updatePieChart.bind(this);
    }

    componentWillMount() {
    }
    componentDidMount() {
        const actions = this.props.actions;
        this.initData();

    }
    componentDidUpdate() {

    }
    componentWillUnmount() {
        // this.destroyBarChart();
        // destroyPieChart();
    }

    initData() {

    }

    updateEnergyData() { //根据选择框里面的选项刷新能耗图表

    }

    onClick() {

    }

    onChange(e) {
        const { id, value } = e.target;
        switch (id) {
            case 'domain':
                let curDomain = this.state.domainList.options[e.target.selectIndex];
                this.setState({ curDomain }, this.updateDeviceData);
                break;
            case 'energy':
                let curEnergy = this.state.energyList.options[e.taret.selectIndex];
                this.setState({ curEnergy }, this.updateEnergyData);
                break;
            default:
                return state;
        }
    }



    destroyBarChart() {
        this.barchart.destroy();
    }

    destroyPieChart() {
        this.piechart.destroy();
        let list = this.state.piechartList;
        for( let key in list ) {
            let curPie = list[key];
            curPie.destroy();
        }
    }

    renderChart(ref) {
        if(ref==null){
            this.destroyBarChart();
            this.destroyPieChart();
        } else {
            let data = {};
            let refId = ref && ref.id;
            if (refId == "energyStatistics") {
                const { curEnergy } = this.state;
                switch (curEnergy) {
                    case 'dayEnergy':
                        data = this.state.energy.dayEnergy;
                        break;
                    case 'monthEnergy':
                        data = this.state.energy.monthEnergy;
                        break;
                    case 'yearEnergy':
                        data = this.state.energy.yearEnergy;
                        break;
                    default: console.log("传入的参数不正确");
                }
                this.drawChart(ref, data)
            } else if (refId == "deviceState") {
                data = [5, 6, 3, 2];
                this.drawChart(ref, data);
            } else if (refId == "planState") {
                data = [8, 4];
                this.drawChart(ref, data);
            } else if (refId == "lightState") {
                data = [9, 2];
                this.drawChart(ref, data);
            } else {
                return;
            }
        }
    }


    drawChart(ref, data) {

        if (ref.id == "energyStatistics") {
            this.barchart = new BarChart({
                wrapper: ref,
                data: data
            });
        } else {
            this.piechart = new PieChart({
                wrapper: ref,
                data: data
            });
            this.piechart && 
            this.state.piechartList.push(this.piechart);
        }
        
    }

    updatePieChart() {

    }

    updateBarChart() {

    }









    render() {
        return (
            <Content>
                <div className="heading">
                    <Select className="sort" id='domain' data={''} onChange={(selectIndex) => this.onChange(selectIndex)}></Select>
                    <button className="btn btn-primary" >应用</button>
                </div>

                <div className="energy-container panel panel-default">
                    <div className="energy-container-header panel-heading">能耗图
                        <Select className="sort" id='energy' data={''} onChange={(selectIndex) => this.onChange(selectIndex)}
                        />
                    </div>
                    <div className="panel-body lightenergychart">
                        <div id="energyStatistics" className="energyChart" ref={ref => {this.renderChart(ref)}}></div>
                        <div className="energyInfo">
                            <div className="fontbold font">域： <span> 中国</span></div>
                            <div className="fontbold font">设备总能耗：</div>
                        </div>
                    </div>
                </div>
                <div className="state-container">
                    <div className="col-sm-4">
                        <div className=" panel">
                            <div className="panel-heading">设备状态图
                            </div>
                            <div className="panel-body statecircle1 ">
                                <div id="deviceState" className="circle" ref={ref => { this.renderChart(ref) }}></div>
                                <div className="stateInfo">
                                    <div className="fontbold font">域： <span> 中国</span></div>
                                    <div className="fontbold font">设备数：</div>
                                    <div className="dot color1"></div><div className="font">在线正常数：</div>
                                    <div className="dot color2"></div><div className="font">在线故障数：</div>
                                    <div className="dot color3"></div><div className="font">离线数：</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className=" panel">
                            <div className="panel-heading">计划执行状态
                            </div>
                            <div className="panel-body statecircle2">
                                <div id="planState" className="circle" ref={ref => { this.renderChart(ref) }}></div>
                                <div className="stateInfo">
                                    <div className="fontbold font">域： <span> 中国</span></div>
                                    <div className="fontbold font">计划数：</div>
                                    <div className="dot color1"></div><div className="font">成功计划数：</div>
                                    <div className="dot color2"></div><div className="font">失败计划数：</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className=" panel">
                            <div className="panel-heading">亮灯率
                            </div>
                            <div className="panel-body statecircle3">
                                <div id="lightState" className="circle" ref={ref => { this.renderChart(ref) }}></div>
                                <div className="stateInfo">
                                    <div className="fontbold font">域： <span> 中国</span></div>
                                    <div className="fontbold font">亮灯率：</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Content>
        )
    }
}