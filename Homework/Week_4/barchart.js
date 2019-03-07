// Name: Michael Stroet
// Student number: 11293284

// Load the json file and draw a barchart
d3.json("games.json").then(function(dataset) {
  barChart(dataset)
});

function barChart(dataset) {
  /*
  Draws an interactive barchart of the given data
  */

  // Dimensions of the figure
  var svgWidth = 900;
  var svgHeight = 600;

  // Dimensions for the barchart with padding on all sides
  var padding = 60;
  var chartWidth = svgWidth - 2 * padding;
  var chartHeight = svgHeight - 2 * padding;

  // Define a "svg" for drawing the figure
  const svg = d3.select("body").append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // Define a "g" for drawing the barchart
  const barChart = svg.append("g")
    .attr("class", "barchart")
    .attr("transform", `translate(${padding}, ${padding})`);

  // Define the div for the tooltip
  const div = d3.select("body").append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  // Scaling function for x values
  const xScale = d3.scaleBand()
    .range([0, chartWidth])
    .domain(dataset.map((data) => data.platform))
    .padding(0.2);

  // Scaling function for y values
  const yScale = d3.scaleLinear()
    .range([chartHeight, 0])
    .domain([0, d3.max(dataset.map((data) => data.games))]);

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
    .text("Besturingssysteem");

  // Draw y-axis
  barChart.append("g").call(d3.axisLeft(yScale))
    .attr("class", "axis");

  // Draw y label
  svg.append("text")
    .attr("class", "label")
    .attr("x", - (chartHeight / 2) - padding)
    .attr("y", padding / 3.5)
    .attr("transform", "rotate(270)")
    .attr("text-anchor", "middle")
    .text("Aantal games");

  // Draw title
  svg.append("text")
    .attr("class", "title")
    .attr("x", chartWidth / 2 + padding)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .text("Totaal aantal ondersteunde games per OS op Steam in 2017");

  // Draw horizontal gridlines
  barChart.append("g")
    .attr("class", "grid")
    .attr("opacity", 0.3)
    .call(d3.axisLeft(yScale)
      .tickSize(-chartWidth, 0, 0)
      .tickFormat("")
    );

  // Define "g" for each bars
  var bars = barChart.selectAll(".bar")
  .data(dataset)
  .enter()
  .append("g");

  // Draw bars with tooltips of their value when mousing over them
  bars.append("rect")
  .attr("class", "bar")
  .attr("x", (data => xScale(data.platform)))
  .attr("y", (data => yScale(data.games)))
  .attr("height", (data => chartHeight - yScale(data.games)))
  .attr("width", xScale.bandwidth())
  .on("mousemove", d => {
      div
        .transition()
        .duration(50)
        .style('opacity', 0.9);
      div
        .html(d.platform + '<br/>' + d.games + " games")
        .style("left", (d3.event.pageX + 5) + "px")
        .style("top", (d3.event.pageY - 40) + "px");
    })
  .on("mouseout", () => {
      div
        .transition()
        .duration(500)
        .style('opacity', 0);
    });

};
