/**
 * Created by a on 2017/8/16.
 */
import LineAreaChart from './LineAreaChart';
import LineChart from './LineChart';

export function timeStrategy(id, strategy, h = 180) {
    var svg_width = 1100;
    var energy = document.getElementById(id);
    if(energy){
        svg_width = energy.parentNode.offsetWidth;
    }

    let IsStart = false;
    let IsEnd = false;
    let chartList = strategy.map(stra=>{
        if(stra.condition.time.indexOf("00:00")>-1){
            IsStart = true;
        }

        if(stra.condition.time.indexOf("24:00")>-1){
            IsEnd = true;
        }
        return {x:stra.condition.time, y:stra.rpc.brightness}
    })

    if(!IsStart){
        chartList.unshift({x:"00:00", y:0});
    }
    if(!IsEnd){
        chartList.push({x:"24:00", y:0});
    }

    let lineAreaChart = new LineAreaChart(id, {
        id: id,
        w: svg_width,
        h: h,
        margin: {top:0, right:10, bottom:15,left:10},
        label: "亮度",
        style: {fill:'none',width:1, color:'#000000', opacity:1},
        yMin: 0,
        yMax: 100,
        data: chartList,
        xAccessor:d=>d.x,
        yAccessor:d=>{
            if(d.y=="关"){
                return 0;
            }

            return d.y;
        }
    })

    return lineAreaChart;
}


export function sensorStrategy(ref, data, sensorTypeDefault) {
    let sensorType = "windSpeed"
    if(data.length){
        let node = data[0]
        for(let key in node.condition){
            sensorType = key;
            break;
        }
    }
    let chart = new LineChart({
        wrapper: ref,
        data: {values: data},
        xAccessor: d=>d.condition[ sensorType ],
        yAccessor: d => {
            if (d.rpc.value=='off') {
                return 0;
            } else if (d.rpc.value=='on') {
                return 1;
            } else {
                return d.rpc.value;
            }
        },
        yDomain: data.asset == "lc" ? [0, 100] : [0, 100],
        curveFactory: d3.curveStepAfter,
        tickFormat: d => `${d}${sensorTypeDefault[sensorType]?sensorTypeDefault[sensorType].unit:''}`,
        padding: {left: 10, top: 10, right: 35, bottom: 35},
        tooltipAccessor: d => d.rpc.title
    });

    return chart;
}
