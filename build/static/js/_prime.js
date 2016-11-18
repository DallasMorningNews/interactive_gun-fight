//Intro chatter for first chart - "Outspent" totals
var total_gr_content = "Since 2000, the gun rights lobby has spent nearly 10 times more than the gun control lobby.";
var total_gc_content = "Since 2000, the gun control lobby has been outspent by the gun rights lobby by a margin of 10 to 1.";

//Intro chatter for second chart - "Consistently Outspent" annual totals
var annual_gr_content = "Money spent by both groups to lobby Congress fell steadily towards the end of Bush’s presidency and slowly increased during President Obama’s first term. After the Sandy Hook shootings, the number of introduced gun legislation spiked dramatically. Spending on lobbying efforts quickly followed suit. ";
var annual_gc_content = "Money spent by both groups to lobby Congress fell steadily towards the end of Bush’s presidency and slowly increased during President Obama’s first term. When Adam Lanza walked into Sandy Hook Elementary School and killed 28 children at the end of 2012, lobbying efforts on both sides spiked dramatically.";

//Intro chatter for third chart - "Tree chart" annual totals
var tree_gr_content = "Gun rights groups, led primarily by the National Rifle Association and a few others, consistently outspend the gun control lobbyists by a large margin. A look at some of the major organizations and how much they spent on lobbying.";
var tree_gc_content = "Gun control groups, led recently by Everytown for Gun Safety, are consistently outspent by a large margin. A look at some of the major organizations and how much they spent on lobbying.";

//Intro chatter for legislation
var legislation_gr_content = "More money supposedly means more influence. Gun rights groups have lobbied more legislation over the past 10 years and have been successful blocking the gun control agenda. However, very few bills advancing gun rights ever move forward. It's hard for either side to make progress.";
var legislation_gc_content = "More money supposedly means more influence. However, while gun control legislation has been consistently blocked, an active Democrat party has been able to shut down the gun rights agenda as well.";

var currentYear = "2016";
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var gunControlGroups = [];
var gunRightsGroups = [];

gcUrl = "http%3A%2F%2Finteractives.dallasnews.com%2F2016%2Fgun-fight%2Findex.html%3fside%3dgc";
fbgcUrl = "http://interactives.dallasnews.com/2016/gun-fight/index.html?side=gc";
grUrl = "http%3A%2F%2Finteractives.dallasnews.com%2F2016%2Fgun-fight%2Findex.html%3fside%3dgr";
fbgrUrl = "http://interactives.dallasnews.com/2016/gun-fight/index.html?side=gr";

gcTwitter = "Gun fight: Losing the lobbying battle over guns";
grTwitter = "Gun fight: Lobbyists defending the Second Amendment";

var storyTitle = "",
    storyURL = "",
    leadText = "",
    storyIMG = "";
