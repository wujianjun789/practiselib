export default class LineChart {
    constructor({
        wrapper, 
        data, 
        padding={left: 20, top: 20, right: 20, bottom: 20},
        xAccessor=d=>d.x,
        yAccessor=d=>d.y,
        tickFormat=d=>d,
        tooltipAccessor=d=>d,
        curveFactory=d3.curveStepAfter
    }) {
        this.wrapper = wrapper;
        this.padding = padding;
        this.xAccessor = xAccessor;
        this.yAccessor = yAccessor;
        this.tickFormat = tickFormat;
        this.curveFactory = curveFactory;
        this.tooltipAccessor = tooltipAccessor;

        this.initChart = this.initChart.bind(this);
        this.getAxis = this.getAxis.bind(this);
        this.getMainChart = this.getMainChart.bind(this);
        this.draw = this.draw.bind(this);
        this.sortByXAxisValue = this.sortByXAxisValue.bind(this);

        this.data = this.sortByXAxisValue(data);

        this.initChart();
    }

    sortByXAxisValue(data) {
        let _data = Object.assign({}, data);
        let arr = Object.assign([], _data.values);
        arr.sort((prev, next) => {
            return this.xAccessor(prev) - this.xAccessor(next);
        });
        return Object.assign(_data, {values: arr});
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
            .style('opacity', 1)
            .style('display', 'none');
        this.tooltips.append('div')
            .attr('class', 'tooltip-arrow');
        this.tooltipInner = this.tooltips.append('div')
            .attr('class', 'tooltip-inner')
            .text('this is a tooltips.');

        this.svg.on('mouseenter', ()=>{
            this.data.values.length>1&&this.tooltips.style('display', 'block');
        }, false);
        this.svg.on('mousemove', (data, index) => {
            if(this.data.values.length>1) {
                let _offsetLeft = Math.floor(document.getElementsByClassName('tooltip')[0].offsetWidth/2);
                let _index = Math.floor(d3.event.offsetX / this.xScale.step());
                if(_index <= -1) {
                    _index = 0;
                }
                let val = this.data.values[_index];
                this.tooltips.style('left', `${d3.event.offsetX-_offsetLeft}px`).style('top',`${this.yScale(this.yAccessor(val))}px`);
                this.tooltipInner.text(`${this.tooltipAccessor(val)}`);
            }
        }, false);
        this.svg.on('mouseleave', ()=>{
            this.data.values.length>1&&this.tooltips.style('display', 'none');
        }, false);

        this.draw();
    }

    getAxis() {
        this.xScale = d3.scalePoint()
            .range([0, this.w]);
        this.yScale = d3.scaleLinear()
            // .domain(d3.extent(this.data.values, this.yAccessor))
            .range([this.h, 0]);
        
        this.xScale.domain(this.data.values.map(item=>this.xAccessor(item)));
        this.yScale.domain([0, d3.max(this.data.values, this.yAccessor)]);

        let xAxis = d3.axisBottom()
            .scale(this.xScale)
            .tickSizeOuter(0)
            .tickFormat(this.tickFormat);
        
        if(this.data.values.length==1) {
            xAxis.tickValues([ this.xAccessor(this.data.values[0]) ]);
        } else {
            xAxis.tickValues([ this.xAccessor(this.data.values[0]),this.xAccessor(this.data.values[this.data.values.length-1]) ]);
        }
        
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
        if(this.data.values.length!=0) {
            this.getAxis();
            this.getMainChart();
        }
    }

    updateChart(data) {
        this.data = this.sortByXAxisValue(Object.assign({}, this.data, data));
        if (this.data.values.length==0) {
            this.destroy();
            this.initChart();
        } else {
            this.draw();
        }
    }

    destroy() {
        this.svg.on('mouseenter', null)
        this.svg.on('mousemove', null);
        this.svg.on('mouseleave', null);
        this.svg.remove();
    }
}