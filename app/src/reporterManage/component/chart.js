import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import DrawChart from '../util/multiLineChartWithZoomAndBrush';

export default class Chart extends PureComponent {
    static propTypes = {
        start: PropTypes.object,
        end: PropTypes.object,
        data: PropTypes.object
    }
    componentWillMount() {
        this.chart = null;
    }

    //d3图表
    drawLineChart = (node) => {
        const { data, start, end } = this.props;
        this.chart = new DrawChart({
            wrapper: node,
            data: Object.values(data),
            xAccessor: d => d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ")(d.timestamp),
            yAccessor: d => d.value,
            xDomain: [start, end],
            yDomain: [0, 100],
            curveFactory: d3.curveStepAfter,
            yTickFormat: d => { if (d === 0) return ''; return `${d}` },
            tooltipAccessor: d => d.y
        })
    }
    getChartData = (cb) => {
    }

    render() {
        return (
            <div class='chart-container' ref={this.drawLineChart}></div>
        )
    }
}


