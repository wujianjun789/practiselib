/**
 * created by m on 2018/01/8
 */
// import { intlFormat } from '../util/index';
export default function BarChart(data) {
  // console.log("柱状体传入的data:", data)
  let ID = data.wrapper.id;
  let parent = d3.select(`#${ID}`);
  if (parent === null) {return;}

  let wrapper = data.wrapper;
  let dataset = data.data;
  let type = data.type;
  // 画布大小
  // let width = 900;
  let width = wrapper.offsetWidth;
  let height = 170;

  //画布周边的空白
  let padding = { left: 0, right: 30, top: 20, bottom: 40 };

  // dataset数据插值,如果没有，设置为零
  if (dataset.length != 0) {
    let yearNum = new Date(dataset[0].x).getFullYear();
    let monthNum = new Date(dataset[0].x).getMonth() + 1;
    let dayNum = new Date(dataset[0].x).getDate();
    // let hoursNum = new Date(dataset[0].x).getHours() - 8;
    let dataFixed = [];
    if (type === '1') {//按年统计12
      dataFixed = [];
      // let month0 = new Date(yearNum,0,1)
      for (let i = 0; i < 12; i++) {
        let item = {};
        item.x = new Date(yearNum, i, 1);
        item.y = 0;
        for (let j = 0; j < dataset.length; j++) {
          if (new Date(dataset[j].x).getMonth() === i) {
            item.y = dataset[j].y;
          }
        }
        dataFixed.push(item);
      }
      dataset = dataFixed;
      // console.log("monthfix:",dataFixed );
    }
    if (type === '2') {//按月统计28,29,30,31
      let day = new Date(yearNum, monthNum + 1, 0);
      let daylength = day.getDate();
      dataFixed = [];
      for (let i = 0; i < daylength; i++) {
        let item = {};
        item.x = new Date(yearNum, monthNum, i + 1);
        item.y = 0;
        for (let j = 0; j < dataset.length; j++) {
          if (new Date(dataset[j].x).getDate() === i + 1) {
            item.y = dataset[j].y;
          }
        }	
        dataFixed.push(item);
        // let day = new Date(yearNum, monthNum, 0);
        // let dateCountdateCount = day.getDate();
      }
      dataset = dataFixed;
    }
    if (type === '3') {//按日统计24
      dataFixed = [];
      for (let i = 0; i < 24; i++) {
        let item = {};
        item.x = new Date(yearNum, monthNum, dayNum, i);
        item.y = 0;
        for (let j = 0; j < dataset.length; j++) {
          if (new Date(dataset[j].x).getHours() - 8 === i) {
            item.y = dataset[j].y;
          }
        }	
        dataFixed.push(item);
      }
      dataset = dataFixed;
    }
  }
	
  //定义一个数组日，月，年，
  // let dataset = [10, 20,32, 5, 30,  12, 5, 10, 40, 24, 20, 33, 10, 40, 33, 24, 30, 40, 33, 24, 12, 5];
  // let dataset = [10, 40, 33, 24, 20,12, 5,32, 5, 10, 40,33, 24, 20, 33, 10, 40, 33, 24, 30, 40, 33, 24, 12, 5];
  // dataset = [{x:3, y: 10},{x:4, y: 20},{x:5, y: 14},{x:6, y: 15},{x:7, y: 12},{x:8, y: 17},{x:9, y: 14}];
  // let dataset = data	
  //x轴的比例尺
  let xScale = d3.scaleBand()
    .domain(d3.range(dataset.length))
    // .domain(['一月', '二月','一月', '二月','一月', '二月','一月', '二月','一月', '二月'])
    .range([0, width - padding.left - padding.right]);
  //y轴的比例尺
  let yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, function(d) {
      return d.y;
    })])
    .range([height - padding.top - padding.bottom, 0]);

  //定义x轴,这里的d 和 i 有什么差别呢？
  let xAxis = d3.axisBottom(xScale)
    .tickFormat(function(d, i) {
      let month = new Date(dataset[d].x).getMonth() + 1;
      let day = new Date(dataset[d].x).getDate();
      let hours = new Date(dataset[d].x).getHours();
      let time = '';
      switch (type) {
      case '1':
        time = `${month}月`;
        break;
      case '2':
        time = `${day}日`;
        break;
      case '3':
        time = `${hours}时`;
        break;
      default:
        break;
      }
      return time;
    })
    .tickSizeInner(0)
    .tickSizeOuter(0);
  // .ticks(5,'s')
  // .tickValues([0,5,10,15,20,25,30]);//添加刻度

  //定义y轴
  // let yAxis = d3.axisLeft(yScale)
  // .scale(yScale)
  // .orient("left");

  //添加tips
  let tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset(function() {
      return [-10, 0];
    })
    .html(function(d) {
      return `能耗：<span style='color:#eee'>${d.y}kWh</span>`;
    });

  //在 body 里添加一个 SVG 画布	
  let svg = parent.append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(10,10)');

  //调用tips    
  svg.call(tip);

  //矩形之间的空白,根据数据长度，设定不同宽度
  let rectPadding = 10;
  if (dataset.lenght != 0) {
    rectPadding = 300 / dataset.length;
  }

  //添加矩形元素
  svg.selectAll('.MyRect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('class', 'MyRect')
    .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
    .attr('x', function(d, i) {
      return xScale(i) + rectPadding / 2;
    })
    .attr('y', function(d) {
      return yScale(d.y);
    })
    .attr('width', xScale.bandwidth() - rectPadding)
    .attr('height', function(d) {
      return height - padding.top - padding.bottom - yScale(d.y);
    })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);

  //添加文字元素
  //let texts = svg.selectAll('.MyText')
  svg.selectAll('.MyText')
    .data(dataset)
    .enter()
    .append('text')
    .attr('class', 'MyText')
    .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
    .attr('x', function(d, i) {
      return xScale(i) + rectPadding / 2;
    })
    .attr('y', function(d) {
      return yScale(d.y);
    })
    .attr('dx', function() {
      return (xScale.bandwidth() - rectPadding) / 2;
    })
    .attr('dy', function(d) {
      return 20;
    })
    .text(function(d) {
      // return d;
    });

  //添加x轴
  svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(' + padding.left + ',' + (height - padding.bottom) + ')')
    .call(xAxis);

  //添加y轴
  // svg.append("g")
  // 	.attr("class","axis")
  // 	.attr("transform","translate(" + padding.left + "," + padding.top + ")")
  // 	.call(yAxis);

  return {
    destroy: function() {
      parent.select('svg').remove();
    },
  };

}