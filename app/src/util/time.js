/**
 * Created by a on 2017/3/13.
 */
import moment from 'moment';
let oldTime;
/**
 * 时间差处理事件
 * @param diff (millisecond)
 * @param callFun
 * @returns {Function}
 */
export function timeDifferent(diff, callFun) {
    let curTime = new Date().getTime();

    if (!oldTime) {
        oldTime = curTime;
    }

    if (curTime - oldTime > diff) {
        oldTime = curTime;
        callFun();
    }else{
        oldTime = curTime;
    }
}

/**
 *
 * @param time (millisecond)
 * @param callFun
 */
let curT;
export function timeDelay(time, callFun) {
    if (curT) {
        clearTimeout(curT);
    }

    curT = setTimeout(()=> {
        callFun && callFun();
    }, time);
}


export function getMomentDate(date, formatStr) {
    return moment(date, formatStr);
}

/**
 * 日期格式化
 * @param date 
 * @param formatStr 
 */
export function momentDateFormat(moment, formatStr='YYYY-MM-DDTHH:mm:ss Z') {
    return moment.format(formatStr);
}