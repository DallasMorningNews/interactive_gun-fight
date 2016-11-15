var sideSelected = "gc";

//Intro chatter for first chart - "Outspent" totals
var total_gr_content = "Since 2000, the gun rights lobby has outspent the gun control lobby by a margin of 10 to 1.";
var total_gc_content = "Since 2000, the gun control lobby has been outspent the gun rights lobby by a margin of 10 to 1.";

//Intro chatter for second chart - "Consistently Outspent" annual totals
var annual_gr_content = "Money spent by both groups to lobby Congress fell steadily towards the end of Bush’s presidency and slowly increased during President Obama’s first term. After the Sandy Hook shootings, the number of introduced gun legislation spiked dramatically. Lobbying efforts quickly followed suit. ";
var annual_gc_content = "Money spent by both groups to lobby Congress fell steadily towards the end of Bush’s presidency and slowly increased during President Obama’s first term. When Adam Lanza walked into Sandy Hook Elementary School and killed 28 children at the end of 2012, lobbying efforts on both sides spiked dramatically.";

//Intro chatter for third chart - "Tree chart" annual totals
var tree_gr_content = "Gun rights groups, led primarily by the National Rifle Association among others, consistently outspend the gun control lobbyists by a large margin. A look at some of the major organizations and how much they spent on lobbying.";
var tree_gc_content = "Gun control groups, led recently by Everytown for Gun Safety, are consistently outspent by a large margin. A look at some of the major organizations and how much they spent on lobbying.";

//Intro chatter for legislation
var legislation_gr_content = "More money supposedly means more influence. Gun rights groups have lobbied more legislation over the past 10 years and have been successful blocking the gun control agenda. However, very few bills advancing gun rights have been advanced – perhaps demonstrating gridlock in Washington.";
var legislation_gc_content = "More money supposedly means more influence. However, while gun control legislation has been consistently blocked, an active Democrat party has been able to shut down the gun rights agenda as well.";

swapContent(sideSelected);

function swapContent(side){

    console.log("--------------   In swapContent()  --------------");
    //console.log(total_gc_content);

    if (side === "gc"){
        $(".gr-back").removeClass("gr-back").addClass("gc-back");
        $(".gr-dark").removeClass("gr-dark").addClass("gc-dark");
        $("#hero-border.gr").removeClass("gr").addClass("gc");
        $("#gr-intro").slideUp("slow", function() {
            $("#gc-intro").slideDown("slow");
        });
        //Swap text
        $("#total-chart .intro").text(total_gc_content);
        $("#year-chart .intro").text(annual_gc_content);
        $("#tree-chart .intro").text(tree_gc_content);
        $("#bill-breakdown .intro").text(legislation_gc_content);
        $("#hero-gr").fadeOut();
        $("#hero-gc").fadeIn();
    } else {
        $(".gc-back").removeClass("gc-back").addClass("gr-back");
        $(".gc-dark").removeClass("gc-dark").addClass("gr-dark");
        $("#hero-border.gc").removeClass("gc").addClass("gr");
        $("#gc-intro").slideUp("slow", function() {
            $("#gr-intro").slideDown("slow");
        });
        //Swap text
        $("#total-chart .intro").text(total_gr_content);
        $("#year-chart .intro").text(annual_gr_content);
        $("#tree-chart .intro").text(tree_gr_content);
        $("#bill-breakdown .intro").text(legislation_gr_content);
        $("#hero-gc").fadeOut();
        $("#hero-gr").fadeIn();
    }
    $("#totalChart .intro").text(["total_"+side+"_content"]);
};


//Switch theme/content button
$("#button-gc").click(function() {
    swapContent("gc");
});
$("#button-gr").click(function() {
    swapContent("gr");
});
