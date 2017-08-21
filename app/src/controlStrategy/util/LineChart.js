export default class LineChart {
    constructor({
        wrapper, 
        data, 
        padding={left: 20, top: 20, right: 20, bottom: 20},
        xAccessor=d=>d.x,
        yAccessor=d=>d.y,
        tickFormat=d=>d,
        curveFactory=d3.curveStepAfter
    }) {
        this.wrapper = wrapper;
        this.data = data;
        this.padding = padding;
        this.xAccessor = xAccessor;
        this.yAccessor = yAccessor;
        this.tickFormat = tickFormat;
        this.curveFactory = curveFactory;

        this.initChart = this.initChart.bind(this);
        this.getAxis = this.getAxis.bind(this);
        this.getMainChart = this.getMainChart.bind(this);
        this.draw = this.draw.bind(this);

        this.initChart();
    }

    initChart() {
        let width = this.wrapper && this.wrapper.offsetWidth,
            height = this.wrapper && this.wrapper.offsetHeight;
        this.w = width - this.padding.left - this.padding.right;
        this.h = height - this.padding.top - this.padding.bottom;
        
        this.svg = d3.select(this.wrapper)
            .append('svg')
            .attr('width', width)
            .attr('height', height);
        this.group = this.svg.append('g')
            .attr('transform', `translate(${this.padding.left}, ${this.padding.top})`);
        this.x_axis = this.group
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${this.h})`);
        this.y_axis = this.group
            .append('g')
            .attr('class', 'y-axis');
        
        this.main_area = this.group
            .append('path')
            .attr('class', 'main-area');
        this.main_line = this.group
            .append('path')
            .attr('class', 'main-line');

        let wrapper = d3.select(this.wrapper);
        wrapper.style('position', 'relative');
        
        this.tooltips = wrapper.append('div')
            .attr('class', 'tooltip top')
            .style('position', 'absolute')
            .style('top', '30px')
            .style('left', '20px')
            .style('z-index', 1000)
            .style('opacity', 1);
        this.tooltips.append('div')
            .attr('class', 'tooltip-arrow');
        this.tooltips.append('div')
            .attr('class', 'tooltip-inner')
            .text('this is a tooltips.');

        this.draw();
    }

    getAxis() {
        this.xScale = d3.scalePoint()
            .domain(this.data.values.map(item=>this.xAccessor(item)))
            .range([0, this.w]);
        this.yScale = d3.scaleLinear()
            // .domain(d3.extent(this.data.values, this.yAccessor))
            .domain([0, d3.max(this.data.values, this.yAccessor)])
            .range([this.h, 0]);

        let xAxis = d3.axisBottom()
            .scale(this.xScale)
            .tickValues([ this.xAccessor(this.data.values[0]),this.xAccessor(this.data.values[this.data.values.length-1]) ])
            .tickSizeOuter(0)
            .tickFormat(this.tickFormat);

        this.x_axis.call(xAxis);

        let yAxis = d3.axisLeft()
            .scale(this.yScale)
            .tickSizeInner(-this.w);
        
        this.y_axis.call(yAxis);
    }

    getMainChart() {
        let area = d3.area()
            .x((d) => {
                return this.xScale(this.xAccessor(d));
            })
            .y0(this.yScale(0))
            .y1((d) => {
                return this.yScale(this.yAccessor(d));
            })
            .curve(this.curveFactory);
        this.main_area
            .datum(this.data.values)
            .attr('d', function(d){
                return area(d);
            });
        let line = d3.line()
            .x((d) => {
                return this.xScale(this.xAccessor(d));
            })
            .y((d) => {
                return this.yScale(this.yAccessor(d));
            })
            .curve(this.curveFactory);
        this.main_line
            .datum(this.data.values)
            .attr('d', function(d) {
                return line(d);
            });
    }
    
    draw() {
        this.getAxis();
        this.getMainChart();
    }

    updateChart(data) {
        this.data = Object.assign({}, this.data, data);
        this.draw();
    }

    destroy() {
        this.svg.remove();
    }
}