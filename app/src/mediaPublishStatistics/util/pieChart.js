//饼状图
export default class PieChart {
    constructor(wrapper, dataset, color = null, width = wrapper.offsetWidth, height = wrapper.offsetHeight) {
        this.wrapper = wrapper;  //容器元素
        this.dataset = dataset;
        this.color = color;
        this.width = width;
        this.height = height;
        this.radius = Math.min(this.width, this.height) / 2;
        this.initChart();
    }
    initChart() {
        let color;
        if (this.color) {
            color = d3.scaleOrdinal().domain(d3.range(this.color.length)).range(this.color);  // 如果传入颜色，则使用传入的颜色
        } else {
            color = d3.scaleOrdinal(d3.schemeCategory20);  // 使用默认颜色
        }
        const svg = d3.select(this.wrapper)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('viewBox', '0 0 ' + this.width + ' ' + this.height) //当宽高改变时，图表响应式
            .attr('style', 'width:100%')
            .append('g')
            .attr('transform', 'translate(' + (this.width / 2) + ',' + (this.height / 2) + ')');
        const arc = d3.arc()
            .innerRadius(this.radius * 0.85)  //内半径，设为0则为完整的饼状图
            .outerRadius(this.radius)
            .cornerRadius(5);    //set the corner radius
        const pie = d3.pie()
            .value(function (d) { return d; })
            .padAngle(0.04)    //set the angle between adjacent arcs, for padded arcs.
            .sort(null);
        const path = svg.selectAll('path')
            .data(pie(this.dataset))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function (d, i) {
                return color(i);
            });
    }
    updateChart() {

    }
    destory() {
        d3.select(this.wrapper).remove();  //移除图表元素
    }
}