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

    var yMin = chartData.yMin;
    var yMax = chartData.yMax;

    var xAccessor = chartData.xAccessor != undefined ? chartData.xAccessor : d=>d.x;
    var yAccessor = chartData.yAccessor != undefined ? chartData.yAccessor : d=>d.y;
    var dataset = chartData.data;

    var width = w - margin.left - margin.right,
        height = h - margin.top - margin.bottom;
    var x = d3.scalePoint().domain(dataset.map(item=>{
        return item.x;
    })).range([0, width]);

    var y = d3.scaleLinear()
    if(yMin != undefined && yMax != undefined){
        y.domain([yMin, yMax])
            .range([height, 0]);
    }else{
        y.domain([d3.min(dataset, yAccessor(d)), d3.max(dataset, yAccessor(d))])
            .range([height, 0]);
    }

    var xAxis = d3.axisBottom(x)/*.ticks(2).tickFormat(function (d) {
        return dataset[d-1].x;
    })*/

    var yAxis = d3.axisLeft(y)
        .ticks(10)
        .tickSize(-width)
        .tickFormat("");

    var area = d3.area()
        .x(function(d) { return x(xAccessor(d)); })
        .y0(height)
        .y1(function(d) { return y(yAccessor(d)); })
        .curve(d3.curveStepAfter)

    var line = d3.line()
        .x(function (d) {return x(xAccessor(d));})
        .y(function (d) {return y(yAccessor(d));})
        .curve(d3.curveStepAfter);

    var svg = parent.append("svg").attr("width", w)
        .attr("height", h)
        .attr("viewBox", "0 0 " + (w) + " " + (h)).attr("style","width:100%")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // svg.append("g")
    //     .attr("class", "x axis")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(xAxis);

    parent.style('position', 'relative');
    var tooltips = parent.append('div')
        .attr('class', 'tooltip top')
        .style('position', 'absolute')
        .style('top', '30px')
        .style('left', '20px')
        .style('z-index', 1000)
        .style('opacity', 1)
        .style('display', 'none');
    tooltips.append('div')
        .attr('class', 'tooltip-arrow');
    var tooltipInner = tooltips.append('div')
        .attr('class', 'tooltip-inner')
        .text('this is a tooltips.');

    svg.on('mouseenter', ()=>{
        dataset.length!=0 && tooltips.style('display', 'block');
    }, false);
    svg.on('mousemove', (data, index) => {
        let len = dataset.length;
        if (len != 0) {
            let _index = Math.floor(d3.event.offsetX / x.step());
            if (_index <= -1) {
                _index = 0;
            } else if (_index >= len ) {
                _index = len - 1;
            }
            let val = dataset[_index];
            tooltipInner.text(`${val.y}`);

            let _offsetLeft = Math.floor(document.getElementsByClassName('tooltip')[0].offsetWidth/2);
            tooltips.style('left', `${d3.event.offsetX-_offsetLeft}px`).style('top',`${y(yAccessor(val))-margin.bottom}px`);
        }
    }, false);
    svg.on('mouseleave', ()=>{
        dataset.length!=0 && tooltips.style('display', 'none');
    }, false);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        // .append("text")
        // .attr("transform", "rotate(-90)")
        // .attr("y", 6)
        // .attr("dy", ".71em")
        // .style("text-anchor", "end")
        // .text("kwh");

    var node = svg.append("g")
        .attr("class", "node");

        node.append("text")
            .attr("class", "first")
            .attr("x", 0)
            .attr("y", height+15)
            .text(function (d) {
                return dataset.length?dataset[0].x:""
            })
        node.append("text")
            .attr("class", "last")
            .attr("x", width)
            .attr("y", height+15)
            .attr("text-anchor", "end")
            .text(function (d) {
                return dataset.length?dataset[dataset.length-1].x:""
            })


    var areaGroup = svg.append('g').attr("class", "area-group");
    areaGroup.append("path")
        .datum(dataset)
        .attr("class", "area")
        .attr("d", d=>{
            return area(d);
        });

    var lineGroup = svg.append('g').attr("class", "line-group");
    lineGroup.append("path")
        .datum(dataset)
        .attr("class", "path-line")
        .attr("d", line);

    return {
        id: id,
        destory:function () {
            parent.select('svg').remove();
        }
    }
}