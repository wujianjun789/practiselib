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

export function getMomentUTC(mom) {
    return moment.utc(mom).format();
}

/**
 * 按照规定时间字符串格式化
 * @param value(格式YYYY-MM-DD HH:mm:ss)
 * return moment
 */
export function timeStringConvertComent(value) {
    if(!value)return;

    let d = new Date();
    let yh;
    if(value.indexOf(" ")){
        yh = value.split(" ")
    }else{
        yh = value;
    }

    let yy, hh;
    if(yh.length && yh[0].indexOf("-")){
        yy = yh.split("-");
    }

    if(yh.length==1 && yh[0].indexOf(":")){
        hh = yh[0].split(":");
    }

    if((yh.length==2 && yh[1].indexOf(":"))){
        hh = yh[1].split(":");
    }

    let year;
    let month;
    let date;
    if(yy.length==3){
        year = yy[0]
        month = yy[1]
        date = yy[2]
    }else if(yy.length==2){
        month = yy[0]
        date = yy[1]
    }else if(yy.length){
        date = yy[0]
    }

    let hours;
    let minute;
    let second;
    if(hh.length==3){
        hours = hh[0];
        minute = hh[1];
        second = hh[2];
    }else if(hh.length==2){
        minute = hh[0];
        second = hh[1];
    }else if(hh.length){
        second = hh[0]
    }

    year && d.setYear(year)
    month && d.setMonth(month);
    date && d.setDate(date);
    hours && d.setHours(hours)
    minute && d.setMinutes(minute);
    second && d.setSeconds(second);
    return getMomentDate(d);
}

/**
 * 获取当前时间时分
 * @returns {*}
 */
export function getCurHM() {
    let d = new Date();
    let hours = d.getHours();
    let minute = d.getMinutes();
    return (hours<10?'0'+hours:hours)+':'+(minute<10?'0'+minute:minute);
}