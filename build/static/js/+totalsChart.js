function buildTotalsChart(gunControlTotals, gunRightsTotal) {

  console.log("--------------   In buildTotalsChart()  --------------");
  //console.log("gunControlTotals: " + gunControlTotals);
  //console.log("gunRightsTotal: " + gunRightsTotal);

  /*
  <div class="bar" id="grTotals"></div>
  <div class="bar" id="gcTotals"></div>
  */

  var total = gunControlTotals + gunRightsTotal;
  var grTotalPct = Math.round(gunRightsTotal / total * 100);
  //console.log(grTotalPct + "%");
  $("#grBar").css("width", grTotalPct + "%");
  $("#gcBar").css("width", 100-grTotalPct + "%");

}
