/**
 * Created by a on 2017/9/8.
 */

/**
 *  随着时间移动折线图
 */
export default function TMLineChart(id, chartData) {
    let parent = d3.select('#'+id);
    if (parent == null) return;

    var id = chartData.id != undefined ? chartData.id : '';
    var w = chartData.w != undefined ? chartData.w : 100;
    var h = chartData.h != undefined ? chartData.h : 100;
    var margin = chartData.margin == undefined ? { top: 20, right: 20, bottom: 20, left: 20 } : chartData.margin;
    var min_y = chartData.min_y != undefined ? chartData.min_y : 100;
    var max_y = chartData.max_y != undefined ? chartData.max_y : 100;
    var style = chartData.style != undefined ? chartData.style : { fill: 'none', width: 1, color: '#000000', opacity: 1 }

    var dataset = chartData.data;
    transformTime();

    var active = -1;
    var width = w - margin.left - margin.right;
    var height = h - margin.top - margin.bottom;

    var scale_x = make_scale_x();
    var scale_y = make_scale_y();

    var svg = parent.append("svg").attr("width", w).attr("height", h).attr("viewBox", "0 0 " + w + " " + h)
        .attr("style","width:100%").
        attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xAxis = make_axis_x(scale_x);
    var xBar = svg.append("g").attr("class", "axis x").call(xAxis)


    var yAxis = make_axis_y(scale_y);
    var yBar = svg.append("g").attr("class", "axis y").call(yAxis)


    _draw();
    var line;
    var group;
    var path;

    var area;
    var areaGroup;
    var areaPath;

    function _draw() {
        line = d3.line()
            .x(function (d, i) {
                return scale_x(d.x);
            })
            .y(function (d, i) {
                return scale_y(d.y);
            })
            // .curve(d3.curveMonotoneX);

        group = svg.append("g").attr("class", "line");
        path = group.append("path");
        path.transition().duration(33).attr("d", line(dataset));

        area = d3.area()
            .x(function(d) { return scale_x(d.x); })
            .y0(height)
            .y1(function(d) { return scale_y(d.y); })
            // .curve(d3.curveMonotoneX)

        areaGroup = svg.append('g').attr("class", "area");
        areaPath = areaGroup.append("path");
        areaPath.transition().duration(33).attr("d", area(dataset));

        // drawCircle(dataset);
        // drawLabel(dataset);
    }

    function _reDraw() {
        transformTime();

        scale_x = make_scale_x();
        xAxis = make_axis_x(scale_x);
        xBar.call(xAxis);

        scale_y = make_scale_y();
        yAxis = make_axis_y(scale_y)
        yBar.call(yAxis)

        path.attr("d", line(dataset));
        areaPath.attr("d", area(dataset));

        // group.selectAll("text").remove();
        // drawLabel(dataset);
    }

    function drawLabel(data) {
        group.selectAll("text")
            .data(data).enter().append("text")
            .attr("x", function (d, i) {
                return scale_x(d.x) - 10;
            })
            .attr("y", function (d) {
                return scale_y(d.y) - 10;
            })
            .text(function (d) {
                return d.y;
            })
            .attr("class", "label");


        // group.selectAll("text")
        //     .transition()
        //     .duration(1000)
        //     .attr("x", function (d, i) {
        //         return scale_x(d.x) - 10;
        //     })
        //     .attr("y", function (d, i) {
        //         return scale_y(d.y) - 10;
        //     })
    }

    function drawCircle(data) {
        group.selectAll("circle")
            .data(data).enter().append("circle")
            .attr("cx", function (d, i) {
                return scale_x(d.x);
            })
            .attr("cy", function (d, i) {
                return scale_y(d.y);
            })
            .attr("style", "cursor: pointer;")
            .attr("r", 5)
            .attr("fill", '#01adff')
            .append("title")
            .text(function (d) {
                return '('+d3.timeParse('%H:%M:%S')(d.x)+','+d.y+')';
            });


        group.selectAll("circle")
            .transition()
            .duration(1000)
            .attr("cx", function (d, i) {
                return scale_x(d.x);
            })
            .attr("cy", function (d, i) {
                return scale_y(d.y);
            })
    }

    function transformTime() {
        var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
        dataset.forEach(function (data) {
            data.x = parseDate(data.x);
        })
    }
    function make_scale_x() {
        var value = d3.extent(dataset, function (d) {
            return d.x;
        })
        return d3.scaleLinear().domain(value).range([0, width]);
    }

    function make_scale_y() {
        return d3.scaleLinear().domain([min_y, max_y]).range([height, 0]);
    }

    function make_axis_x(scaleX) {
        return d3.axisBottom(scaleX).ticks(10).tickSize(height).tickFormat("");
    }

    function make_axis_y(scaleY) {
        return d3.axisLeft(scaleY).ticks(10).tickSize(-width);
    }

    return {
        id: id,
        update:function (data) {
            min_y = data.min_y?data.min_y:0;
            max_y = data.max_y?data.max_y:0;

            dataset = data.data;
            _reDraw();
        },
        destory: function () {
            parent.select('svg').remove();
        }
    }
};