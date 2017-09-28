import React, {PureComponent} from 'react';
import Chart from '../../common/util/LineChart';

export default class LineChart extends PureComponent {
	constructor(props) {
		super(props);

		this.chart = null;

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
            data: {values: this.props.sensorParamsList},
            xAccessor: d=>d.condition[ this.props.sensorTransform[this.props.data.sensorType] ],
            yAccessor: d => {
                if (d.rpc.value=='off') {
                    return 0;
                } else if (d.rpc.value=='on') {
                    return 1;
                } else {
                    return d.rpc.value;
                }
            },
            yDomain: this.props.data.controlDevice == 'lc' ? [0, 100] : [0, 1],
            curveFactory: d3.curveStepAfter,
            tickFormat: d => `${d}${this.props.sensorsProps[this.props.data.sensorType]?this.props.sensorsProps[this.props.data.sensorType].unit:''}`,
            padding: {left: 0, top: 35, right: 0},
            tooltipAccessor: d => d.rpc.title
        });
	}

	updateLineChart() {
        const yDomain = this.props.data.controlDevice == 'lc' ? [0, 100] : [0, 1];
        const {sensorParamsList} = this.props;
        this.chart.updateChart({values: sensorParamsList}, undefined, yDomain);
	}

	destroyLineChart() {
        this.chart.destroy();
        this.chart = null;
	}

	render() {
		return <div className="form-group-right" ref={this.drawLineChart}></div>
	}
}
