/** Created By ChrisWen
 *  17/11/21
 *  数字时钟配置文件
 */

/**
 * @param {property}    组件原型
 * @param {timeZone}    时区
 * @param {fontFamily}  字体
 * @param {location}    地区选择
 * @param {dataFormat}  日期格式
 * @param {timeFormat}  时间格式
 * @param {resetBtn}    重置按钮
 * @param {confirmBtn}  应用按钮
 */
const _digitalClock = {
  property:{
    materialName: 'mediaPublish.materialName',
    timeZone: 'mediaPublish.timeZone',
    playTime: 'mediaPublish.playDuration',
    bgColor: 'mediaPublish.bgColor',
    textContent: 'mediaPublish.textContent',
    fontFamily: 'mediaPublish.selectFont',
    fontSize: 'mediaPublish.fontSize',
    fontColor: 'mediaPublish.fontColor',
    locationSet: 'mediaPublish.areaSet',
    dateFormat: 'mediaPublish.dateFormat',
    timeFormat: 'mediaPublish.timeFormat',
    singleShow: 'mediaPublish.singleLine',
    resetBtn: 'mediaPublish.reset',
    confirmBtn: 'mediaPublish.apply'
  },
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
  location:[
    {'上海': 'ShangHai'},
    {'北京': 'BeiJing'}
  ],
  dateFormat:[
    {'农历+年月日': 'Lunar + YMD'}
  ],
  timeFormat:[
    {'农历+年月日': 'Lunar + YMD'}
  ]
 }

 export default _digitalClock;
