/**
 * created by m on 2018/01/8
 */
// import { intlFormat } from '../util/index';
export default function BarChart(data) {
	// console.log("柱状体传入的data:", data)
	let ID = data.wrapper.id
	let parent = d3.select(`#${ID}`)
    if (parent == null) return;

	var wrapper = data.wrapper;
	var dataset = data.data;
	var type = data.type;
	// 画布大小
	// var width = 900;
	var width = wrapper.offsetWidth;
	var height = 170;

	//画布周边的空白
	var padding = {left:0, right:30, top:20, bottom:40};

	//定义一个数组日，月，年，
	// var dataset = [10, 20,32, 5, 30,  12, 5, 10, 40, 33, 24, 20,12, 5,32, 5, 10, 40,33, 24, 20, 33, 10, 40, 33, 24, 30, 40, 33, 24, 12, 5];
	// var dataset = [10, 40, 33, 24, 20,12, 5,32, 5, 10, 40,33, 24, 20, 33, 10, 40, 33, 24, 30, 40, 33, 24, 12, 5];
	// var dataset = [10, 40, 33, 24, 40, 33, 24, 30, 40, 33, 24, 12];
	// var dataset = [{x:3, y: 10},{x:4, y: 20},{x:5, y: 14},{x:6, y: 15},{x:7, y: 12},{x:8, y: 17},{x:9, y: 14}];
	// var dataset = data	
	//x轴的比例尺
    var xScale = d3.scaleBand()
		.domain(d3.range(dataset.length))
        // .domain(['一月', '二月','一月', '二月','一月', '二月','一月', '二月','一月', '二月'])
        .range([0, width - padding.left - padding.right])
	//y轴的比例尺
	var yScale = d3.scaleLinear()
		.domain([0,d3.max(dataset, function(d) {
			return d.y;
		})])
		.range([height - padding.top - padding.bottom, 0]);

	//定义x轴,这里的d 和 i 有什么差别呢？
	var xAxis = d3.axisBottom(xScale)
		.tickFormat(function (d, i) {
			// var Time1 = dataset[d].x.getMonth();
			// var Time2 = new Date(dataset[d].x).getMonth();
			var year = new Date(dataset[d].x).getFullYear();
			var month = new Date(dataset[d].x).getMonth() + 1;
			var day = new Date(dataset[d].x).getDate();
			var hours = new Date(dataset[d].x).getHours();
			var time = '';
			switch(type) {
				case "1":
					time = `${month}月`
					// return time;
					break;
				case "2":
					time = `${day}日`
					// return time;
					break;
				case "3":
					time = `${hours}时`
					// return time;
					break;
				default:
					// return time;
					break; 
			}
			return time;
			
		// return dataset[d].x;
		// return dataset[d-1].x;
		// return 'yiyue'
		// return Time
	})
        .tickSizeInner(0)
		.tickSizeOuter(0)
		// .ticks(5,'s')
        // .tickValues([0,5,10,15,20,25,30]);//添加刻度
		
	//定义y轴
	// var yAxis = d3.axisLeft(yScale)
		// .scale(yScale)
		// .orient("left");

    //添加tips
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset(function(){
            return [-10, 0]
        })
        .html(function(d) {
            return `能耗：<span style='color:#eee'>${d.y}kWh</span>`;
        })

    //在 body 里添加一个 SVG 画布	
	var svg = parent.append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform","translate(10,10)");

    //调用tips    
    svg.call(tip)

	//矩形之间的空白
	var rectPadding = 10;

	//添加矩形元素
	var rects = svg.selectAll(".MyRect")
		.data(dataset)
		.enter()
		.append("rect")
		.attr("class","MyRect")
		.attr("transform","translate(" + padding.left + "," + padding.top + ")")
		.attr("x", function(d,i){
			return xScale(i) + rectPadding/2;
		} )
		.attr("y",function(d){
			return yScale(d.y);
		})
		.attr("width", xScale.bandwidth() - rectPadding )
		.attr("height", function(d){
			return height - padding.top - padding.bottom - yScale(d.y);
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

	//添加文字元素
	var texts = svg.selectAll(".MyText")
		.data(dataset)
		.enter()
		.append("text")
		.attr("class","MyText")
		.attr("transform","translate(" + padding.left + "," + padding.top + ")")
		.attr("x", function(d,i){
			return xScale(i) + rectPadding/2;
		} )
		.attr("y",function(d){
			return yScale(d.y);
		})
		.attr("dx",function(){
			return (xScale.bandwidth() - rectPadding)/2;
		})
		.attr("dy",function(d){
			return 20;
		})
		.text(function(d){
			// return d;
		});

	//添加x轴
	svg.append("g")
		.attr("class","axis")
		.attr("transform","translate(" + padding.left + "," + (height - padding.bottom) + ")")
        .call(xAxis); 
		
	//添加y轴
	// svg.append("g")
	// 	.attr("class","axis")
	// 	.attr("transform","translate(" + padding.left + "," + padding.top + ")")
	// 	.call(yAxis);
	return {
		destroy: function() {
			parent.select('svg').remove()
	   }
	}
	 
}