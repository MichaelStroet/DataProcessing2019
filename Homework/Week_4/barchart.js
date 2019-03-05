// Name: Michael Stroet
// Student number: 11293284

d3.json("games.json").then(function(dataset) {
  barChart(dataset)
});

function barChart(dataset) {
  /*
  Draws an interactive barchart of the given data
  */

  // Dimensions of the figure
  var svgWidth = 700;
  var svgHeight = 500;

  // Dimensions for the barchart with padding on all sides
  var padding = 60;
  var chartWidth = svgWidth - 2 * padding
  var chartHeight = svgHeight - 2 * padding

  // Define a "svg" for drawing the figure
  const svg = d3.select("body")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // Define a "g" for drawing the barchart
  const barChart = svg.append("g")
    .attr("class", "barchart")
    .attr("transform", `translate(${padding}, ${padding})`);

  // Scaling function for x values
  const xScale = d3.scaleBand()
    .range([0, chartWidth])
    .domain(dataset.map((data) => data.platform))
    .padding(0.2)

  // Scaling function for y values
  const yScale = d3.scaleLinear()
    .range([chartHeight, 0])
    .domain([0, 13360]);
  /*
  var tip = d3.tip()
    .attr("class", "d3-tip")
    .html(function(d) {
      return "<strong>Frequency:</strong> <span style="color:red">" + d.games + "</span>";
    });
    */

  // Draw x-axis
  barChart.append("g").call(d3.axisBottom(xScale))
    .attr("class", "axis")
    .attr("transform", `translate(0, ${chartHeight})`);

  // Draw x label
  svg.append("text")
    .attr("class", "label")
    .attr("x", chartWidth / 2 + padding)
    .attr("y", chartHeight + padding * 1.7)
    .attr("text-anchor", "middle")
    .text("Platforms")

  // Draw y-axis
  barChart.append("g").call(d3.axisLeft(yScale))
    .attr("class", "axis");

  // Draw y label
  svg.append("text")
    .attr("class", "label")
    .attr("x", -(chartHeight / 2) - padding)
    .attr("y", padding / 3.5)
    .attr("transform", "rotate(270)")
    .attr("text-anchor", "middle")
    .text("Number of games")

  // Draw title
  svg.append("text")
    .attr("class", "title")
    .attr("x", chartWidth / 2 + padding)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .text("Total supported games on Steam per platform in 2016")

  // Draw horizontal gridlines
  barChart.append("g")
    .attr("class", "grid")
    .attr("opacity", 0.3)
    .call(d3.axisLeft(yScale)
      .tickSize(-chartWidth, 0, 0)
      .tickFormat("")
    );

  //svg.call(tip);

  // Define "g" for each bars
  var bars = barChart.selectAll(".bar")
  .data(dataset)
  .enter()
  .append("g")

  // Draw bars
  bars.append("rect")
  .attr("class", "bar")
  .attr("x", (data => xScale(data.platform)))
  .attr("y", (data => yScale(data.games)))
  .attr("height", (data => chartHeight - yScale(data.games)))
  .attr("width", xScale.bandwidth())
  /*
  .on("mouseover", tip.show)
  .on("mouseout", tip.hide)
*/


  // Draw value of bar when mousing over it
  .on("mouseover", function (d) {
  bars
    .append("text")
    .attr("class", "value")
    .attr("x", xScale(d.platform) + xScale.bandwidth() / 2)
    .attr("y", yScale(d.games) + 30)
    .attr("text-anchor", "middle")
    .text(d.games)
  })

  // Remove value of bar when the mouse is gone
  .on("mouseout", function () {
  barChart.selectAll(".value").remove()
  })

};
