//Hide any image that throws a 404
function imgerror(image) {
    image.style.display = 'none';
}

//Sort counts for objects
function sortCounts(objects) {
    var sortable = [];
    for (var object in objects)
        sortable.push([object, objects[object]]);
    sortable.sort(
        function(a, b) {
            return b[1] - a[1];
        }
    );
    return sortable;
}

//Switch gun bill info based on year
function switchGunBills(year) {
    //Clear out content
    $('#bill-list').empty();

    //Set data urls in one place
    var billURL = "data/gunBills" + year + ".json";
    //var sponsorsURL = "data/gunSponsors.json";

    //To hold parsed sponsor data
    var sponsors = {};

    //We're going to count who sponsored the most
    var totalRepublicans = 0;
    var totalDemocrats = 0;
    var totalOther = 0;

    //We're going to count by subject
    var subjects = [];

    //Stick year on end of heads
    $(".head-year").text(year);

    //Get bill information
    $.getJSON(billURL).done(function(data) {

        //Holds number fo bills
        var numberOfBills = 0;
        //Hold counts for each status
        var statusArray = [];
        //Hold counts for each sponsor
        var sponsorArray = [];
        //Hold counts for each party
        var partyArray = [];
        //Hold counts for each group
        var lobbiedArray = [];
        //Hold counts for each sponsor
        var groupsArray = [];
        //Hold counts for each subject
        var subjectsArray = [];

        //Reset list div
        $('#bill-list').html("")

        $("#bill-groups").empty().html("<strong>Groups:</strong><br/>");
        $("#bill-parties").empty().html("<strong>Party:</strong><br/>");
        $("#bill-statuses").empty().html("<strong>Status:</strong><br/>");
        $("#bill-tags").empty().html("<strong>Tags:</strong><br/>");

        $.each(data, function(k, v) {
            if (v["subjects-top-term"] != "Native Americans" && v["subjects-top-term"] != "Animals" && v["subjects-top-term"] != "Agriculture and food" && v["subjects-top-term"] != "Economics and public finance" && v["subjects-top-term"] != "Education" && v["subjects-top-term"] != "Energy" && v["subjects-top-term"] != "Labor and employment" && v["subjects-top-term"] != "Private legislation" && v["subjects-top-term"] != "Water resources development") {

                //Increment totals
                numberOfBills++;
                statusArray.push(v.status);
                //sponsorArray.push(v.sponsor.first_name+" "+v.sponsor.last_name);

                var billDate = Date.parse(v.introduced);

                var html = "";
                html += "<div data-date='" + billDate + "'data-tag='" + v["subjects-top-term"] + "' data-groups='"+ v.lobbied+"'  data-party='"+v.sponsor.party+"' class='bill'>";

                //Bill number
                billNumberArray = v.number.split("-");
                html += "     <span class='bill-header bill-number'>" + billNumberArray[0].toUpperCase() + "</span>";

                //Date introduced
                var dateArray = v.introduced.split("-");
                html += "     <span class='bill-header bill-date'>" + monthNames[(parseInt(dateArray[1]) - 1)] + " " + dateArray[2] + ", " + dateArray[0] + "</span>";

                //Bill subject used for tagging
                html += "     <span class='bill-tag'>" + v["subjects-top-term"] + "</span>";
                subjects.push(v["subjects-top-term"]);

                //Short title if available
                if (v["short-title"]) {
                    html += "     <p class='bill-name'>" + v["short-title"] + "</p>";
                } else {
                    html += "     <p class='bill-name'>" + v.title + "</p>";
                }

                //Purpose if available
                if (v.purpose != "null") {
                    html += "<p class='bill-purpose'>" + v.purpose + "</p>";
                } else {
                    html += "<p class='bill-purpose'>No purpose specified</p>";
                }
                //Bill status
                html += "     <span class='bill-status'><strong>Status: </strong>" + v.status.join(" => ") + "</span>";

                // Lobbied list
                //console.log(v.lobbied);
                $.each(v.lobbied, function (key,val){
                    lobbiedArray.push(val);
                    groupsArray.push(val);
               });
                html += "     <span class='sponsor-lobbied'><strong>Lobbied by: </strong> " + v.lobbied.join(', ') + "</span>";


                //Bill sponsor
                if (v.sponsor.last_name) {

                    //Sponsor party
                    if (v.sponsor.party === "R"){
                        html += "     <div class='bill-sponsor republican'>";
                    } else if (v.sponsor.party === "D"){
                        html += "     <div class='bill-sponsor democrat'>";
                    }

                    html += "     <strong>Sponsor</strong>";

                    //If govtrack then we have a photo
                    if( v.sponsor.govtrack_id ){
                        //Sponsor mug
                        html += "     <div class='mugBox clearFix";
                        if (v.sponsor.party === "R"){
                            html += " mugBoxR ";
                        } else if (v.sponsor.party === "D"){
                            html += " mugBoxD ";
                        }
                         html += "'><img class='bill-mug' src='https://www.govtrack.us/data/photos/" + v.sponsor.govtrack_id + "-100px.jpeg'/></div>";
                    }


                    //Hold parties for counting
                    partyArray.push(v.sponsor.party);

                    html += "          <span class='sponsor-name'>" + v.sponsor.title + ". " + v.sponsor.first_name + " " + v.sponsor.last_name + " (" + v.sponsor.party + "-" + v.sponsor.state + ")</span>";
                    //Sponsor status
                    if (v.sponsor.in_office === true) {
                        html += "<span class='sponsor-status'>Status: In office</span>";
                    } else {
                        html += "<span class='sponsor-status'>Status: Out of office</span>";
                    }

                    html += "     </div>";

                    var countObj = {};
                    countObj.party = v.sponsor.party;
                    countObj.govtrack = v.sponsor.govtrack_id;
                    countObj.last_name = v.sponsor.last_name;
                    countObj.first_name = v.sponsor.first_name;
                    countObj.in_office = v.sponsor.in_office;
                    sponsorArray.push(countObj);


                } else {
                    html += "     <div class='bill-sponsor'>";
                    html += "     <strong>Sponsor</strong>";
                    html += "          <span class='sponsor-name'>No sponsor information available</span>";
                    html += "     </div>";
                }


                html += "</div>";

                $('#bill-list').append(html);
            }

        });
        $divs = $(".bill");

        var dateOrderedDivs = $divs.sort(function(a, b) {
            return $(a).attr("data-date") - $(b).attr("data-date");
        });
        $("#bill-list").html(dateOrderedDivs);


        //Build, display and activate subject tags
        var subjectCounts = _.countBy(subjects);
        //console.log(subjectCounts);

        var subjectList = [];
        $.each(subjectCounts, function(key, val) {
            subjectList.push(key);
        });
        subjectList.sort();
        $.each(subjectList, function(key, val) {
            $("#bill-tags").append("<span class='tag' data-tag='" + val + "'>" + val + "</span>");
        });


        //Build, display and activate subject tags
        var groupCounts = _.countBy(groupsArray);
        //console.log(groupCounts);

        var groupList = [];
        $.each(groupCounts, function(key, val) {
            groupList.push(key);
        });
        groupList.sort();
        $.each(groupList, function(key, val) {
            $("#bill-groups").append("<span class='tag' data-group='" + val + "'>" + val + "</span>");
        });

        //Build, display and activate subject tags
        //console.log(partyArray);
        var partyCounts = _.countBy(partyArray);
        //console.log(partyCounts);

        var partyList = [];
        $.each(partyCounts, function(key, val) {
            partyList.push(key);
        });
        partyList.sort();
        $.each(partyList, function(key, val) {
            $("#bill-parties").append("<span class='tag' data-party='" + val + "'>" + val + "</span>");
        });

        $(".tag").click(function() {

            console.log("Clicked a tag.")
            //IF ITS A TAG BUTTON
            if ( $(this).data("tag") ){
                var selected = $(this).data("tag");
                $(this).toggleClass("selected-tag");
                $(".bill").hide();
                $('#bill-list').find("[data-tag='" + selected + "']").toggleClass("selected-tag");
                $(".selected-tag").show();
            };
            //IF ITS A PARTY BUTTON
            if ( $(this).data("party") ){
                console.log($(this).data("party"));
                var selected = $(this).data("party");
                $(this).toggleClass("selected-tag");
                $(".bill").hide();
                $('#bill-list').find("[data-party='" + selected + "']").toggleClass("selected-tag");
                $(".selected-tag").show();
            };
            //IF ITS A GROUP BUTTON
            if ( $(this).data("group") ){
                console.log($(this).data("group"));
                var selected = $(this).data("group");
                $(this).toggleClass("selected-tag");
                $(".bill").hide();

                $('#bill-list').find("[data-groups*='" + selected + "']").toggleClass("selected-tag");

                $(".selected-tag").show();
            };



        });



        //Do counts
        //STATUS COUNTS
        statusCounts = _.countBy(statusArray);
        //console.log(statusCounts);

        //ORG COUNTS
        lobbiedCounts = _.countBy(lobbiedArray);
        //console.log(lobbiedCounts);

        //SPONSOR COUNTS
        sponsorCounts = _.countBy(sponsorArray, function(obj){
            return obj.last_name;
        });

        //console.log(sponsorCounts);

        // //Get top 3 sponsors
        // sponsorCountsArray = sortable.slice(0, 3);
        // console.log(sponsorCountsArray);

        statusCounts = sortCounts(statusCounts);
        partyCounts = sortCounts(partyCounts);
        lobbiedCounts = sortCounts(lobbiedCounts);
        sponsorCounts = sortCounts(sponsorCounts);

        //console.log(lobbiedCounts);
        //console.log(statusCounts);
        //console.log(partyCounts);
        //console.log(sponsorCounts);

        function getPercentage(total,val){
            pct = val/total*100;
            if (pct>95){
                return 95;
            } else {
                return Math.round(pct);
            }
        }


        $(".byOrg").empty().html("<h3>Organizations and the number of bills they lobbied</h3>");
        var lobbiedTotal;
        // $.each(lobbiedCounts, function(k, v) {
        //     console.log(parseInt(v[1]));
        // });
        var maxLobbiedCount = lobbiedCounts[0][1]
        $.each(lobbiedCounts, function(k, v) {
            var barClass;
             html = "<div class='list-element'>";
             if ($.inArray(v[0], gunControlGroups) >= 0){
                barClass = "gc";
             } else {
                barClass = "gr";
             }
             html += "     <span class='list-item'>"+v[0]+"</span>";
             html += "     <div class='bar-container'>";
             html += "          <div class='list-bar "+barClass+"' style='width:"+getPercentage(maxLobbiedCount,v[1])+"%'>&nbsp;</div><div class='bar-number'>"+v[1]+"</div>";
             html += "     </div>";
             html += "</div>";
            $(".byOrg").append(html);
        });


        // $(".bySponsor").empty().html("<h3>The top five sponsors of gun-related legislation</h3>");
        // for ( i=1; i<=5; i++){
        //     if ( sponsorCounts[i][0] ){
        //         //console.log(i);
        //         html = "<li>"+sponsorCounts[i][0]+": " + sponsorCounts[i][1] + " pieces of legislation.</li>";
        //         $(".bySponsor").append(html);
        //     } else {
        //         //console.log(i);
        //     }
        // }

        $(".byStatus").empty().html("<h3>Status breakdown of introduced gun-related legislation</h3>");
        var statusTotal;
        var maxStatusCount = statusCounts[0][1];
        $.each(statusCounts, function(k, v) {
            html = "<div class='list-element'>";
            html += "     <span class='list-item'>"+v[0]+"</span>";
            html += "     <div class='bar-container'>";
            html += "          <div class='list-bar' style='width:"+getPercentage(maxStatusCount,v[1])+"%;background:#BF531B'>&nbsp;</div><div class='bar-number'>"+v[1]+"</div>";
            html += "     </div>";
            html += "</div>";
            $(".byStatus").append(html);
        });

        $(".byParty").empty().html("<h3> Gun-related legislation introduced by party</h3>");
        var partyTotal;
        var maxPartyCount = partyCounts[0][1]

        $.each(partyCounts, function(k, v) {
            //console.log(v);
            html = "<div class='list-element'>";
            //console.log(v[0]);
            switch (v[0]){
                case "R":
                    html += "     <span class='list-item'>Republican</span>";
                    break;
                case "D":
                    html += "     <span class='list-item'>Democrat</span>";
                    break;
                case "I":
                    html += "     <span class='list-item'>Independent</span>";
                    break;
                default:
                    html += "     <span class='list-item'>Other</span>";
                    break;
            }

            html += "<div class='bar-container'>";

            switch (v[0]){
                case "R":
                    html += "<div class='list-bar republican' style='width:"+getPercentage(maxPartyCount,v[1])+"%'>&nbsp;</div><div class='bar-number'>"+v[1]+"</div>";
                    break;
                case "D":
                    html += "<div class='list-bar democrat' style='width:"+getPercentage(maxPartyCount,v[1])+"%'>&nbsp;</div><div class='bar-number'>"+v[1]+"</div>";
                    break;
                default:
                    html += "<div class='list-bar "+v[0]+"' style='width:"+getPercentage(maxPartyCount,v[1])+"%'>&nbsp;</div><div class='bar-number'>"+v[1]+"</div>";
                    break;
            }


            html += "     </div>";
            html += "</div>";
            $(".byParty").append(html);
        });


    });
}
