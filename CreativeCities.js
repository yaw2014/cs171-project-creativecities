/**
 * Created by hen on 3/8/14.
 */

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

var width = 500 - margin.left - margin.right;
var height = 400 - margin.bottom - margin.top;
var active = d3.select(null);

var bbVis = {
    x: margin.left,
    y: margin.top,
    w: width,
    h: height
};

var bbVisDetail = {
    x: margin.left,
    y: margin.top,
    w: 300,
    h: 200
};

var detailVis = d3.selectAll("#detailVis").append("svg").attr({
    width:bbVisDetail.w+margin.left+margin.right,
    height:bbVis.h+margin.top+margin.bottom
})
var detailVis2 = d3.selectAll("#detailVis2").append("svg").attr({
    width:bbVisDetail.w+margin.left+margin.right,
    height:bbVis.h+margin.top+margin.bottom
})

//var x = d3.time.scale()
//    .range([0, bbVisDetail.w]);//.domain([new Date("0"),new Date("4")]);

var voronoi = d3.geom.voronoi();










var x = d3.scale.ordinal().rangeRoundBands([0, bbVisDetail.w], .05);

var y = d3.scale.linear().range([bbVisDetail.h, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.time.format("%X %p"));

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("right")
    .ticks(10);
//
//var xScale = d3.scale.ordinal().range([bbVisDetail.w,0]);//rangeRoundBands([bbVisDetail.w,0], .8, 0)
//var yScale = d3.scale.linear().range([bbVisDetail.h, 0]);

var gDetail = detailVis.append("g")
    .attr("transform", "translate("+bbVisDetail.x+","+bbVisDetail.y+")");

var gDetail2 = detailVis2.append("g")
    .attr("transform", "translate("+bbVisDetail.x+","+bbVisDetail.y+")");


var detailVisText = gDetail.append("text")
    .style("text-anchor", "start")
    .text("");

var detailVisText2 = gDetail2.append("text")
    .style("text-anchor", "start")
    .text("");


var gXAxis = gDetail.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + bbVisDetail.h + ")")
    .call(xAxis);

var gXAxis2 = gDetail2.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + bbVisDetail.h + ")")
    .call(xAxis);


var gYAxis = gDetail.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + bbVisDetail.w + ",0)")
    .call(yAxis);

var gYAxis2 = gDetail2.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + bbVisDetail.w + ",0)")
    .call(yAxis);


//    .append("text")
//    .attr("transform", "rotate(-90)")
//    .attr("y", 6)
//    .attr("dy", "-1em")
//    .style("text-anchor", "end")
//    .text("Population");
//
//var workAsArray = ["01:00:00 AM", "02:00:00 AM", "03:00:00 AM", "04:00:00 AM", "05:00:00 AM", "06:00:00 AM", "07:00:00 AM", "08:00:00 AM", "09:00:00 AM", "10:00:00 AM", "11:00:00 AM", "12:00:00 PM", "13:00:00 PM", "14:00:00 PM", "15:00:00 PM", "16:00:00 PM", "17:00:00 PM", "18:00:00 PM", "19:00:00 PM", "20:00:00 PM", "21:00:00 PM", "22:00:00 PM", "23:00:00 PM", "00:00:00 AM"];
//
//var bars = gDetail.append("g")
//    .attr("class","rect");
var data = [];

var bar = gDetail.append("g")
    .attr("class","bar").selectAll("bar")
    .data(data)
    .enter().append("rect")
    .attr("class","bar")
    .style("fill", "steelblue")
    .attr("x", function(dd) { return x(dd.hour); })
    .attr("width", x.rangeBand())
    .attr("y", function(dd) { return y(dd.val); })
    .attr("height", function(dd) { return bbVisDetail.h - y(dd.val); });

var bar2 = gDetail2.append("g")
    .attr("class","bar").selectAll("bar")
    .data(data)
    .enter().append("rect")
    .attr("class","bar")
    .style("fill", "steelblue")
    .attr("x", function(dd) { return x(dd.hour); })
    .attr("width", x.rangeBand())
    .attr("y", function(dd) { return y(dd.val); })
    .attr("height", function(dd) { return bbVisDetail.h - y(dd.val); });




var tooltip = d3.select("body")
    .append("div")
    .attr("class","d3tip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden");




var canvas = d3.selectAll("#vis").append("svg").attr({
    width: bbVis.w,
    height: bbVis.h
    })

var canvas2 = d3.selectAll("#vis2").append("svg").attr({
    width: bbVis.w,
    height: bbVis.h
})


canvas.append("rect")
    .attr("class", "background")
    .attr("width", bbVis.w)
    .attr("height", bbVis.h)
    .on("click", resetZoom);

canvas2.append("rect")
    .attr("class", "background2")
    .attr("width", bbVis.w)
    .attr("height", bbVis.h)
    .on("click", resetZoom2);


var svg = canvas.append("g").attr({
        transform: "translate(" +bbVis.x/2 + "," + bbVis.y/2 + ")"
    }).style("stroke-width", "1.5px");

var svg2 = canvas2.append("g").attr({
    transform: "translate(" +bbVis.x/2 + "," + bbVis.y/2 + ")"
}).style("stroke-width", "1.5px");


var mscale = Math.max(bbVis.w, bbVis.h);
var projection = d3.geo.albersUsa().translate([bbVis.w / 2, bbVis.h / 2]).scale(mscale);//.precision(.1);
var path = d3.geo.path().projection(projection);
//var screencoord = projection([longitude, latitude]);

var dataSet = {};

var cScale = d3.scale.linear().range([1, 2]);

var vertices=[];

function loadStations() {
    d3.csv("data/NSRDB_StationsMeta.csv",function(error,data){
        //....

        var ndata = data.filter(function(d){
            var screencoord = projection([d["NSRDB_LON(dd)"], d["NSRDB_LAT (dd)"]])
            if(screencoord != null){
                return d;
              }
        })


        // Data functions
        var vert = function(d){return d.Locatoin;}

        d3.json("data/all_data_01.json",function(err,dat){
            $.each(dat,function(id, ob){
                //console.log(id);
                if(id>1){
                    vertices.push(projection([ob.location.lng,ob.location.lat]))
                }
            })
            console.log(vertices);

            var pathV = svg.append("g").attr("class","voronoi").selectAll("path");
            console.log(vertices.slice(1));

            svg.selectAll("circle")
                .data(vertices.slice(1))
                .enter().append("circle").attr("class","voroCirc")
                .attr("transform", function(d) { return "translate(" + d + ")"; })
                .attr("r", 0.05);

            redraw();

            function redraw() {
                pathV = pathV
                    .data(voronoi(vertices), polygon);

                pathV.exit().remove();

                pathV.enter().append("path").attr("clip-path", "url(#clip4)")
                    .attr("class", function(d, i) { return "q" + (i % 9) + "-9"; })
                    .attr("d", polygon);

                pathV.order();
            }

            function polygon(d) {
                return "M" + d.join("L") + "Z";
            }
        });


//        svg.append("g").attr("class","cg").selectAll("circle").data(ndata).enter().append("circle")
//            .attr('cx', function(d){var screencoord = projection([d["NSRDB_LON(dd)"], d["NSRDB_LAT (dd)"]]); return screencoord[0];/*console.log(screencoord[0])*/;})
//            .attr('cy', function(d){var screencoord = projection([d["NSRDB_LON(dd)"], d["NSRDB_LAT (dd)"]]); return screencoord[1]; /*console.log(screencoord[1])*/;})
//            .attr('r', function(d){ var sumAgg = completeDataSet[d["USAF"]]; if(sumAgg){return cScale(sumAgg["sum"]);}else{return 1;}})
//            .attr("fill",function(d){ var sumAgg = completeDataSet[d["USAF"]]; if(sumAgg){return "red";}else{return "gray";}})
//            .on("mouseover", showVal)
//            .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
//            .on("mouseout", function(d){d3.select(this).attr("r", function(d){ var sumAgg = completeDataSet[d["USAF"]]; if(sumAgg){return cScale(sumAgg["sum"]);}else{return 1;}}).attr("fill", function(d){ var sumAgg = completeDataSet[d["USAF"]]; if(sumAgg){return "red";}else{return "gray";}}); return tooltip.style("visibility", "hidden");})
//            .on("click",updateDetail);
//
//        svg2.append("g").attr("class","cg2").selectAll("circle").data(ndata).enter().append("circle")
//            .attr('cx', function(d){var screencoord = projection([d["NSRDB_LON(dd)"], d["NSRDB_LAT (dd)"]]); return screencoord[0];/*console.log(screencoord[0])*/;})
//            .attr('cy', function(d){var screencoord = projection([d["NSRDB_LON(dd)"], d["NSRDB_LAT (dd)"]]); return screencoord[1]; /*console.log(screencoord[1])*/;})
//            .attr('r', function(d){ var sumAgg = completeDataSet[d["USAF"]]; if(sumAgg){return cScale(sumAgg["sum"]);}else{return 1;}})
//            .attr("fill",function(d){ var sumAgg = completeDataSet[d["USAF"]]; if(sumAgg){return "red";}else{return "gray";}})
//            .on("mouseover", showVal)
//            .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
//            .on("mouseout", function(d){d3.select(this).attr("r", function(d){ var sumAgg = completeDataSet[d["USAF"]]; if(sumAgg){return cScale(sumAgg["sum"]);}else{return 1;}}).attr("fill", function(d){ var sumAgg = completeDataSet[d["USAF"]]; if(sumAgg){return "red";}else{return "gray";}}); return tooltip.style("visibility", "hidden");})
//            .on("click",updateDetail2);
    });
}


function loadStats() {

    d3.json("data/unrelated/reducedMonthStationHour2003_2004.json", function(error,data){
        completeDataSet= data;

        var cdsArray = [];
        var objArr = completeDataSet;
        for(var n in objArr){
            cdsArray.push(objArr[n]["sum"]);
        }

        var max = d3.max(cdsArray);
        cScale.domain([0,max]);

        //console.log(completeDataSet);
        loadStations();
    })

}


d3.json("data/us-named.json", function(error, data) {

    var usMap = topojson.feature(data,data.objects.states).features
    var usM = topojson.feature(data,data.objects.states);


    var selected = {
        "25": 1
    };

    selection = {type: "FeatureCollection", features: usM.features.filter(function(d) { return d.id in selected; })};

    var defs = svg.append("defs");

    defs.append("clipPath")
        .attr("id", "clip4")
        .append("path")
        .datum(selection)
        .attr("d",path);

    svg.selectAll(".country")
        .data(usMap)
        .enter().append("path")
        .attr("d",path)
        .attr("class", "feature")
        .on("click", zoomToBB);

    svg2.selectAll(".country")
        .data(usMap)
        .enter().append("path")
        .attr("d",path)
        .attr("class", "feature2")
        .on("click", zoomToBB2);
    // see also: http://bl.ocks.org/mbostock/4122298

    loadStats();
});



// ALL THESE FUNCTIONS are just a RECOMMENDATION !!!!
var createDetailVis = function(){

}


var updateDetailVis = function(data, name){

}


function showVal(d,i){
    d3.select(this)
        //.attr("r", 6)
        .attr("fill","black");
    var sumAgg = completeDataSet[d["USAF"]];
    var tempVal = 0;
    if(sumAgg){tempVal = sumAgg["sum"];}else{tempVal = 0;}
    return tooltip.style("visibility", "visible")
                    .html("<div class='tipSpan'><h1>"+d.ST+"</h1><h2>"+d.STATION+"</h2><h3>"+tempVal+"</h3><p>USAF: "+d.USAF+"</p>");
}

// ZOOMING
function zoomToBB(d) {

    if (active.node() === this) return resetZoom();
    active.classed("active", false);
    active = d3.select(this).classed("active", true);

    var bounds = path.bounds(d),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        scale = .9 / Math.max(dx / bbVis.w /2, dy / bbVis.h /2),
        translate = [bbVis.w / 2 - scale * x, bbVis.h / 2 - scale * y];

    svg.transition()
        .duration(750)
        .style("stroke-width", 1.5 / scale + "px")
        .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

}

function zoomToBB2(d) {

    if (active.node() === this) return resetZoom2();
    active.classed("active", false);
    active = d3.select(this).classed("active", true);

    var bounds = path.bounds(d),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        scale = .9 / Math.max(dx / bbVis.w /2, dy / bbVis.h /2),
        translate = [bbVis.w / 2 - scale * x, bbVis.h / 2 - scale * y];

    svg2.transition()
        .duration(750)
        .style("stroke-width", 1.5 / scale + "px")
        .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

}
//
//function resetZoom() {
//
//    active.classed("active", false);
//
//    active = d3.select(null);
//
//    svg.transition()
//        .duration(750)
//        .style("stroke-width", "1.5px")
//        .attr("transform", "");
//
//}

function resetZoom() {

    active.classed("active", false);
    active = d3.select(null);

    svg.transition()
        .duration(750)
        .style("stroke-width", "1.5px")
        .attr("transform", "");


}

function resetZoom2() {

    active.classed("active", false);
    active = d3.select(null);

    svg2.transition()
        .duration(750)
        .style("stroke-width", "1.5px")
        .attr("transform", "");


}

function updateDetail(d,i) {

    $(".barC").remove();

    var hformat =  d3.time.format("%X %p");
    var hourlyObj = completeDataSet[d["USAF"]]["hourly"];
    data = [];

    detailVisText.text(d.STATION);

    $.each(hourlyObj, function(key, value){
        var result = {};
        result.hour = hformat.parse(key);
        result.val = value;
        data.push(result);
    })

    x.domain(data.map(function(d) { return d.hour; }));
    y.domain([0, d3.max(data, function(d) { return d.val; })]);

    gXAxis.call(xAxis);

    gXAxis.selectAll("text")
        .attr("x", "-0.9em")
        .attr("y", "0.6em")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");


    gYAxis.call(yAxis);

    d3.selectAll(".barC").remove();

    bar.data(data)
        .enter().append("rect")
        .attr("class", "barC")
        .style("fill", "red")
        .attr("x", function(dd) { return x(dd.hour); })
        .attr("width", x.rangeBand())
        .attr("y", function(dd) { return y(dd.val); })
        .attr("height", function(dd) { return bbVisDetail.h - y(dd.val); });




}

function updateDetail2(d,i) {

    $(".barC2").remove();

    var hformat =  d3.time.format("%X %p");
    var hourlyObj = completeDataSet[d["USAF"]]["hourly"];
    data = [];

    detailVisText2.text(d.STATION);

    $.each(hourlyObj, function(key, value){
        var result = {};
        result.hour = hformat.parse(key);
        result.val = value;
        data.push(result);
    })

    x.domain(data.map(function(d) { return d.hour; }));
    y.domain([0, d3.max(data, function(d) { return d.val; })]);

    gXAxis2.call(xAxis);

    gXAxis2.selectAll("text")
        .attr("x", "-0.9em")
        .attr("y", "0.6em")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");


    gYAxis2.call(yAxis);

    d3.selectAll(".barC2").remove();

    bar2.data(data)
        .enter().append("rect")
        .attr("class", "barC2")
        .style("fill", "red")
        .attr("x", function(dd) { return x(dd.hour); })
        .attr("width", x.rangeBand())
        .attr("y", function(dd) { return y(dd.val); })
        .attr("height", function(dd) { return bbVisDetail.h - y(dd.val); });




}