function buildTreeChart(csvData) {

  function type(d) {
    d.value = +d.value;
    return d;
  }

  console.log("--------------   In buildTreeChart()  --------------");

  //console.log(csvData);

  var width = $("#treeChart").width();
  var height = 500;

var gunColors = ["#88C5F2", "#E3C357"];

  //var format = d3.format(",d");
  var format = d3.format(",.0f");

  var color = d3.scaleOrdinal()
    .domain(["gc", "gr"])
    .range(gunColors);

  var stratify = d3.stratify()
    .parentId(function (d) {
      return d.id.substring(0, d.id.lastIndexOf("."));
    });

  var treemap = d3.treemap()
    .size([width, height])
    .padding(1)
    .round(true);

  var data = d3.csvParse(csvData, function (d) {
    var splitArray = d.id.split(".");
    if (splitArray[1] === firstYear || splitArray.length == 1) {
      return {
        id: d.id, // lowercase
        value: +d.value // lowercase
      };
    }
  });

  var root = stratify(data)
    .sum(function (d) {
      return d.value;
    })
    .sort(function (a, b) {
      return b.height - a.height || b.value - a.value;
    });

  treemap(root);

  function draw(data) {
    $("#treeChart").empty();
    d3.select("#treeChart")
      .selectAll(".node")
      .data(data.leaves())
      .enter().append("div")
      .attr("class", "node")
      .attr("title", function (d) {
        return d.id + "\n" + format(d.value);
      })
      .style("left", function (d) {
        return d.x0 + "px";
      })
      .style("top", function (d) {
        return d.y0 + "px";
      })
      .style("width", function (d) {
        return d.x1 - d.x0 + "px";
      })
      .style("height", function (d) {
        return d.y1 - d.y0 + "px";
      })
      .style("background", function (d) {
        var splitArray = d.id.split(".");
        if (splitArray[2] === "gr") {
          return gunColors[1];
        } else {
          return gunColors[0];
        }
      })
      .append("div")
      .attr("class", "node-label")
      .text(function (d) {
        var width = d.x1 - d.x0;
        var height = d.y1 - d.y0;
        if (width >= 80 && height >= 80) {
          return d.id.substring(d.id.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g).join("\n");
        }

      })
      .append("div")
      .attr("class", "node-value")
      .text(function (d) {
        var width = d.x1 - d.x0;
        var height = d.y1 - d.y0;
        if (width >= 80 && height >= 80) {
          return "$" + format(d.value);
        }
      });
  }

  draw(root);

  function switchData(year) {

    console.log("switchData(" + year + ")");

    data = d3.csvParse(csvData, function (d) {
      var splitArray = d.id.split(".");
      if (splitArray[1] === year || splitArray.length == 1) {
        return {
          id: d.id, // lowercase
          value: +d.value // lowercase
        };
      }
    });
    console.log(data);

    root = stratify(data)
      .sum(function (d) {
        return d.value;
      })
      .sort(function (a, b) {
        return b.height - a.height || b.value - a.value;
      });
    console.log(root);

    treemap(root);

    draw(root);

  }

  switchGunBills(firstYear);

  //$("#yearSelector").change(function () {
    //var year = $("#yearSelector").val();
    $(".year-list li").click(function(){
         var year = $(this).data("selectedyear");
         switchData(year);
         switchGunBills(year);
         console.log(year);
    });


}
