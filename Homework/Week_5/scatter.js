// Name: Michael Stroet
// Student number: 11293284

/*
 * Main function
 */

window.onload = function() {

    // Call OECD API for three datasets
    const tourismInbound = "https://stats.oecd.org/SDMX-JSON/data/TOURISM_INBOUND/AUS+AUT+BEL+BEL-BRU+BEL-VLG+BEL-WAL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+EGY+MKD+IND+IDN+MLT+MAR+PER+PHL+ROU+RUS+ZAF.INB_ARRIVALS_TOTAL/all?startTime=2009&endTime=2017";
    const purchasingPowerParities = "https://stats.oecd.org/SDMX-JSON/data/PPPGDP/PPP.AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EA18+OECD/all?startTime=2009&endTime=2017&dimensionAtObservation=allDimensions";
    const grossDomesticProduct = "https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EA19+EU28+OECD+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+ROU+RUS+SAU+ZAF.B1_GA.C/all?startTime=2009&endTime=2017&dimensionAtObservation=allDimensions";

    // Convert the recieved responses to json strings
    var requests = [d3.json(tourismInbound), d3.json(purchasingPowerParities), d3.json(grossDomesticProduct)];

    // transform the responses into useful data objects
    Promise.all(requests).then(function(response) {
        let tourism = transformResponseTourism(response[0]);
        let ppp = transformResponsePPP(response[1]);
        let gdp = transformResponseGDP(response[2]);

        // Draw a scatterplot with the recieved data
        scatterPlot([tourism, ppp, gdp])

        // Catch errors
        }).catch(function(e){
        throw(e);
    });

};


/*
 * Draws an interactive scatterplot
 */

function scatterPlot(datasets) {
    console.log(datasets);

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

    // Define a "g" for drawing the scatterplot
    const scatter = svg.append("g")
        .attr("class", "scatterplot")
        .attr("transform", `translate(${padding}, ${padding})`);

    // Define the div for the tooltip
    const div = d3.select("body").append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    var xDataMax = 100;
    // Scaling function for x values
    const xScale = d3.scaleLinear()
        .range([0, chartWidth])
        .domain([0, xDataMax]);

    var yDataMax = 100;
    // Scaling function for y values
    const yScale = d3.scaleLinear()
        .range([chartHeight, 0])
        .domain([0, yDataMax]);

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
        .text("x data");

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
        .text("y data");

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

    // Draw vertical gridlines
    scatter.append("g")
        .attr("class", "grid")
        .attr("opacity", 0.3)
        .call(d3.axisBottom(xScale)
            .tickSize(chartHeight, 0, 0)
            .tickFormat("")
        );

};
