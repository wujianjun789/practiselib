/**
 * Created by a on 2017/8/16.
 */
export default function LineAreaChart(parentId, chartData) {
    var parent = d3.select("#"+parentId);
    if(parent == null)return;
    var id = chartData.id != undefined ? chartData.id : '';
    var w = chartData.w != undefined ? chartData.w : 100;
    var h = chartData.h != undefined ? chartData.h : 100;
    var margin = chartData.margin == undefined ? {top: 20, right: 20, bottom: 20, left: 20} : chartData.margin;
    var label = chartData.label == undefined ? "" : chartData.label;
    var style = chartData.style != undefined ? chartData.style : {fill:'none', width:1, color:'#000000', opacity:1}

    var dataset = chartData.data;

    var width = w - margin.left - margin.right,
        height = h - margin.top - margin.bottom;

    var x = d3.scaleLinear().domain([1, dataset.length]).range([0, width]);

    var y = d3.scaleLinear().domain([d3.min(dataset, function (d) {
            return d.y;
        }), d3.max(dataset, function (d) {
            return d.y;
        })])
        .range([height, 0]);

    var xAxis = d3.axisBottom(x)/*.ticks(2).tickFormat(function (d) {
        return dataset[d-1].x;
    })*/

    var yAxis = d3.axisLeft(y)
        .ticks(10)
        .tickSize(-width)
        .tickFormat("");

    // y.ticks(10);

    var area = d3.area()
        .x(function(d, i) { return x(i+1); })
        .y0(height)
        .y1(function(d) { return y(d.y); })
        .curve(d3.curveMonotoneX)
    // .tension(0.5);

    var line = d3.line()
        .x(function (d, i) {
            return x(i+1);
        })
        .y(function (d) {
            return y(d.y);
        })

    var svg = parent.append("svg").attr("width", w)
        .attr("height", h)
        .attr("viewBox", "0 0 " + (w) + " " + (h)).attr("style","width:100%")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // svg.append("g")
    //     .attr("class", "x axis")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("kwh");

    var node = svg.append("g")
        .attr("class", "node");

        node.append("text")
            .attr("class", "first")
            .attr("x", 0)
            .attr("y", h-margin.bottom)
            .text(function (d) {
                return dataset.length?dataset[0].x:""
            })
        node.append("text")
            .attr("class", "last")
            .attr("x", w-margin.left-margin.right)
            .attr("y", h-margin.bottom)
            .text(function (d) {
                return dataset.length?dataset[dataset.length-1].x:""
            })


    svg.append("path")
        .datum(dataset)
        .attr("class", "area")
        .attr("d", area)

    var group = svg.append('g');
    var line = group.append("path")
        .datum(dataset)
        .attr("class", "line")
        .attr("d", line)

    group.selectAll("circle")
        .data(dataset).enter()
        .append("circle")
        .attr("cx", function (d, i) {
            return x(i+1);
        })
        .attr("cy", function (d) {
            return y(d.y);
        })
        .attr("r", 2)
        .append("title")
        .text(function (d) {
            return d.x +' '+ label +' '+ d.y;
        })
    // var title = line.append("title")
    //
    // line.on("mouseover", function () {
    //     console.log(d3.event.layerX, d3.event.layerX-138);
    //     var value = label;
    //     title.text(value);
    //     })

    return {
        id: id,
        destory:function () {
            parent.select('svg').remove();
        }
    }
}