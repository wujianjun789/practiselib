/**
 * Created by a on 2017/9/8.
 */
import TMLineChart from './TMLineChart'
import {getObjectByKey} from '../../util/index'
import {DeepCopy} from '../../util/algorithm'
import {getMomentDate, momentDateFormat} from '../../util/time'

let curChartList = [];
export function drawCur(id, chartData) {
    let curChart = getObjectByKey(curChartList, 'id', id);
    let data = DeepCopy(chartData.list);
    if(curChart){
        curChart.update({
            min_y: chartData.min,
            max_y: chartData.max,
            data: data
        });
    }else{
        curChart = new TMLineChart(id, {
            id:id,
            w: chartData.width,
            h: chartData.height,
            margin: {top: 10, right: 5, bottom: 10, left: 5},
            min_y: chartData.min,
            max_y: chartData.max,
            data:data
        })

        curChartList.push(curChart);
    }
}

export function destroyChart() {
    for(let key in curChartList){
        let curChart = curChartList[key];
        curChart.destroy();
    }
    curChartList = [];
}

export const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export function getCurDate(minValue) {
    let list = []

    let lastDate = new Date().getTime()-9*1000;
    for(var i=0;i<10;i++){
        list.push({x:momentDateFormat(getMomentDate(lastDate+i*1000), TIME_FORMAT), y:''})
    }

    return list;
}