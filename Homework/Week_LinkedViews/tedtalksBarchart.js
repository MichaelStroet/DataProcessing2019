// Name: Michael Stroet
// Student number: 11293284

function barChart(datasets, svgWidth, svgHeight, firstYear, lastYear) {
    /*
    Draws an interactive barchart of the given data
    */

    // Dimensions for the scatterplot with padding on all sides
    var padding = {
        top: 120,
        right: 0,
        bottom: 30,
        left: 130
    };

    var chartWidth = svgWidth - padding.left - padding.right;
    var chartHeight = svgHeight - padding.top - padding.bottom;

    var datasetBar = datasets["barchart"];

    var alphabeticalDataset = Object.entries(datasetBar).sort(function(a, b) {
        a = a[0].toLowerCase();
        b = b[0].toLowerCase();
        return a < b ? -1 : a > b ? 1 : 0;
    });

    var alphabeticalTags = [];
    for (var i = 0; i < alphabeticalDataset.length; i++) {
        alphabeticalTags.push(alphabeticalDataset[i][0]);
    };

    var sortedDataset = Object.entries(datasetBar).sort(function(a, b) {
        aValue = a[1];
        bValue = b[1];
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    });

    var sortedTags = [];
    for (var i = 0; i < sortedDataset.length; i++) {
        sortedTags.push(sortedDataset[i][0]);
    };

    // Select the "g" of the barchart
    var g = d3.select("#gBarchart");

    // Select the "svg" for drawing the figure
    var svg = g.select("svg")

    // Select ther "div" for the tooltip
    var tooltip = d3.select(".barTooltip");

    // Define a "g" for the barchart
    var barChart = svg.append("g")
        .attr("class", "barchart")
        .attr("transform", `translate(${padding.left}, ${padding.top})`);

    // Scaling function for x values
    var xScale = d3.scaleLinear()
        .range([0, chartWidth])
        .domain([0, d3.max(Object.keys(datasetBar).map((tag) => datasetBar[tag])) * 1.05]);

    // Scaling function for y values
    var yScale = d3.scaleBand()
        .range([0, chartHeight])
        .domain(sortedTags)
        .padding(0.2);

    // Draw x-axis
    barChart.append("g").call(d3.axisTop(xScale))
        .attr("class", "axis");

    // Draw x label
    svg.append("text")
        .attr("class", "label")
        .attr("x", chartWidth / 2 + padding.left)
        .attr("y", padding.top / 1.5)
        .attr("text-anchor", "middle")
        .text("X label");

    // Draw vertical gridlines
    barChart.append("g")
        .attr("class", "grid")
        .attr("opacity", 0.3)
        .call(d3.axisBottom(xScale)
            .tickSize(chartHeight, 0, 0)
            .tickFormat("")
    );

    // Draw y-axis
    barChart.append("g").call(d3.axisLeft(yScale))
        .attr("class", "axis");

    // Draw title
    svg.append("text")
        .attr("class", "title")
        .attr("x", chartWidth / 2 + padding.left)
        .attr("y", padding.top / 4)
        .attr("text-anchor", "middle")
        .text("Title");

    // Draw bars with tooltips of their value when mousing over them
    var bars = barChart.selectAll(".bar")
        .data(Object.entries(datasetBar))
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(data) {
            return 0;
        })
        .attr("y", function(data) {
            return yScale(data[0]);
        })
        .attr("height", yScale.bandwidth())
        .attr("width", function(data) {
            return xScale(data[1]);
        })
        .on("click", function(values) {
            console.log(`Clicked on '${values[0]}', with ${values[1]} talks`);
            return updateCalendar(datasets["calendar"], values[0], firstYear, lastYear);
        })
        .on("mousemove", function(data) {
            tooltip
                .transition()
                .duration(50)
                .style('opacity', 0.9);
            tooltip
                .html(data[0] + '<br/>' + data[1] + " talks")
                .style("left", (d3.event.pageX + 15) + "px")
                .style("top", (d3.event.pageY - 15) + "px");
            })
        .on("mouseout", () => {
            tooltip
                .transition()
                .duration(500)
                .style('opacity', 0);
    });

};
