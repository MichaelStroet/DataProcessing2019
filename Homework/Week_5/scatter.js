// Name: Michael Stroet
// Student number: 11293284

window.onload = function() {
    /*
     * Main function
     */

    var dataYears = ["2012","2013","2014","2015","2016","2017"];
    var dataList = ["tourism","ppp","gdp"]

    var first = dataYears[0];
    var last = dataYears[dataYears.length - 1];

    // Call OECD API for three datasets
    // var tourismInbound = `https://stats.oecd.org/SDMX-JSON/data/TOURISM_INBOUND/AUS+AUT+BEL+BEL-BRU+BEL-VLG+BEL-WAL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+EGY+MKD+IND+IDN+MLT+MAR+PER+PHL+ROU+RUS+ZAF.INB_ARRIVALS_TOTAL/all?startTime=${first}&endTime=${last}`;
    // var purchasingPowerParities = `https://stats.oecd.org/SDMX-JSON/data/PPPGDP/PPP.AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EA18+OECD/all?startTime=${first}&endTime=${last}&dimensionAtObservation=allDimensions`;
    // var grossDomesticProduct = `https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EA19+EU28+OECD+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+ROU+RUS+SAU+ZAF.B1_GA.C/all?startTime=${first}&endTime=${last}&dimensionAtObservation=allDimensions`;

    // OECD API result taken from the dataprocessing website
    var tourismInbound = "tourism.json";
    var purchasingPowerParities = "ppp.json";
    var grossDomesticProduct = "gdp.json";

    // Convert the API responses to json strings
    var requests = [d3.json(tourismInbound), d3.json(purchasingPowerParities), d3.json(grossDomesticProduct)];

    // transform the responses into useful data objects
    Promise.all(requests).then(function(response) {
        var tourism = response[dataList.indexOf("tourism")]//transformResponseTourism(response[dataList.indexOf("tourism")]);
        var ppp = response[dataList.indexOf("ppp")]//transformResponsePPP(response[dataList.indexOf("ppp")]);
        var gdp = response[dataList.indexOf("gdp")]//transformResponseGDP(response[dataList.indexOf("gdp")]);

        // Prepare the datasets for the scatterplot
        var datasets = prepareData(tourism, ppp, gdp, dataYears, dataList);
        console.log(datasets);

        // Draw a scatterplot with the recieved data
        scatterPlot(datasets, dataYears, dataList);
        // Catch errors
        }).catch(function(e){
            throw(e);
    });
};


function scatterPlot(datasets, dataYears, dataList) {
    /*
     * Draws an interactive scatterplot
     */

    // Dimensions of the figure
    var svgWidth = 900;
    var svgHeight = 600;

    // Dimensions for the barchart with padding on all sides
    var padding = 80;
    var chartWidth = svgWidth - 2 * padding;
    var chartHeight = svgHeight - 2 * padding;

    // Define a "svg" for drawing the figure
    const svg = d3.select("body").append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Define a "g" for drawing the scatterplot
    const scatter = svg.append("g")
        .attr("class", "scatterplot")
        .attr("transform", `translate(${padding}, ${padding})`);

    // Define the div for the tooltip
    const div = d3.select("body").append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    var defaultYear = dataYears[0];
    defaultYear = "2012"
    var yearData = datasets[defaultYear];

    var xIndex = dataList.indexOf("tourism");
    var yIndex = dataList.indexOf("gdp");
    var colorIndex = dataList.indexOf("ppp");

    var maxValueColor = maxValue(yearData, colorIndex) * 1.001;

    // List for an axis label for each dataset
    var labelList = [
        "Inkomend toerisme (miljoenen)",
        "Koopkrachtpariteit (US$)",
        "Bruto binnenlands product (miljarden US$)"
    ];

    // Scaling function for x values
    const xScale = d3.scaleLinear()
        .range([0, chartWidth])
        .domain([0, maxValue(yearData, xIndex) * 1.05]);

    // Scaling function for y values
    const yScale = d3.scaleLinear()
        .range([chartHeight, 0])
        .domain([0, maxValue(yearData, yIndex) * 1.05]);

    // Draw x-axis
    scatter.append("g").call(d3.axisBottom(xScale))
        .attr("class", "axis")
        .attr("transform", `translate(0, ${chartHeight})`);

    // Draw x label
    svg.append("text")
        .attr("class", "label")
        .attr("x", chartWidth / 2 + padding)
        .attr("y", chartHeight + padding * 1.7)
        .attr("text-anchor", "middle")
        .text(`${labelList[xIndex]}`);

    // Draw vertical gridlines
    scatter.append("g")
        .attr("class", "grid")
        .attr("opacity", 0.3)
        .call(d3.axisBottom(xScale)
            .tickSize(chartHeight, 0, 0)
            .tickFormat("")
        );

    // Draw y-axis
    scatter.append("g").call(d3.axisLeft(yScale))
        .attr("class", "axis");

    // Draw y label
    svg.append("text")
        .attr("class", "label")
        .attr("x", - (chartHeight / 2) - padding)
        .attr("y", padding / 3.5)
        .attr("transform", "rotate(270)")
        .attr("text-anchor", "middle")
        .text(`${labelList[yIndex]}`);

    // Draw title
    svg.append("text")
        .attr("class", "title")
        .attr("x", chartWidth / 2 + padding)
        .attr("y", 40)
        .attr("text-anchor", "middle")
        .text("titel");

    // Draw horizontal gridlines
    scatter.append("g")
        .attr("class", "grid")
        .attr("opacity", 0.3)
        .call(d3.axisLeft(yScale)
            .tickSize(-chartWidth, 0, 0)
            .tickFormat("")
        );

    // http://colorbrewer2.org/#type=diverging&scheme=RdYlBu&n=11
    var colors = ['#a50026','#d73027','#f46d43','#fdae61','#fee090','#ffffbf','#e0f3f8','#abd9e9','#74add1','#4575b4','#313695'];
    var nColors = colors.length;

    // Define a "g" for all points
    var points = scatter.selectAll(".point")
    .data(yearData)
    .enter()
    .append("g");

    // Draw bars with tooltips of their value when mousing over them
    points.append("circle")
    .attr("class", "point")
    .attr("cx", function(point) {
        return xScale(point[xIndex]);
    })
    .attr("cy", function(point) {
        return yScale(point[yIndex]);
    })
    .attr("r", 5)
    .attr("fill", function(point) {
        return colors[Math.floor(point[colorIndex] / (maxValueColor / nColors))];
    })
    .attr("stroke", "black")
    .on("mouseover", function(point) {
        div
            .transition()
            .duration(50)
            .style('opacity', 0.9);
        div
            .html(point[point.length - 1])
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

function maxValue(data, dataIndex) {
    /*
     * Determines the maximum value of an array of arrays at a specific index
     */
    return d3.max(data, function(country) {
        return country[dataIndex];
    });
};
