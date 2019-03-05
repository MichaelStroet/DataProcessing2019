// Name: Michael Stroet
// Student number: 11293284

d3.json("data.json").then(function(data) {
  barChart(data)
});

function barChart(data) {

  var svgWidth = 700;
  var svgHeight = 500;
  var padding = 60;

  var chartWidth = svgWidth - 2 * padding
  var chartHeight = svgHeight - 2 * padding

  const dataset = [
    {
      platform: "Windows",
      games: 13000,
    },
    {
      platform: "Mac",
      games: 5000,
    },
    {
      platform: "Linux",
      games: 4500,
    },
  ];

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
    .domain(dataset.map((s) => s.platform))
    .padding(0.2)

  // Scaling function for y values
  const yScale = d3.scaleLinear()
    .range([chartHeight, 0])
    .domain([0, 13360]);

  // Draw x-axis
  barChart.append("g").call(d3.axisBottom(xScale))
    .attr("class", "axis")
    .attr('transform', `translate(0, ${chartHeight})`);

  // Draw x label
  svg.append('text')
    .attr('class', 'label')
    .attr('x', chartWidth / 2 + padding)
    .attr('y', chartHeight + padding * 1.7)
    .attr('text-anchor', 'middle')
    .text('Platforms')

  // Draw y-axis
  barChart.append("g").call(d3.axisLeft(yScale))
    .attr("class", "axis");

  // Draw y label
  svg
    .append('text')
    .attr('class', 'label')
    .attr('x', -(chartHeight / 2) - padding)
    .attr('y', padding / 3.5)
    .attr('transform', 'rotate(270)')
    .attr('text-anchor', 'middle')
    .text('Number of games')

  // Draw title
  svg.append('text')
    .attr('class', 'title')
    .attr('x', chartWidth / 2 + padding)
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .text('Total supported games on Steam per platform in 2016')

  // Draw horizontal gridlines
  barChart.append('g')
    .attr('class', 'grid')
    .attr("opacity", 0.3)
    .call(d3.axisLeft(yScale)
      .tickSize(-chartWidth, 0, 0)
      .tickFormat('')
    );

  // Draw bars
  var bars = barChart.selectAll(".bar")
  .data(dataset)
  .enter()
  .append('g')

  bars
  .append('rect')
  .attr('class', 'bar')
  .attr('x', (g) => xScale(g.platform))
  .attr('y', (g) => yScale(g.games))
  .attr('height', (g) => chartHeight - yScale(g.games))
  .attr('width', xScale.bandwidth())
  // Draw value of bar when mousing over it
  .on('mouseenter', function (actual, i) {
  bars
    .append('text')
    .attr('class', 'values')
    .attr('x', xScale(actual.platform) + xScale.bandwidth() / 2)
    .attr('y', yScale(actual.games) + 30)
    .attr('text-anchor', 'middle')
    .text(actual.games)
  })

  // Remove value of bar when gone
  .on('mouseleave', function () {
  barChart.selectAll('.values').remove()
  })

};
