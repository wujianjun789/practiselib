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
    materialName: '数字时钟',
    timeZone: '时区',
    playTime: '播放时长',
    bgColor: '背景颜色',
    textContent: '文字内容',
    fontFamily: '选择字体',
    fontSize: '文字大小',
    fontColor: '文字颜色',
    locationSet: '区域设置',
    dateFormat: '日期格式',
    timeFormat: '时间格式',
    singleShow: '单行显示',
    resetBtn: '重置',
    confirmBtn: '应用'
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
