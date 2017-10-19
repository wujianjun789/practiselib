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
export default class MultiLineChart {
    constructor({
        wrapper,
        data,
		padding: {top = 20, right = 20, bottom = 60, left = 20} = {},
		padding2: {top2 = 40, right2 = 20, bottom2 = 20, left2 = 20} = {},
        xAccessor=d=>d.x,
        yAccessor=d=>d.y,
        xDomain=[0,1],
        yDomain=[0,1],
		xTickFormat=d=>d,
		yTickFormat=d=>d,
        tooltipAccessor=d=>d,
        curveFactory=d3.curveStepAfter
    }) {
        this.wrapper = wrapper;
		this.padding = {top, right, bottom, left};
		this.padding2 = {top2, right2, bottom2, left2};
        this.xAccessor = xAccessor;
        this.yAccessor = yAccessor;
        this.xDomain = xDomain;
        this.yDomain = yDomain;
        this.xTickFormat = xTickFormat;
        this.yTickFormat = yTickFormat;
        this.curveFactory = curveFactory;
        this.tooltipAccessor = tooltipAccessor;

        this.initChart = this.initChart.bind(this);
        this.getAxis = this.getAxis.bind(this);
        this.getMainChart = this.getMainChart.bind(this);
		this.draw = this.draw.bind(this);
		this.brushed = this.brushed.bind(this);
		this.zoomed = this.zoomed.bind(this);

		this.data = data;

        this.initChart();
	}

    initChart() {
        let width = this.wrapper && this.wrapper.offsetWidth,
            height = this.wrapper && this.wrapper.offsetHeight;
        this.width = width - this.padding.left - this.padding.right;
		this.height = height - this.padding.top - this.padding.bottom;
		this.height2 = height - this.padding.top - this.height - this.padding2.bottom2;
		this.brush = d3.brushX()
			.extent([[0,0], [this.width, this.height2]])
			.handleSize(20)
			.on('brush end', this.brushed);

		this.zoom = d3.zoom()
			.scaleExtent([1, Infinity])
			.translateExtent([[0, 0], [width, height]])
			.extent([[0, 0], [width, height]])
			.on("zoom", this.zoomed);

        this.svg = d3.select(this.wrapper)
            .append('svg')
            .attr('width', width)
			.attr('height', height);

		const defs = this.svg
			.append('defs');

		defs
			.append('clipPath')
			.attr('id', 'clip')
			.append('rect')
			.attr('width', this.width)
			.attr('height', this.height);

		// 自定义brush handle style
		let handle_data = {
			points: "20,20 10,30 0,20 0,0 20,0",
			path: [
				"M15,15.5H5c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5h10c0.3,0,0.5,0.2,0.5,0.5S15.3,15.5,15,15.5z",
				"M15,10.5H5c-0.3,0-0.5-0.2-0.5-0.5S4.7,9.5,5,9.5h10c0.3,0,0.5,0.2,0.5,0.5S15.3,10.5,15,10.5z",
				"M15,5.5H5C4.7,5.5,4.5,5.3,4.5,5S4.7,4.5,5,4.5h10c0.3,0,0.5,0.2,0.5,0.5S15.3,5.5,15,5.5z"
			]
		}
		let handle = defs
			.append('pattern')
			.attr('id', 'brush-handle')
			.attr('x', 0)
			.attr('y', 0)
			.attr('width', 1)
			.attr('height', 1);
			// .attr('patternUnits', 'objextBoundingBox');

		handle
			.append('polygon')
			.attr('points', handle_data.points)
			.attr('fill', '#B6B9C2');
		handle_data.path.forEach((d) => {
			handle
				.append('path')
				.attr('d', d)
				.attr('fill', '#fff');
		});

		this.focus = this.svg
			.append('g')
			.attr('class', 'focus')
            .attr('transform', `translate(${this.padding.left}, ${this.padding.top})`);
        this.x_axis = this.focus
            .append('g')
            .attr('class', 'axis axis-x')
            .attr('transform', `translate(0, ${this.height})`);
        this.y_axis = this.focus
            .append('g')
            .attr('class', 'axis axis-y');

        this.line_group = this.focus
            .append('g')
			.attr('class', 'line-group')
			.attr('clip-path', 'url(#clip)');

		this.line_group
			.selectAll('path')
			.data(this.data)
			.append('path');

		this.context = this.svg
			.append('g')
			.attr('class', 'context')
			.attr('transform', `translate(${this.padding.left}, ${this.padding.top + this.height + this.padding2.top2})`);

		this.context.append('g')
			.attr('class', 'brush')
			.call(this.brush)
			.selectAll('.handle')
			.attr('fill', 'url(#brush-handle)');

		this.svg.append('rect')
			.attr('class', 'zoom')
			.attr('width', this.width)
			.attr('height', this.height)
			.attr('transform', `translate(${this.padding.left}, ${this.padding.top})`)
			.call(this.zoom);

        this.draw();
    }

    getAxis() {
        this.xScale = d3.scaleLinear()
			.range([0, this.width]);
		this.xScale2 = this.xScale.copy();
        this.yScale = d3.scaleLinear()
			.range([this.height, 0]);

        this.xScale.domain(this.xDomain);
        this.yScale.domain(this.yDomain);
        this.xScale2.domain(this.xDomain);

        this.xAxis = d3.axisBottom()
			.scale(this.xScale)
			.tickSizeInner(-this.height)
			.tickSizeOuter(0)
			.tickPadding(10)
			.tickFormat(this.xTickFormat)
			.ticks(12);

		this.x_axis.call(this.xAxis);

		this.xAxis2 = d3.axisBottom()
			.scale(this.xScale2);

        let yAxis = d3.axisLeft()
            .scale(this.yScale)
			.tickSizeInner(-this.width)
			.tickSizeOuter(0)
			.tickFormat(this.yTickFormat);

		this.y_axis.call(yAxis);

		this.context
			.select('brush')
			.call(this.brush.move, this.xScale.range());
    }

    getMainChart() {
        this.line = d3.line()
            .x((d) => {
                return this.xScale(this.xAccessor(d));
            })
            .y((d) => {
                return this.yScale(this.yAccessor(d));
            })
			.curve(this.curveFactory);

		let update = this.line_group
			.selectAll('path')
			.data(this.data)
			.enter()
			.append('path')
			.attr('class', (d, i)=>`line line-${i}`)
            .attr('d', (d) => {
                if (d.values.length == 1) {
                    let _y1 = this.yScale(this.yAccessor(d[0]));
                    return `M${0},${_y1} L${this.width},${_y1}`;
                } else {
                    return this.line(d.values);
                }
            });

		update.exit().remove();
    }

    draw() {
        this.getAxis();
        // if (this.data.length!=0) {
            this.getMainChart();
        // }
    }

    updateChart(data, xDomain, yDomain) {
        if(xDomain) {
            this.xDomain = xDomain;
        }

        if(yDomain) {
            this.yDomain = yDomain;
        }

        this.data = data;
        // if (this.data.length==0) {
        //     this.destroy();
        //     this.initChart();
        // } else {
            this.draw();
        // }
    }

    destroy() {
        this.svg.remove();
	}

	brushed() {
		if(d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom")  // ignore brush-by-zoom
			return ;
		let s = d3.event.selection || this.xScale2.range();
		this.xScale
			.domain(s.map(this.xScale2.invert, this.xScale2));
		this.x_axis
			.call(this.xAxis.scale(this.xScale));
		this.line_group
			.selectAll(".line")
			.attr('d', (d) => {
                if (d.values.length == 1) {
                    let _y1 = this.yScale(this.yAccessor(d[0]));
                    return `M${0},${_y1} L${this.width},${_y1}`;
                } else {
                    return this.line(d.values);
                }
            });
		this.svg
			.select(".zoom")
			.call(this.zoom.transform, d3.zoomIdentity
											.scale(this.width / (s[1] - s[0]))
											.translate(-s[0], 0) );
	}

	zoomed() {
		if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") // ignore zoom-by-brush
			return ;
		let t = d3.event.transform;

		let domain = t.rescaleX(this.xScale2).domain();
		// 修正domain偏差
		// if(domain[1] > this.xDomain[1]) {
		// 	domain[1] = this.xDomain[1];
		// }

		this.xScale.domain(domain);
		this.line_group
			.selectAll(".line")
			.attr('d', (d) => {
                if (d.values.length == 1) {
                    let _y1 = this.yScale(this.yAccessor(d[0]));
                    return `M${0},${_y1} L${this.width},${_y1}`;
                } else {
                    return this.line(d.values);
                }
            });
		this.x_axis.call(this.xAxis.scale(this.xScale));
		this.context
			.select(".brush")
			.call(this.brush.move, () => {
				let range = this.xScale.range().map(t.invertX, t);
				// 修正range偏差
				// if(range[1] > this.width) {
				// 	range[1] = this.width;
				// }
				return range;
			});
	}
}
