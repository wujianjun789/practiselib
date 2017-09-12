/**
 * Created by a on 2017/8/16.
 */
import LineAreaChart from '../../common/util/LineAreaChart'
export function timeStrategy(data) {
    var svg_width = 1100;
    var energy = document.getElementById(data.id);
    if(energy){
        svg_width = energy.parentNode.offsetWidth;
    }

    let lineAreaChart = new LineAreaChart(data.id, {
        id:'timeStrategy',
        w: svg_width,
        h: 180,
        margin: {top:15, right:10, bottom:15,left:10},
        label: "亮度",
        style: {fill:'none',width:1, color:'#000000', opacity:1},
        yMin: 0,
        yMax: 100,
        data: data.data,
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