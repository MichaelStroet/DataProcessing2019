d3.select("head")
  .append("title")
  .text("Barchart");

d3.json("data.json").then(function(data) {
  barChart(data)
});

function barChart(dataset) {

  var xPadding = 50;
  var yPadding = 30;

  var svgWidth = 450;
  var svgHeight = 300;

  var dataset = [13000, 5000, 4500];

  /*var xScale = d3.scaleLinear()
    .domain([0, dataset.length])
    .range([xPadding, svgWidth]);
    */
  var xScale = d3.scaleBand()
    .domain([0, dataset.length])
    .range([xPadding, svgWidth])
    .paddingInner([0.1])
    .paddingOuter([0.3])
    .align([0.5]);

  var yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset) * 1.1])
    .range([svgHeight - yPadding, 0]);

  var svg = d3.select("body")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  var xTicks = [];
  var barWidth = svgWidth / (2 * dataset.length);

  console.log(xScale.bandwidth());

  var bars = svg.selectAll(".bar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("opacity", 0.5)
    .attr("x", function(d, i) {
      return xScale(i);
    })
    .attr("y", function(d) {
      return yScale(d);
    })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) {
      return yScale(0) - yScale(d);
    });

    // Draw x-axis
    svg.append("g")
      .call(d3.axisBottom(xScale))
      .attr("transform", "translate(0, " + (svgHeight - yPadding) + ")");

    // Draw y-axis
    svg.append("g")
      .call(d3.axisLeft(yScale))
      .attr("transform", "translate(" + xPadding +", 0)");

    // Draw border
    svg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("height", svgHeight)
    .attr("width", svgWidth)
    .style("stroke", "black")
    .style("fill", "none")
    .style("stroke-width", 1);
};
