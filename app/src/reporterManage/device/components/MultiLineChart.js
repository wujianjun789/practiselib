import React, {PureComponent} from 'react';
import Chart from '../../utils/multiLineChart';

export default class MultiLineChart extends PureComponent {
	constructor(props) {
		super(props);
		this.chart = null;
		this.monthIntl = {
			1: 'JAN',
			2: 'FEB',
			3: 'MAR',
			4: 'APR',
			5: 'MAY',
			6: 'JUN',
			7: 'JUL',
			8: 'AUG',
			9: 'SEP',
			10: 'OCT',
			11: 'NOV',
			12: 'DEC'
		};

		this.drawLineChart = this.drawLineChart.bind(this);
		this.updateLineChart = this.updateLineChart.bind(this);
		this.destroyLineChart = this.destroyLineChart.bind(this);
	}

	componentDidUpdate() {
		this.updateLineChart();
	}

	componentWillUnmount() {
		this.destroyLineChart();
	}

	drawLineChart(ref) {
        this.chart = new Chart({
            wrapper: ref,
            data: this.props.data,
            xAccessor: d=>d.x,
			yAccessor: d => d.y,
			xDomain: [1, 13],
			yDomain: [0, 100],
            curveFactory: d3.curveStepAfter,
            xTickFormat: d => {if(d == 13) return ''; return this.monthIntl[d];},
            yTickFormat: d => {if(d == 0) return ''; return `${d}%`},
            padding: {left: 40, top: 10, right: 10},
            tooltipAccessor: d => d.y
        });
	}

	updateLineChart() {
        this.chart.updateChart(this.props.data);
	}

	destroyLineChart() {
        this.chart.destroy();
        this.chart = null;
	}

	render() {
		return <div className="chart-container" ref={this.drawLineChart}></div>
	}
}
