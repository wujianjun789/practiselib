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
  ]
 }

 export default _virtualClock;
