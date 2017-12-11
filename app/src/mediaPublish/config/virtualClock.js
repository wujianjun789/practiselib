/** Created By ChrisWen
 *  17/11/21
 *  数字时钟配置文件
 */

/**
 * @param {property}    组件原型
 * @param {timeZone}    时区
 * @param {fontFamily}  字体
 * @param {fontSize}    字体大小
 * @param {type}        时钟类型
 * @param {location}    地区
 * @param {dateFormat}  日期格式
 */
const _virtualClock = {
  property:[],
  timeZone:[
    {'上海': 'ShangHai'},
    {'北京': 'BeiJing'}
  ],
  fontFamily:[
    {'微软雅黑': 'Microsoft YaHei'},
    {'Monaco': 'Monaco'}
  ],
  fontSize:[
    {'大': 'Large'},
    {'中': 'Middle'},
    {'小': 'Small'}
  ],
  type:[
    {'数字': 'digital'}
  ],
  location:[
    {'上海': 'ShangHai'},
    {'北京': 'BeiJing'}
  ],
  dateFormat:[
    {'农历+年月日': 'Lunar + YMD'}
  ],
  initData:{
      name:'模拟时钟',
      playTime:'',
      textContent:'',
      timeZone:'BeiJing',
      title_fontFamily : 'Microsoft YaHei',
      scale_fontFamily : 'Microsoft YaHei',
      split_fontFamily : 'Microsoft YaHei',
      date_fontFamily : 'Microsoft YaHei',
      weekend_fontFamily : 'Microsoft YaHei',
      title_fontSize : 'Large',
      scale_fontSize : 'Middle',
      split_fontSize : 'Middle',
      date_fontSize : 'Middle',
      weekend_fontSize : 'Small',
      fontFamily : 'Microsoft YaHei',
      fontSize : 'Middle',
      location : 'ShangHai',
      dateFormat : 'Lunar + YMD',
      title_color : '#342534',
      fontColor : 'red',
      bg_color : 'pink',
      scale_color : 'yellow',
      split_color : '#778899',
      date_color : '#228877',
      weekend_color : '#445533',
      hour_color : '#0C80F3',
      minute_color : '#29E629',
      second_color : '#E207E2',
      scale_width : '',
      scale_height : '',
      split_width : '',
      split_height : '',
      options: {
        playTime_noticeShow: false,
        scale_width_noticeShow: false,
        scale_height_noticeShow: false,
        split_width_noticeShow: false,
        split_height_noticeShow: false,
        textContent_noticeShow: false
      }
  }
 }

 export default _virtualClock;
