/**
 * Created by a on 2016/8/10.
 */
export default function PieChart(parent, chartData){
    if (parent == null)return;
    var id = chartData.id != undefined ? chartData.id : '';
    var w = chartData.w != undefined ? chartData.w : 300;
    var h = chartData.h != undefined ? chartData.h : 300;
    var dataset = chartData.data != undefined ? chartData.data : [7,3];
    var radius = chartData.radius != undefined ? chartData.radius : 100;
    var IsCircle = chartData.IsCircle != undefined ? chartData.IsCircle : false;
    var circleText = chartData.circleText != undefined ? chartData.circleText : []
    var IsText = chartData.IsText != undefined ? chartData.IsText : false;

    if(!isValid(dataset)){
        return callBack();
    }

    var pie=d3.pie().sort(
        function (a, b) {
            return dataset.indexOf(a) - dataset.indexOf(b);
        }
    );
    var outerRadius=w/2;//外半径
    var innerRadius=radius;//内半径
    var arc=d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    var svg=parent
        .append("svg")
        .attr("class", chartData.class)
        .attr("width",w)
        .attr("height",h)
        .attr("viewBox", "0 0 " + w + " " + h)
        .attr("style","width:100%");

    var arcs=svg.selectAll("g.arc")
        .data(pie(dataset))
        .enter()
        .append("g")
        .attr("class","arc")
        .attr("transform","translate("+outerRadius+","+outerRadius+")");


    arcs.append("path")
        .attr("class", function (d, i) {
            return 'line-'+i;
        })
        // .attr("fill",function(d,i){
        //     return color[i];
        // })
        .attr("d",arc);

    if(IsCircle){
        arcs.append("circle")
            .attr("r", innerRadius)
            .attr("class", 'circle-color')
            // .attr("fill", circleColor)
    }

    arcs.append("text")
        .selectAll("tspan")
        .data(circleText)
        .enter()
        .append("tspan")
        .attr("class", function (d, i) {
            return d.class;
        })
        .attr("x", function (d, i) {
            return d.x;
        })
        .attr("y", function (d, i) {
            return d.y;
        })
        .text(function (d, i) {
            return d.value;
        })


    if(IsText){
        arcs.append("text")
            .attr("transform",function(d){
                return "translate("+arc.centroid(d)+")";//定位文字到图形的中心
            })
            .attr("text-anchor","middle")//文字居中
            .text(function(d){
                return d.value;
            })
    }
    function isValid(data) {
        if(!data || data.length==0){
            return false;
        }

        var validNum = 0;
        for(var i=0;i<data.length;i++){
            if(data[i]==0){
                validNum++;
            }
        }

        if(validNum == data.length){
            return false;
        }

        return true;
    }

    function callBack() {
        return {
            id: id,
            destory:function () {
                parent.select('svg').remove();
            }
        }
    }

    return callBack();
}
