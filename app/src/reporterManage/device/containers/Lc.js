import React, { PureComponent } from 'react'

import Content from '../../../components/Content';

import Chart from '../../utils/multiLineChartWithZoomAndBrush';
import { getYesterday, getToday } from '../../../util/time';

import '../../../../public/styles/reporterManage-device.less';
export default class Lc extends PureComponent {
    state = {
        sidebarCollapse: false,
        startDate: getYesterday(),
        endDate: getToday(),
        currentDomain: null,
        domainList: {
            titleField: 'name',
            valueField: 'name',
            options: []
        },
        search: {
            value: '',
            placeholder: '输入编号或名称'
        },

        deviceList: [],
        selectDeviceIds: [],
        selectDevices: {},
        page: { total: 0, current: 1, limit: 5 }
	}

	//d3图表
    drawLineChart = (node) => {
        const { selectDevices, startDate, endDate } = this.state;
        this.chart = new Chart({
            wrapper: node,
            data: Object.values(selectDevices),
            xAccessor: d => d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ")(d.timestamp),
            yAccessor: d => d.value,
            xDomain: [startDate, endDate],
            yDomain: [0, 100],
            curveFactory: d3.curveStepAfter,
            yTickFormat: d => { if (d == 0) return ''; return `${d}` },
            tooltipAccessor: d => d.y
        })
    }

	//侧边栏展开关闭
	collapseHandler=()=>{
		this.setState({sidebarCollapse:!this.state.sidebarCollapse})
	}

    render() {
        const { sidebarCollapse, startDate, endDate, currentDomain, domainList, search: { value, placeholder },
            deviceList, selectDeviceIds, selectDevices, page: { total, current, limit }, } = this.state;
        return (
            <Content class={`device-lc ${sidebarCollapse ? 'collapse' : ''}`}>
                <div class='content-left'>
                    <div class='chart-container' ref={this.drawLineChart}></div>
                </div>
				<div class={`container-fluid sidebar-info ${sidebarCollapse?'sidebar-collapse':''}`}>
					<div class='row collapse-container' onClick={this.collapseHandler}>
						<span class={sidebarCollapse?'icon_horizontal':'icon_vertical'}></span>
					</div>
				</div>
            </Content>
        )
    }
}