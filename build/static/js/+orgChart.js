function buildOrgChart(data) {
    console.log("--------------   In buildOrgChart()  --------------");
    //console.log(data);
    var gunColors = ["#4295DE", "#D8322A"];
    /*
    ----------------------------------------
          INITIALIZE THE SVG CONTAINER
    ----------------------------------------
    */

    var orgMargin = {left:50,right:50,top:40,bottom:40};
    var width = $("#orgChart").width();
    var height = 500;

    //Parse csv into array of objects
    var data = d3.csvParse(data);
    //console.log(data);
    var max = d3.max(data,function(d){ return parseInt(d["Violence Policy Center"])});
    var minDate = d3.min(data,function(d){return parseInt(d.year);})
    var maxDate = d3.max(data,function(d){return parseInt(d.year);})
    var x = d3.scaleLinear()
        .domain([minDate,maxDate])
        .range([0,width]);
    var y = d3.scaleLinear()
        .domain([0,max])
        .range([height,0]);
    var xAxis = d3.axisBottom(x)
        .tickFormat(d3.format(""));
    var yAxis = d3.axisLeft(y)
        .tickFormat(d3.format(".2s"));

    var orgSvg = d3.select("#orgChart")
        .append("svg")
            .attr("height",height+orgMargin.bottom)
            .attr("width",width);

    var orgGroup = orgSvg.append("g")
        .attr("transform","translate("+orgMargin.left+",10)")

    orgGroup.append("g").attr("class","x axis").attr("transform","translate(0,"+height+")").call(xAxis);
    orgGroup.append("g").attr("class","y axis").call(yAxis);

    var series = data.columns.slice(1).map(function(key) {
        return data.map(function(d) {
            return {
                key: key,
                year: d.year,
                value: d[key]
            };
        });
    });

    //console.log(series);


    var serie = orgGroup.selectAll(".serie")
        .data(series)
        .enter().append("g")
        .attr("class", "serie");

    serie.append("path")
        .attr("class", "line")
        .style("stroke", function(d) { return d[0].key; })
        .attr("d", d3.line()
        .x(function(d) { return y(d.year); })
        .y(function(d) { return y(d.value); }));

    var line = d3.line()
        .defined(function(d) { //console.log(d);
            if (d.value>0)return d; })
        .y(function(d){return y(d.value);})
        .x(function(d){return x(d.year)});

    orgGroup.append("path").attr("d",line(data));

    orgGroup.selectAll(".dot")
        .data(data.filter(function(d) { if (d["Violence Policy Center"]>0)return d; }))
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", line.x())
        .attr("cy", line.y())
        .attr("r", 7);

}
