function swapContent(side){

    console.log("--------------   In swapContent() with "+side+" --------------");

    if (side === "gc"){
        console.log("side = "+side);
        $(".gr-back").removeClass("gr-back").addClass("gc-back");
        $(".gr-dark").removeClass("gr-dark").addClass("gc-dark");
        $("#hero-border.gr").removeClass("gr").addClass("gc");
        $("#gr-intro").fadeOut("fast", function() {
            $("#gc-intro").fadeIn();
        });
        // $("#gr-intro").slideUp("slow", function() {
        //     $("#gc-intro").slideDown("slow");
        // });
        //Swap text
        $("#total-chart .intro").text(total_gc_content);
        $("#year-chart .intro").text(annual_gc_content);
        $("#tree-chart .intro").text(tree_gc_content);
        $("#bill-breakdown .intro").text(legislation_gc_content);
        $("#hero-gr").fadeOut();
        $("#hero-gc").fadeIn();

        storyURL = gcUrl;
        leadText = gcTwitter;
        storyTitle = shareTitle = gcTwitter;
        storyIMG = "http://interactives.dallasnews.com/test/gun-fight/images/_gcShare.jpg";

    } else {
        console.log("side = "+side);
        $(".gc-back").removeClass("gc-back").addClass("gr-back");
        $(".gc-dark").removeClass("gc-dark").addClass("gr-dark");
        $("#hero-border.gc").removeClass("gc").addClass("gr");
        $("#gc-intro").fadeOut("fast", function() {
            $("#gr-intro").fadeIn();
        });
        //Swap text
        $("#total-chart .intro").text(total_gr_content);
        $("#year-chart .intro").text(annual_gr_content);
        $("#tree-chart .intro").text(tree_gr_content);
        $("#bill-breakdown .intro").text(legislation_gr_content);
        $("#hero-gc").fadeOut();
        $("#hero-gr").fadeIn();

        storyURL = grUrl;
        leadText = grTwitter;
        storyTitle = shareTitle = grTwitter;
        storyIMG = "http://interactives.dallasnews.com/test/gun-fight/images/_grShare.jpg";

    }

    $("#totalChart .intro").text(["total_"+side+"_content"]);

    //SET TWITTER TEXT
    $(".twitterShare a").attr("href",'https://twitter.com/intent/tweet?text='+leadText+' %7C @DMNOpinion&url='+storyURL);

    //SET FACEBOOK shareTitle
    $(".facebookShare a").attr("href",'https://www.facebook.com/sharer/sharer.php?u='+encodeURI(storyURL));

    //SET EMAIL PREFERENCES
    $(".emailShare a").attr("href",'mailto:?subject='+encodeURI(storyTitle)+'&body='+encodeURI(storyURL));

};


//Switch theme/content button
$("#button-gc").click(function() {
    swapContent("gc");
});
$("#button-gr").click(function() {
    swapContent("gr");
});
