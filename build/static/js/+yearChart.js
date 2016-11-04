function buildYearChart(data) {

  console.log("--------------   In buildYearChart()  --------------");
  //console.log(data);

  var width = $("#yearChart").width();
  var height = 500;

  var gunColors = ["#88C5F2", "#E3C357"];

  /*
  ----------------------------------------
        INITIALIZE THE SVG CONTAINER
  ----------------------------------------
  */

  var yearChartSVG = d3.select("#yearChart").append("svg").attr("width", width).attr("height", height);
  var margin = {
    top: 5,
    right: 0,
    bottom: 17,
    left: 25
  };
  width = width - margin.left - margin.right;
  height = height - margin.top - margin.bottom;
  group = yearChartSVG.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  /* RANGES AND DOMAINS
  ----------------------------------------
                  X
  ----------------------------------------
  */ //Set the X range from 0 - width of div
  var x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1)
    .align(0.1);

  //Set the X domain to the "Year" attribute
  x.domain(data.map(function (d) {
    return d.Year;
  }));


  /*
  ----------------------------------------
                  Y
  ----------------------------------------
  */ //Set the Y range from 0 - width of div
  var y = d3.scaleLinear()
    .rangeRound([height, 0]);

  //Set the Y domain to the "Total" attribute
  y.domain([0, d3.max(data, function (d) {
    return d.total;
  })]).nice();

  /*
  ----------------------------------------
                  Z
  ----------------------------------------
  */ //Set the Z range which looks like color bars
  var z = d3.scaleOrdinal()
    .range([gunColors[0], gunColors[1]]);

  //Set the Z domain or color key
  z.domain(["Gun Control", "Gun Rights"]);

  /*
  ----------------------------------------
                   Stack
  ----------------------------------------
  */ //sets the stack generator to "stack"
  var stack = d3.stack();

  /*
  ----------------------------------------
          Define the categories
  ----------------------------------------
  */ //Since the json has other attributes, manually set the ones to chart

  var categories = ["Gun Control", "Gun Rights"];

  group.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  group.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y).ticks(10, "s").tickSize(width*-1))
    .append("text")
    .attr("x", 2)
    .attr("y", y(y.ticks(10).pop()))
    .attr("dy", "0.35em")


  group.selectAll(".serie")
    .data(stack.keys(categories)(data))
    .enter().append("g")
    .attr("class", "serie")
    .attr("fill", function (d) {
      return z(d.key);
    })
    .selectAll("rect")
    .data(function (d) {
      return d;
    })
    .enter().append("rect")
    .attr("x", function (d) {
      return x(d.data.Year);
    })
    .attr("y", function (d) {
      return y(d[1]);
    })
    .attr("height", function (d) {
      return y(d[0]) - y(d[1]);
    })
    .attr("width", x.bandwidth());



  /*
  ----------------------------------------
        Add the legend
  ----------------------------------------
  */ 
  var legend = group.selectAll(".legend")
    .data(categories.reverse())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
      return "translate(0," + i * 20 + ")";
    })
    .style("font", "10px sans-serif");

  legend.append("rect")
    .attr("x", 30)
    .attr("y", 30)
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", z);

  legend.append("text")
    .attr("x", 58)
    .attr("y", 38)
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .text(function (d) {
      return d;
    });

}
