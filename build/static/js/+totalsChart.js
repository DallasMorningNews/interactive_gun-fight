function buildTotalsChart(gunControlTotal, gunRightsTotal) {

  console.log("--------------   In buildTotalsChart()  --------------");
  //console.log("gunControlTotal: " + gunControlTotal);
  //console.log("gunRightsTotal: " + gunRightsTotal);

  var total = gunControlTotal + gunRightsTotal;
  //console.log("TOTAL: "+total);
  var grTotalPct = Math.round(gunRightsTotal / total * 100);
  //console.log(grTotalPct + "%");
  //console.log(100-grTotalPct + "%");
  $("#totals-gr-amount").html( "$"+d3.format(".2s")(gunRightsTotal));
  $("#totals-gc-amount").html( "$"+d3.format(".2s")(gunControlTotal));
  $("#grBar").css("width", grTotalPct + "%");
  $("#gcBar").css("width", 100-grTotalPct + "%");

}
