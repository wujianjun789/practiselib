import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import DrawChart from '../util/multiLineChartWithZoomAndBrush';

export default class Chart extends PureComponent {
   /* static propTypes = {
        start: PropTypes.object,
        end: PropTypes.object,
        data: PropTypes.array
    }*/
    componentWillMount() {
        this._isMounted = true;
        this.chart = null;
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.updateLineChart(nextProps);
        }
    }
    //d3图表
    drawLineChart = (node) => {
        const { start, end, unit, yMax = 100 } = this.props;
        this.chart = new DrawChart({
            wrapper: node,
            data: [],
            //eslint-disable-next-line
            xAccessor: d => d3.timeParse('%Y-%m-%dT%H:%M:%S.%LZ')(d.timestamp),
            yAccessor: d => d.value,
            xDomain: [start, end],
            yDomain: [0, yMax],
            curveFactory: d3.curveStepAfter,//eslint-disable-line
            yTickFormat: d => { if (d === 0) return ''; return `${d}`; },
            tooltipAccessor: d => d.y
        });
    }

    updateLineChart = (props) => {
        const { data, start, end } = props;
        this.chart.updateChart(data, [start, end]);
    }

    destroyLineChart = () => {
        this.chart.destroy();
        this.chart = null;
    }

    componentWillUnmount() {
        this.destroyLineChart();
        this._isMounted = false;
    }

    //ref的回调函数 只在挂载或卸载的时候调用
    render() {
        return (
            <div class='chart-container' ref={this.drawLineChart}></div>
        );
    }
}


