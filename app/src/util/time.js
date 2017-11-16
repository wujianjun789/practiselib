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
 *
 * @param dateString(YYYY-MM-DD)
 * @returns {string}(YYYY年MM月DD日)
 */
export function dateStrReplaceZh(dateString) {
    let zhStr = "";
    if(!dateString){
        return "";
    }

    let strs = dateString.split("-");
    if(strs.length>2){
        zhStr = strs[0]+"年"+strs[1]+"月"+strs[2]+"日";
    }else if(strs.length>1){
        zhStr = strs[0]+"月"+strs[1]+"日";
    }else{
        zhStr = strs[0]+"日";
    }
    return zhStr;
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

/**
 *
 * @param yearStr(格式YYYY-MM-DD HH:mm:ss)
 * @returns {Date}
 */
export function getDateByYear(yearStr) {
    return new Date(yearStr);
}

/**
 *
 * @param year
 * @param month(注意month+1)
 */
export function getDaysByYearMonth(year, month) {
    if(year==0){
        if(month==1 || month==3 || month==5 || month ==7 || month==8 || month==10 || month==12){
            return 31;
        }

        if(month==4 || month==6 || month==9 || month ==11){
            return 30;
        }

        if(month==2){
            return 29;
        }
    }

    let d = getDateByYear(year+"-"+(parseInt(month)+1));
    d.setDate(0);
    return d.getDate();
}

export function getToday() {
	return moment().hour(0).minute(0).second(0).millisecond(0);
}

export function getYesterday() {
	return moment().hour(0).minute(0).second(0).millisecond(0).subtract(1, 'days');
}
