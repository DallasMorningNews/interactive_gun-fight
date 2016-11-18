$(window).load(function() {
    $("body").dnLoader("remove");
});

$(document).ready(function() {

    //GET URL PARAM
    $.urlParam = function(name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        //if no var then just use "gc"
        if (results) {
            return results[1] || 0;
        } else {
            return "gc";
        }
    }
    var side = $.urlParam('side');
    console.log(side);

    //Initialize display
    swapContent(side);
    //$("#hero-gr").hide();

    //Get height of img
    var heroHeight = $("#hero-gc").height();
    $("#hero").height(heroHeight);

    $(window).resize(function() {
        heroHeight = $("#hero-gc").height();
        $("#hero").height(heroHeight);
    });

    $(window).on('scroll', function() {
         var scrollTop = $(this).scrollTop();
             var triggerDistance = $(".intro-box").offset().top;
             if ( (triggerDistance-100) < scrollTop ) {
                 $(".fixed-buttons-bar").fadeIn();
            } else {
                $(".fixed-buttons-bar").hide();
            }
    });

    var gunMoney = "data/gunOrgSpending.json";

    var startYear = 2000;
    var endYear = 2016;

    var gunControlAnnuals = {};
    var gunRightsAnnuals = {};

    var indices = ["Gun Control", "Gun Rights"];

    //Array of unique gun orgs
    var gunOrgs = [];

    var yearData = [];

    for (i = startYear; i <= endYear; i++) {
        $(".drop-menu").append("<li data-selectedYear=" + i + ">" + i + "</li>");
    }

    $.getJSON(gunMoney).done(function(data) {

        // Shortcut to groups
        var gunControl = data.spending[0].gunControl;
        var gunRights = data.spending[1].gunRights;

        //Build arrays for each groups


        /*---------------------------------------------------------------
        			 BUILD ORG FEVERS csv
        ---------------------------------------------------------------*/

        //Build an array of ALL gun orgs
        for (i = startYear; i <= endYear; i++) {
            $.each(gunControl, function(index, value) {
                //console.log();
                $.each(value, function(index, value) {
                    gunOrgs.push(value.name);
                    //Add to group arrays for counting sides
                    gunControlGroups.push(value.name);
                });
            });
            $.each(gunRights, function(index, value) {
                //console.log();
                $.each(value, function(index, value) {
                    gunOrgs.push(value.name);
                    //Add to group arrays for counting sides
                    gunRightsGroups.push(value.name);
                });
            });
        }
        gunControlGroups = _.uniqBy(gunControlGroups);
        gunRightsGroups = _.uniqBy(gunRightsGroups);
        //console.log(gunRightsGroups);

        //GUN ORG COUNTS
        gunOrgCounts = _.countBy(gunOrgs);

        //Build top line of gun orgs csv
        //var csvOrgData = "year,";
        var orgArray = ["year"];
        $.each(gunOrgCounts, function(index, value) {
            //csvOrgData += index+",";
            orgArray.push(index);
        });
        var csvOrgData = orgArray + "\n";



        /*---------------------------------------------------------------
        			 BUILD TREE MAP csv
        ---------------------------------------------------------------*/

        var csvData = "id,value\n";
        csvData += "flare,\n";

        for (i = startYear; i <= endYear; i++) {

            //FOR GUN ORG CHART
            yearArray = [i.toString()];

            csvData += "flare." + i.toString() + ",\n";
            var group1header = false;
            var group2header = false;
            //console.log(i);
            $.each(data.spending, function(index, value) {
                if (index === 0) {
                    group = "gc";
                    //console.log("     "+group);
                    //console.log(value.gunControl[i.toString()]);
                    if (!group1header) {
                        //console.log("false: "+group1header);
                        csvData += "flare." + i.toString() + "." + group + ",\n";
                        $.each(value.gunControl[i.toString()], function(ind, val) {
                            //console.log(val.name);

                            var orgIndex = $.inArray(val.name, orgArray);
                            if (parseInt(val.expenditures) > 0) {
                                yearArray[orgIndex] = val.expenditures;
                            }

                            csvData += "flare." + i.toString() + "." + group + "." + val.name + "," + val.expenditures + "\n";
                        });
                        group1header = true;
                    }
                }
            });
            $.each(data.spending, function(index, value) {
                if (index === 1) {
                    group = "gr";
                    //console.log("     "+group);
                    //console.log(value.gunControl[i.toString()]);
                    if (!group2header) {
                        //console.log("false: "+group2header);
                        csvData += "flare." + i.toString() + "." + group + ",\n";
                        $.each(value.gunRights[i.toString()], function(ind, val) {
                            //console.log(val.name);

                            var orgIndex = $.inArray(val.name, orgArray);
                            if (parseInt(val.expenditures) > 0) {
                                yearArray[orgIndex] = val.expenditures;
                            }


                            csvData += "flare." + i.toString() + "." + group + "." + val.name + "," + val.expenditures + "\n";
                        });
                        group2header = true;
                    }
                }
            });
            //console.log(yearArray);
            csvOrgData += yearArray + "\n";
        }


        /*---------------------------------------------------------------
                    BUILD YEAR CHART json
        ---------------------------------------------------------------*/

        // Loop through every year
        for (i = startYear; i <= endYear; i++) {

            // Blank object to be pushed into yearData for first chart
            mainYear = {};
            mainYear.Year = i;

            // Initialize annual totals to 0
            gunRightsAnnuals[i] = 0;
            gunControlAnnuals[i] = 0;

            //console.log("    Gun Rights");
            gunRights[i.toString()].forEach(function(year) {
                //console.log(parseInt(year.expenditures));
                gunRightsAnnuals[i.toString()] += parseInt(year.expenditures);
            });

            //console.log("    Gun Control");
            gunControl[i.toString()].forEach(function(year) {
                //console.log(parseInt(year.expenditures));
                gunControlAnnuals[i.toString()] += parseInt(year.expenditures);
            });



            mainYear["Gun Control"] = gunControlAnnuals[i.toString()];
            mainYear["Gun Rights"] = gunRightsAnnuals[i.toString()];
            mainYear.total = parseInt(gunControlAnnuals[i.toString()]) + parseInt(gunRightsAnnuals[i.toString()]);

            yearData.push(mainYear);

        }

        /*---------------------------------------------------------------
                    BUILD TOTALS CHART
        ---------------------------------------------------------------*/
        var gunControlTotals = 0;
        var gunRightsTotal = 0;

        $.each(yearData, function(key, val) {
            gunControlTotals += val["Gun Control"];
            gunRightsTotal += val["Gun Rights"];
        });

        buildTotalsChart(gunControlTotals, gunRightsTotal);
        buildYearChart(yearData);
        buildOrgChart(csvOrgData);
        buildTreeChart(csvData);

    });



    // injecting current year into footer
    // DO NOT DELETE

    var d = new Date();
    var year = d.getFullYear();

    $('.copyright').text(year);

});
