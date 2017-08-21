/**
 * Created by a on 2017/8/16.
 */
import LineAreaChart from './LineAreaChart'
export function timeStrategy(data) {
    var svg_width = 1100;
    var energy = document.getElementById(data.id);
    if(energy){
        svg_width = energy.parentNode.offsetWidth;
    }

    let lineAreaChart = new LineAreaChart(data.id, {
        id:'timeStrategy',
        w: svg_width,
        h: 160,
        margin: {top:20, right:0, bottom:20,left:0},
        label: "亮度",
        style: {fill:'none',width:1, color:'#000000', opacity:1},
        data: data.data
    })

    return lineAreaChart;
}