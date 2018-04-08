import echarts from 'echarts'

export default {
    tooltip: {
        trigger: 'axis',
        position: function (pt) {
            return [pt[0], '30%'];
        },
        padding: 5
    },
    title: {
        left: '49%',
        top: '40%',
        text: '暂无数据',
        textStyle: {
            align: 'center'
        }
    },
    // toolbox: {
    //     feature: {
    //         dataZoom: {
    //             yAxisIndex: 'none'
    //         },
    //         restore: {},
    //         saveAsImage: {}
    //     }
    // },
    grid: {
        show: true,
        left: 100,
        right: 50,
        top: 40,
        bottom: 90
    },
    xAxis: {
        type: 'time',
        boundaryGap: false,
        splitLine: {
            show: true
        },
        axisLine: { onZero: false },
        // data: []
    },
    yAxis: {
        type: 'value',
        splitLine: {
            show: true
        },
        axisLine: { onZero: false },
        boundaryGap: [0, '100%'],
        axisLabel: {
            formatter: (value) => {
                if (value === 0) { return '' }
                return value
            }
        }
    },
    dataZoom: [{
        type: 'inside',
        start: 0,
        end: 100,
    },
    {
        type: 'slider',
        bottom: 25,
        start: 0,
        end: 0.04,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
        },
        textStyle: {
            color: '#fff'
        }
    }
    ],
    series: [
        {
            type: 'line',
            smooth: true,
            showSymbol: false,
            // symbol: 'none',
            sampling: 'average',
            // step: 'end',
            // itemStyle: {
            //     normal: {
            //         color: 'rgb(255, 70, 131)'
            //     }
            // },
            data: []
        }
    ]
};