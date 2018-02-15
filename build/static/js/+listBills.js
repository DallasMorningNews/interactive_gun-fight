var facebookSVG = '<svg class="social" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="35px" height="35px" viewBox="0 0 100 100"><rect id="square" fill="#D8D8D8" width="100" height="100"/><path id="facebook" fill="#FFFFFF" d="M35.959,40.223h6.034v-5.865c0-2.588,0.065-6.576,1.944-9.046	c1.979-2.618,4.696-4.397,9.369-4.397c7.611,0,10.818,1.086,10.818,1.086l-1.508,8.942c0,0-2.518-0.728-4.862-0.728	c-2.351,0-4.448,0.842-4.448,3.188v6.821h9.623l-0.673,8.734h-8.95v30.342H41.994V48.957h-6.034V40.223z"/></svg>';

var twitterSVG = '<svg class="social" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="35px" height="35px" viewBox="0 0 100 100"><rect id="square" fill="#D8D8D8" width="100" height="100"/><path id="twitter" fill="#FFFFFF" d="M77.877,32.706c-2.051,0.911-4.258,1.525-6.569,1.803c2.362-1.416,4.176-3.659,5.028-6.328	c-2.212,1.311-4.657,2.26-7.266,2.771c-2.082-2.221-5.058-3.611-8.349-3.611c-6.313,0-11.435,5.126-11.435,11.441	c0,0.897,0.097,1.767,0.294,2.604c-9.506-0.479-17.932-5.027-23.577-11.955c-0.984,1.696-1.549,3.662-1.549,5.759	c0,3.962,2.02,7.468,5.089,9.52c-1.874-0.058-3.64-0.576-5.183-1.429v0.141c0,5.544,3.942,10.168,9.178,11.218	c-0.96,0.269-1.97,0.402-3.015,0.402c-0.737,0-1.456-0.067-2.151-0.202c1.454,4.542,5.677,7.852,10.684,7.941	c-3.916,3.068-8.848,4.896-14.205,4.896c-0.924,0-1.836-0.052-2.729-0.156c5.062,3.243,11.075,5.138,17.534,5.138	c21.042,0,32.543-17.429,32.543-32.551c0-0.496-0.01-0.991-0.03-1.479C74.405,37.014,76.348,35.001,77.877,32.706"/></svg>';

var youtubeSVG = '<svg class="social" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="35px" height="35px" viewBox="0 0 100 100"><rect id="square" fill="#D8D8D8" width="100" height="100"/><path id="youtube" fill="#FFFFFF" d="M60.825,50.137L41.487,61.494V38.776L60.825,50.137z M78.886,60.667V39.546	c0,0,0-10.181-10.179-10.181h-38.71c0,0-10.173,0-10.173,10.181v21.121c0,0,0,10.181,10.173,10.181h38.71	C68.707,70.848,78.886,70.848,78.886,60.667"/></svg>';

var websiteSVG = '<svg class="social" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="35px" height="35px" viewBox="0 0 100 100"><rect id="square" fill="#D8D8D8" width="100" height="100"/><rect id="webbox" x="20" y="29" fill="#FFFFFF" width="59" height="42"/><text transform="matrix(1 0 0 1 24.3213 54.5156)" fill="#D8D8D8" font-family="OpenSans-Bold" font-size="20">www</text></svg>';


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

    console.log("--------------   In switchGunBills()  --------------");

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

        $("#bill-groups").empty().html("<strong>View by groups:</strong><br/>");
        // $("#bill-parties").empty().html("<strong>View by party:</strong><br/>");
        $("#bill-tags").empty().html("<strong>View by tags:</strong><br/>");

        $.each(data, function(k, v) {

            var dateArray = v.introduced.split("-");

            if (v["subjects-top-term"] != "Native Americans" && v["subjects-top-term"] != "Animals" && v["subjects-top-term"] != "Agriculture and food" && v["subjects-top-term"] != "Economics and public finance" && v["subjects-top-term"] != "Education" && v["subjects-top-term"] != "Energy" && v["subjects-top-term"] != "Labor and employment" && v["subjects-top-term"] != "Private legislation" && v["subjects-top-term"] != "Water resources development" && parseInt(dateArray[0]) === parseInt(year)) {

                //Increment totals
                numberOfBills++;
                statusArray.push(v.status);
                //sponsorArray.push(v.sponsor.first_name+" "+v.sponsor.last_name);

                var billDate = Date.parse(v.introduced);

                var html = "";
                html += "<div data-date='" + billDate + "'data-tag='" + v["subjects-top-term"] + "' data-groups='"+ v.lobbied+"' class='bill'>";

                //Bill number
                billNumberArray = v.number.split("-");
                html += "     <span class='bill-header bill-number'>" + billNumberArray[0].toUpperCase() + "</span>";

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
                //Bill introduction date
                //Date introduced
                // var dateArray = v.introduced.split("-");
                html += "     <span class='bill-date'><strong>Introduced: </strong>"+monthNames[(parseInt(dateArray[1]) - 1)] + " " + dateArray[2] + ", " + dateArray[0] +"</span>"
                //Date introduced
                var dateArray = v["status-at"].split("-");
                // console.log(dateArray);
                html += "     <span class='bill-date'><strong>Most recent update: </strong>"+monthNames[(parseInt(dateArray[1]) - 1)] + " " + dateArray[2] + ", " + dateArray[0] +"</span>"
                //Bill status
                if (v.status.length > 0) {
                  html += "     <span class='bill-status'><strong>Status: </strong>" + v.status.join(" => ") + "</span>";
                } else {
                  html += "     <span class='bill-status'><strong>Status: </strong>Not listed</span>";
                }

                // Lobbied list
                //console.log(v.lobbied);
                $.each(v.lobbied, function (key,val){
                    lobbiedArray.push(val);
                    groupsArray.push(val);
               });
                html += "     <span class='sponsor-lobbied'><strong>Lobbied by: </strong> " + v.lobbied.join(', ') + "</span>";

                html += "<a class='bill-link' href='https://www.govtrack.us/congress/bills/"+billNumberArray[1]+"/"+billNumberArray[0]+"/text' target='_blank'>Read the bill</a>";

                //Bill sponsor
                if (v.sponsor.name) {
                  var nameArray = v.sponsor.name.split(",");
                    //Sponsor party
                    // if (v.sponsor.party === "R"){
                    //     html += "     <div class='bill-sponsor republican'>";
                    // } else if (v.sponsor.party === "D"){
                    //     html += "     <div class='bill-sponsor democrat'>";
                    // }

                    html += "     <div class='bill-sponsor'>";
                    html += "     <strong>Sponsor</strong>";
                    html += "          <span class='sponsor-name'>"+nameArray[1]+" "+ nameArray[0]+" ["+v.sponsor.state+"]</span>";
                    html += "     </div>";
                  }

                //
                //     //If govtrack then we have a photo
                //     if( v.sponsor.govtrack_id ){
                //         //Sponsor mug
                //         html += "     <div class='mugBox clearFix";
                //         if (v.sponsor.party === "R"){
                //             html += " mugBoxR ";
                //         } else if (v.sponsor.party === "D"){
                //             html += " mugBoxD ";
                //         }
                //          html += "'><img class='bill-mug' src='https://www.govtrack.us/data/photos/" + v.sponsor.govtrack_id + "-100px.jpeg'/></div>";
                //     }
                //
                //
                //     //Hold parties for counting
                //     partyArray.push(v.sponsor.party);
                //
                //     html += "          <span class='sponsor-name'>" + v.sponsor.title + ". " + v.sponsor.first_name + " " + v.sponsor.last_name + " (" + v.sponsor.party + "-" + v.sponsor.state + ")</span>";
                //     //Sponsor status
                //     if (v.sponsor.in_office === true) {
                //         html += "<span class='sponsor-status'>Status: In office</span>";
                //     } else {
                //         html += "<span class='sponsor-status'>Status: Out of office</span>";
                //     }
                //
                //     //console.log(v);
                //     if (v.sponsor["facebook_id"]){
                //         html += "<a class='social-buttons' href='https://www.facebook.com/"+v.sponsor['facebook_id']+"' target='_blank'>"+facebookSVG+"</a>";
                //     }
                //     if (v.sponsor["twitter_id"]){
                //         html += "<a class='social-buttons' href='https://www.twitter.com/"+v.sponsor['twitter_id']+"' target='_blank'>"+twitterSVG+"</a>";
                //     }
                //     if (v.sponsor["youtube_id"]){
                //         html += "<a class='social-buttons' href='https://www.youtube.com/"+v.sponsor['youtube_id']+"' target='_blank'>"+youtubeSVG+"</a>";
                //     }
                //     if (v.sponsor["website"]){
                //         html += "<a class='social-buttons' href='"+v.sponsor['website']+"' target='_blank'>"+websiteSVG+"</a>";
                //     }
                //
                //     html += "     </div>";
                //
                //     var countObj = {};
                //     countObj.party = v.sponsor.party;
                //     countObj.govtrack = v.sponsor.govtrack_id;
                //     countObj.last_name = v.sponsor.last_name;
                //     countObj.first_name = v.sponsor.first_name;
                //     countObj.in_office = v.sponsor.in_office;
                //     sponsorArray.push(countObj);
                //
                //
                // } else {
                //     html += "     <div class='bill-sponsor'>";
                //     html += "     <strong>Sponsor</strong>";
                //     html += "          <span class='sponsor-name'>No sponsor information available</span>";
                //     html += "     </div>";
                // }


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
        //var partyCounts = _.countBy(partyArray);
        //console.log(partyCounts);

        // var partyList = [];
        // $.each(partyCounts, function(key, val) {
        //     partyList.push(key);
        // });
        // partyList.sort();
        // $.each(partyList, function(key, val) {
        //     $("#bill-parties").append("<span class='tag' data-party='" + val + "'>" + val + "</span>");
        // });

        $(".tag").click(function() {

            //console.log("Clicked a tag.")
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
                //console.log($(this).data("party"));
                var selected = $(this).data("party");
                $(this).toggleClass("selected-tag");
                $(".bill").hide();
                $('#bill-list').find("[data-party='" + selected + "']").toggleClass("selected-tag");
                $(".selected-tag").show();
            };
            //IF ITS A GROUP BUTTON
            if ( $(this).data("group") ){
                //console.log($(this).data("group"));
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
        // partyCounts = sortCounts(partyCounts);
        lobbiedCounts = sortCounts(lobbiedCounts);
        sponsorCounts = sortCounts(sponsorCounts);

        //console.log(lobbiedCounts);
        //console.log(statusCounts);
        // console.log('partyCounts', partyCounts);
        //console.log(sponsorCounts);

        function getPercentage(total,val){
            pct = val/total*100;
            if (pct>90){
                return 90;
            } else if (pct<1){
                return 1;
            } else {
                return Math.round(pct);
            }
        }


        $(".byOrg").empty().html("<h3>Organizations and the number of bills they lobbied in "+year+"</h3>");
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

        $(".byStatus").empty().html("<h3>Status breakdown of gun-related legislation introduced in "+year+"</h3>");
        var statusTotal;
        var maxStatusCount = statusCounts[0][1];
        $.each(statusCounts, function(k, v) {
            html = "<div class='list-element'>";
            var splitArray = v[0].split(",");
            html += "     <span class='list-item'>"+splitArray.join(" => ")+"</span>";
            html += "     <div class='bar-container'>";
            html += "          <div class='list-bar' style='width:"+getPercentage(maxStatusCount,v[1])+"%;background:#BF531B'>&nbsp;</div><div class='bar-number'>"+v[1]+"</div>";
            html += "     </div>";
            html += "</div>";
            $(".byStatus").append(html);
        });

        // $(".byParty").empty().html("<h3> Gun-related legislation introduced by party in "+year+"</h3>");
        // var partyTotal;
        // var maxPartyCount = partyCounts[0][1];
        //
        // $.each(partyCounts, function(k, v) {
        //     //console.log(v);
        //     html = "<div class='list-element'>";
        //     //console.log(v[0]);
        //     switch (v[0]){
        //         case "R":
        //             html += "     <span class='list-item'>Republican</span>";
        //             break;
        //         case "D":
        //             html += "     <span class='list-item'>Democrat</span>";
        //             break;
        //         case "I":
        //             html += "     <span class='list-item'>Independent</span>";
        //             break;
        //         default:
        //             html += "     <span class='list-item'>Other</span>";
        //             break;
        //     }
        //
        //     html += "<div class='bar-container'>";
        //
        //     switch (v[0]){
        //         case "R":
        //             html += "<div class='list-bar republican' style='width:"+getPercentage(maxPartyCount,v[1])+"%'>&nbsp;</div><div class='bar-number'>"+v[1]+"</div>";
        //             break;
        //         case "D":
        //             html += "<div class='list-bar democrat' style='width:"+getPercentage(maxPartyCount,v[1])+"%'>&nbsp;</div><div class='bar-number'>"+v[1]+"</div>";
        //             break;
        //         default:
        //             html += "<div class='list-bar "+v[0]+"' style='width:"+getPercentage(maxPartyCount,v[1])+"%'>&nbsp;</div><div class='bar-number'>"+v[1]+"</div>";
        //             break;
        //     }
        //
        //
        //     html += "     </div>";
        //     html += "</div>";
        //     $(".byParty").append(html);
        // });


    });
}
