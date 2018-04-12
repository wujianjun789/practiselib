import React from 'react';
import PropTypes from 'prop-types';
import echarts from 'echarts';

import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

import './style.less';
import option from './option';
export default class CustomChart extends React.Component {
 /* static propTypes = {
    name: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired,
    start: PropTypes.object.isRequired,
    end: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    prompt: PropTypes.string
  };*/
  constructor(props) {
    super(props);
    const { name, unit, start, end, data, prompt } = this.props;
    this.state = {
      name,
      unit,
      start,
      end,
      data,
      prompt
    };
  }
  componentWillMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidMount() {
    this.myChart = echarts.init(document.getElementById('custom-chart'));
    window.onresize = this.myChart.resize; //添加图表响应式
    this.draw();
  }
  componentWillReceiveProps(nextProps) {
    const { name, unit, start, end, data, prompt } = this.props;
    /* 注意：此处后续需要修改 */
    if (data !== this.props.data) {
      this.setState({ name, unit, start, end, data, prompt }, this.draw);
    }
  }
  componentDidUpdate() {
    setTimeout(() => {
      if (this.customChart) {
        if (
          this.customChart.clientWidth !== this.initialWidth ||
          this.customChart.clientHeight !== this.initialHeight
        ) {
          this.initialWidth = this.customChart.clientWidth;
          this.initialHeight = this.customChart.clientHeight;
          this.myChart.resize();
        }
      }
    }, 300);
  }
  getChartContainer = ele => {
    if (this._isMounted) {
      this.customChart = ele;
      this.initialWidth = this.customChart.clientWidth;
      this.initialHeight = this.customChart.clientHeight;
    }
  };
  draw = () => {
    let { name, unit, start, end, data, prompt } = this.state;
    // 是否显示标题
    if (data.length) {
      option.title.text = '';
    } else {
      option.title.text = prompt;
      //测试所用数据
      // data = [
      //     { timestamp: '2018-04-02T00:33:06.834Z', value: 20 },
      //     { timestamp: '2018-04-02T04:33:06.834Z', value: 30 },
      //     { timestamp: '2018-04-02T05:33:06.834Z', value: 50 },
      //     { timestamp: '2018-04-02T08:33:06.834Z', value: 60 },
      //     { timestamp: '2018-04-02T10:33:06.834Z', value: 10 },
      //     { timestamp: '2018-04-02T13:33:06.834Z', value: 80 },
      //     { timestamp: '2018-04-02T15:33:06.834Z', value: 20 },
      //     { timestamp: '2018-04-02T21:33:06.834Z', value: 90 },
      //     { timestamp: '2018-04-02T22:33:06.834Z', value: 100 },
      //     { timestamp: '2018-04-02T23:33:06.834Z', value: 20 },
      // ]
      option.yAxis.min = 0;
      option.yAxis.max = 100;
    }

    //提示框
    option.tooltip.formatter = params => {
      return `${params[0].axisValueLabel.trim()}<br/>${name}：${
        params[0].value[1]
      } ${unit}`;
    };

    //设置y轴标签文本
    option.yAxis.axisLabel.formatter = value => {
      if (value === 0) {
        return '';
      }
      return `${value}${unit}`;
    };

    //设置x轴最小值、最大值
    option.xAxis.min = () => new Date(start._d).getTime();
    option.xAxis.max = () => new Date(end._d).getTime();

    //待渲染数据
    const yData = data.map(item => ({
      value: [item.timestamp, item.value]
    }));

    option.series[0].data = yData;
    this.myChart.setOption(option);
  };

  render() {
    return (
      <div
        id="custom-chart-container"
        class="customchart-container"
        ref={this.getChartContainer}
      >
        <div id="custom-chart" />
      </div>
    );
  }
}
