/**
 * created by m on 2018/01/8
 */
// import { intlFormat } from '../util/index';
export default function PieChart(data) {
  let width = data.width ? data.width : data.wrapper.offsetWidth;
  var height = data.height ? data.height : data.wrapper.offsetHeight;
  let dataset = data.data;
  let rate = data.rate?data.rate:'100%'
  let showText = data.showText?true:false
  //当数据为空时，给数据一个默认值，保证图形正常显示
  for (let i=0; i<dataset.length; i++){
    if (i==0&&dataset[i]==0){
      dataset[i]=1;
    }
  }
  let ID = data.wrapper.id;
  // let parent = d3.select(`#${ID}`);
  let parent = d3.select(data.wrapper);
  if (parent == null) {return;}
  var color = d3.scaleOrdinal(data.color?data.color:d3.schemeCategory20);

  var pie = d3.pie()
    .value(function(d, i) { return d; })
    .padAngle(0.03)
    .sort(null);

  var arc = d3.arc()
    .innerRadius(48)
    .outerRadius(58)
    .cornerRadius(20);

  var svg = parent.append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', '0 0 ' + width + ' ' + height)
    .attr('style', 'width:100%')
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

  svg.datum(dataset).selectAll('path')
    .data(pie)
    .enter().append('path')
    .attr('fill', function(d, i) { return color(i); })
    .attr('d', arc)
    .each(function(d) { this._current = d; }); // store the initial angles

  showText&&svg.append('text')
  .attr('x', -40)
  .attr('y', 13)
  .style('fill', color)
  .style('font-size', '35px')
  .style('font-weight', '300')
  .text(rate);
  
  return {
    destroy: function() {
      parent.select('svg').remove();
    },
  };
}