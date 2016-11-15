function buildTreeChart(csvData) {

    // Define the div for the tooltip
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

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
        .parentId(function(d) {
            return d.id.substring(0, d.id.lastIndexOf("."));
        });

    var treemap = d3.treemap()
        .size([width, height])
        .padding(1)
        .round(true);

    var data = d3.csvParse(csvData, function(d) {
        var splitArray = d.id.split(".");
        if (splitArray[1] === currentYear || splitArray.length == 1) {
            return {
                id: d.id, // lowercase
                value: +d.value // lowercase
            };
        }
    });

    //console.log(data);

    var root = stratify(data)
        .sum(function(d) {
            return d.value;
        })
        .sort(function(a, b) {
            return b.height - a.height || b.value - a.value;
        });

    //console.log(root);

    treemap(root);

    function draw(data) {
        $("#treeChart").empty();
        d3.select("#treeChart")
            .selectAll(".node")
            .data(data.leaves())
            .enter().append("div")
            .attr("class", "node")
            .attr("group", function(d) {
                var title = d.id;
                var rawGroup = title.split(/\r?\n|\r/);
                var group = rawGroup[0].substring(rawGroup[0].lastIndexOf(".") + 1)
                return group;
            })
            .attr("expenditure", function(d) {
                return d.value;
            })
            .style("left", function(d) {
                return d.x0 + "px";
            })
            .style("top", function(d) {
                return d.y0 + "px";
            })
            .style("width", function(d) {
                return d.x1 - d.x0 + "px";
            })
            .style("height", function(d) {
                return d.y1 - d.y0 + "px";
            })
            .style("background", function(d) {
                var splitArray = d.id.split(".");
                if (splitArray[2] === "gr") {
                    return gunColors[1];
                } else {
                    return gunColors[0];
                }
            })
            .on("mouseover", function(d) {
                console.log("mouseover");
                var html = "<span class='callout-label'>"+$(this).attr('group')+"</span>";
                    html += "$"+ format($(this).attr('expenditure'));
                $("#callout-treemap").html(html).show()

            })
            .on("mouseout", function() {
                console.log("mouseout");
                $("#callout-treemap").hide();


            })
            .append("div")
            .attr("class", "node-label")
            .text(function(d) {
                var width = d.x1 - d.x0;
                var height = d.y1 - d.y0;
                if (width >= 80 && height >= 80) {
                    return d.id.substring(d.id.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g).join("\n");
                }

            })
            .append("div")
            .attr("class", "node-value")
            .text(function(d) {
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

        var data = d3.csvParse(csvData, function(d) {
            var splitArray = d.id.split(".");
            if (splitArray[1] === year.toString() || splitArray.length == 1) {
                return {
                    id: d.id, // lowercase
                    value: +d.value // lowercase
                };
            }
        });
        console.log(data);

        var root = stratify(data)
            .sum(function(d) {
                return d.value;
            })
            .sort(function(a, b) {
                return b.height - a.height || b.value - a.value;
            });
        console.log(root);

        treemap(root);
        draw(root);

    }

    switchGunBills(currentYear);

    //$("#yearSelector").change(function () {
    //var year = $("#yearSelector").val();
    $(".drop-menu li").click(function() {
        currentYear = $(this).data("selectedyear");
        switchData(currentYear);
        switchGunBills(currentYear);
        console.log(currentYear);
        //$(".li-label").text(year);
    });


}
