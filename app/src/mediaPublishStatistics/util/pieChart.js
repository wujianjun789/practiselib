//饼状图
export default class PieChart {
    constructor(wrapper, dataset, color = null, width = 120, height = 120) {
        this.wrapper = wrapper
        this.dataset = dataset;
        this.color = color;
        this.width = width;
        this.height = height;
        this.radius = Math.min(this.width, this.height) / 2;

        this.initChart()
    }
    initChart() {
        let color;
        if (this.color) {
            color = d3.scaleOrdinal().domain(d3.range(this.color.length)).range(this.color)
        } else {
            color = d3.scaleOrdinal(d3.schemeCategory20);
        }
        const svg = d3.select(this.wrapper)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            // .attr('viewBox', '0 0 ' + this.width + ' ' + this.height) //动态改变宽高，使得图表响应式
            // .attr('style', 'width:100%')
            .append('g')
            .attr('transform', 'translate(' + (this.width / 2) + ',' + (this.height / 2) + ')');
        const arc = d3.arc()
            .innerRadius(this.radius * 0.85)
            .outerRadius(this.radius)
            .cornerRadius(20)
        const pie = d3.pie()
            .value(function (d) { return d; })
            .padAngle(0.04)
            .sort(null);
        const path = svg.selectAll('path')
            .data(pie(this.dataset))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function (d, i) {
                return color(i)
            })
    }
    destory() {
        //销毁d3图
        d3.select(this.wrapper).remove()
    }
}