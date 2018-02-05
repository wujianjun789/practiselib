//饼状图
export default class PieChart {
    constructor(wrapper, dataset, width = 120, height = 120) {
        this.wrapper = wrapper
        this.dataset = dataset;
        this.width = width;
        this.height = height;
        this.radius = Math.min(this.width, this.height) / 2;

        this.initChart()
    }
    initChart() {
        const color = d3.scaleOrdinal(d3.schemeCategory20);
        const svg = d3.select(this.wrapper)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .append('g')
            .attr('transform', 'translate(' + (this.width / 2) + ',' + (this.height / 2) + ')');
        const arc = d3.arc()
            .innerRadius(this.radius * 0.85)
            .outerRadius(this.radius);
        const pie = d3.pie()
            .value(function (d) { return d; })
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
    destory(){
        console.log('unmount')
    }
}