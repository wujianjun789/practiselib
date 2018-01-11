/**
 * created by m on 2018/01/8
 */
// import { intlFormat } from '../util/index';
export default function BarChart(data) {
    let parent = d3.select('#energyStatistics');
    if (parent == null) return;

    var wrapper = data.wrapper;
    var data = data.data;

	// 画布大小
	var width = 900;
	var height = 170;

	//画布周边的空白
	var padding = {left:0, right:30, top:20, bottom:40};

	//定义一个数组日，月，年，
	var dataset = [10, 20,32, 5, 30,  12, 5, 10, 40, 33, 24, 20,12, 5,32, 5, 10, 40,33, 24, 20, 33, 10, 40, 33, 24, 30, 40, 33, 24, 12, 5];
	// var dataset = [10, 40, 33, 24, 20,12, 5,32, 5, 10, 40,33, 24, 20, 33, 10, 40, 33, 24, 30, 40, 33, 24, 12, 5];
	// var dataset = [10, 40, 33, 24, 40, 33, 24, 30, 40, 33, 24, 12];
		
	//x轴的比例尺
    var xScale = d3.scaleBand()
        .domain(d3.range(dataset.length))
        .range([0, width - padding.left - padding.right])
	//y轴的比例尺
	var yScale = d3.scaleLinear()
		.domain([0,d3.max(dataset)])
		.range([height - padding.top - padding.bottom, 0]);

	//定义x轴
	var xAxis = d3.axisBottom(xScale)
        .tickSizeInner(0) 
        .tickSizeOuter(0);
        // .tickValues([1,5,10,15,20,25,30]);
		
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
        .html(function(d,i ) {
            return `能耗：<span style='color:#eee'>${d}kWh</span>`;
        })

    //在 body 里添加一个 SVG 画布	
	var svg = d3.select("#energyStatistics")
        .append("svg")
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
			return yScale(d);
		})
		.attr("width", xScale.bandwidth() - rectPadding )
		.attr("height", function(d){
			return height - padding.top - padding.bottom - yScale(d);
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
			return yScale(d);
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
}