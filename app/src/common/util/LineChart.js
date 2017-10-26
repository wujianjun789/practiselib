/**
 * D3 environment is required
 *
 * @param {Object}                  obj
 * @param {node}                    obj.wrapper             required        // 图像的容器
 * @param {{values: Number[]}}      obj.data                required        // 绘图相关数据
 * @param {{
 *              left:Number,
 *              right: 20,
 *              top: 20,
 *              bottom: 20
 * }}                               obj.padding             optional        // 图像周围的空间,可传入单个属性，默认 20px
 * @param {Function}                obj.xAccessor           optional        // x轴数据访问器，default: d = d.x
 * @param {Function}                obj.yAccessor           optional        // y轴数据访问器，default: d = d.y
 * @param {Number[]}                obj.xDomain             optional        // x轴值域，default： [0,1]。                 未实现，逗你玩
 * @param {Number[]}                obj.yDomain             optional        // y轴值域，default： [0,1]。
 * @param {Function}                obj.tickFormat          optional        // format tick, default: d => d,
 * @param {Function}                obj.tooltipAccessor     optional        // tooltip 数据访问器, default: d => d,
 * @param {Function}                obj.curveFactory        optional        // default: d3.curveStepAfter
 */
export default class LineChart {
    constructor({
        wrapper,
        data,
        padding: {left = 20, top = 20, right = 20, bottom = 20} = {},
        xAccessor=d=>d.x,
        yAccessor=d=>d.y,
        xDomain=[0,1],
        yDomain=[0,1],
        tickFormat=d=>d,
        tooltipAccessor=d=>d,
        curveFactory=d3.curveStepAfter
    }) {
        this.wrapper = wrapper;
        this.padding = {left, top, right, bottom};
        this.xAccessor = xAccessor;
        this.yAccessor = yAccessor;
        this.xDomain = xDomain;
        this.yDomain = yDomain;
        this.tickFormat = tickFormat;
        this.curveFactory = curveFactory;
        this.tooltipAccessor = tooltipAccessor;

        this.initChart = this.initChart.bind(this);
        this.getAxis = this.getAxis.bind(this);
        this.getMainChart = this.getMainChart.bind(this);
        this.draw = this.draw.bind(this);
        this.sortByXAxisValue = this.sortByXAxisValue.bind(this);
        this.bubbleSort = this.bubbleSort.bind(this);

        this.data = this.sortByXAxisValue(data, this.xAccessor);

        this.initChart();
    }

    sortByXAxisValue(data, accessor) {
        let _data = Object.assign({}, data);
        let arr = Object.assign([], _data.values);
        arr = this.bubbleSort(arr, accessor);
        return Object.assign(_data, {values: arr});
    }

    bubbleSort(arr, accessor){
        let _arr = Object.assign([], arr);
        for(let i=0, len=_arr.length; i<len-1; i++){
            for(let j=i+1; j<len; j++){
                if( accessor(_arr[j]) - accessor(_arr[i]) < 0 ){
                    let tmp = _arr[j];
                    _arr[j] = _arr[i];
                    _arr[i] = tmp;
                }
            }
        }
        return _arr;
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
			.style('pointer-events', 'none')
            .style('display', 'none');
        this.tooltips.append('div')
			.attr('class', 'tooltip-arrow')
			.style('pointer-events', 'none');
        this.tooltipInner = this.tooltips.append('div')
			.attr('class', 'tooltip-inner')
			.style('pointer-events', 'none')
            .text('this is a tooltips.');

        this.svg.on('mouseenter', ()=>{
            this.data.values.length!=0 && this.tooltips.style('display', 'block');
        }, false);
        this.svg.on('mousemove', (data, index) => {
            let len = this.data.values.length;
            if (len != 0) {
                let _index = Math.floor(d3.event.offsetX / this.xScale.step());
                if (_index <= -1) {
                    _index = 0;
                } else if (_index >= len ) {
                    _index = len - 1;
                }
                let val = this.data.values[_index];
                this.tooltipInner.text(`${this.tooltipAccessor(val)}`);
                let _offsetLeft = Math.floor(document.getElementsByClassName('tooltip')[0].offsetWidth/2);
                this.tooltips.style('left', `${d3.event.offsetX-_offsetLeft}px`).style('top',`${this.yScale(this.yAccessor(val))}px`);
            }
        }, false);
        this.svg.on('mouseleave', ()=>{
            this.data.values.length!=0 && this.tooltips.style('display', 'none');
        }, false);

        this.draw();
    }

    getAxis() {
        this.xScale = d3.scalePoint()
            .range([0, this.w]);
        this.yScale = d3.scaleLinear()
            .range([this.h, 0]);

        this.xScale.domain(this.data.values.map(item=>this.xAccessor(item)));
        // this.yScale.domain(d3.extent(this.data.values, this.yAccessor));
        // let max = this.yAccessor(this.bubbleSort(this.data.values, this.yAccessor)[this.data.values.length-1]);
        // this.yScale.domain([0, max]);
        this.yScale.domain(this.yDomain);

        let xAxis = d3.axisBottom()
            .scale(this.xScale)
            .tickSizeOuter(0)
            .tickFormat(this.tickFormat);
        const len = this.data.values.length;
        if(len == 1) {
            xAxis.tickValues([ this.xAccessor(this.data.values[0]) ]);
        } else if (len > 1) {
            xAxis.tickValues([ this.xAccessor(this.data.values[0]),this.xAccessor(this.data.values[len-1]) ]);
        }

        this.x_axis.call(xAxis);
        if(len == 1) {
            let tick = this.x_axis.select('.tick');
            tick.attr('transform', 'translate(0,0)')
            tick.select('text').style('text-anchor', 'start');
        }

        let yAxis = d3.axisLeft()
            .scale(this.yScale)
            .tickSizeInner(-this.w);

        this.y_axis.call(yAxis);
    }

    getMainChart() {
        let len = this.data.values.length;
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
            .attr('d', (d) => {
                if (len == 1) {
                    let _y1 = this.yScale(this.yAccessor(d[0])),
                        _y0 = this.yScale(0);
                    return `M${0},${_y0}L${0},${_y1}L${this.w},${_y1}L${this.w},${_y0}Z`;
                } else {
                    return area(d);
                }
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
            .attr('d', (d) => {
                if (len == 1) {
                    let _y1 = this.yScale(this.yAccessor(d[0]));
                    return `M${0},${_y1}L${this.w},${_y1}`;
                } else {
                    return line(d);
                }
            });
    }

    draw() {
        this.getAxis();
        if (this.data.values.length!=0) {
            this.getMainChart();
        }
    }

    updateChart(data, xDomain, yDomain) {
        if(xDomain) {
            this.xDomain = xDomain;
        }

        if(yDomain) {
            this.yDomain = yDomain;
        }

        this.data = this.sortByXAxisValue(Object.assign({}, this.data, data), this.xAccessor);
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
        this.tooltips.remove();
    }
}
