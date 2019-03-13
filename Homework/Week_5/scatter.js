// Name: Michael Stroet
// Student number: 11293284

window.onload = function() {
    /*
     * Main function
     */

    // Create an array of years
    var firstYear = 2012;
    var lastYear = 2017;

    var yearsList = [];
    for (var year = firstYear; year <= lastYear; year++) {
        yearsList.push(`${year}`);
    }

    // Array for the API requests
    var requests = [];

    // Array for the order in which to put data in prepareData.js
    var dataList = [];

    // Array for the label text for each corresponding dataset
    var labelList = [];

    // Call OECD API for three datasets and convert them to json strings

    // https://stats.oecd.org/Index.aspx?DataSetCode=TOURISM_OUTBOUND
    var tourismOutbound = `https://stats.oecd.org/SDMX-JSON/data/TOURISM_OUTBOUND/AUS+AUT+BEL+BEL-BRU+BEL-VLG+BEL-WAL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+EGY+IND+IDN+MLT+MAR+ROU+RUS+ZAF.OBND_DEP_TOTAL/all?startTime=${firstYear}&endTime=${lastYear}`;
    requests.push(d3.json(tourismOutbound));
    dataList.push("tourism");
    labelList.push("Uitgaand toerisme");

    // https://stats.oecd.org/Index.aspx?DataSetCode=PPPGDP
    var purchasingPowerParities = `https://stats.oecd.org/SDMX-JSON/data/PPPGDP/PPP.AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EA18+OECD/all?startTime=${firstYear}&endTime=${lastYear}&dimensionAtObservation=allDimensions`;
    requests.push(d3.json(purchasingPowerParities));
    dataList.push("ppp");
    labelList.push("Koopkrachtpariteit (Nationale valuta per US$)");

    // https://stats.oecd.org/Index.aspx?DataSetCode=SNA_TABLE1
    var grossDomesticProduct = `https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EA19+EU28+OECD+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+ROU+RUS+SAU+ZAF.B1_GA.C/all?startTime=${firstYear}&endTime=${lastYear}&dimensionAtObservation=allDimensions`;
    requests.push(d3.json(grossDomesticProduct));
    dataList.push("gdp");
    labelList.push("Bruto binnenlands product (Nationale valuta per US$)");


    Promise.all(requests).then(function(response) {

        // transform the responses into useful data objects
        var tourism = transformResponseTourism(response[dataList.indexOf("tourism")]);
        var ppp = transformResponsePPP(response[dataList.indexOf("ppp")]);
        var gdp = transformResponseGDP(response[dataList.indexOf("gdp")]);

        // Prepare the datasets for the scatterplot
        var datasets = prepareData(tourism, ppp, gdp, yearsList, dataList);

        // Draw a scatterplot with the recieved data
        scatterPlot(datasets, yearsList, dataList, labelList);

        // Catch errors
        }).catch(function(e){
            throw(e);
    });
};


function scatterPlot(datasets, yearsList, dataList, labelList) {
    /*
     * Draws an interactive scatterplot updateable by year
     */

    // Local function for (re)drawing the scatterplot
    var updateScatter = function(year) {

        // Remove the old scatterplot (if any)
        d3.selectAll("#remove").remove();

        var yearData = datasets[year];

        
        for (var i = 0; i < colors.length; i++)
            //colors[Math.floor(point[colorIndex] / (maxValueColor / colors.length))]
        legend.selectAll("g").data(colors)
            .enter()
            .append('g')
            .attr("id", "remove")
            .each(function(d,i){
                var g = d3.select(this);

                g.append("rect")
                    .attr("x", legendX)
                    .attr("y", legendY + i * itemSeperation)
                    .attr("width", 2 * sizeColorBlock)
                    .attr("height",sizeColorBlock)
                    .style("fill", colors[i])
                    .style("stroke", "black");

                g.append("text")
                    .attr("x", legendX + 2 * sizeColorBlock + 5)
                    .attr("y", legendY + (i * itemSeperation) + sizeColorBlock)
                    .text(colors[i]);
            });

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
             .attr("id", "remove")
             .attr("transform", `translate(0, ${chartHeight})`);

         // Draw x label
         svg.append("text")
             .attr("class", "label")
             .attr("id", "remove")
             .attr("x", chartWidth / 2 + padding.left)
             .attr("y", chartHeight + padding.top + padding.bottom / 1.3)
             .attr("text-anchor", "middle")
             .text(`${labelList[xIndex]}`);

         // Draw vertical gridlines
         scatter.append("g")
             .attr("class", "grid")
             .attr("id", "remove")
             .attr("opacity", 0.3)
             .call(d3.axisBottom(xScale)
                 .tickSize(chartHeight, 0, 0)
                 .tickFormat("")
             );

         // Draw y-axis
         scatter.append("g").call(d3.axisLeft(yScale))
             .attr("class", "axis")
             .attr("id", "remove");

         // Draw y label
         svg.append("text")
             .attr("class", "label")
             .attr("id", "remove")
             .attr("x", - (chartHeight / 2) - padding.top)
             .attr("y", padding.left / 5)
             .attr("transform", "rotate(270)")
             .attr("text-anchor", "middle")
             .text(`${labelList[yIndex]}`);

         // Draw horizontal gridlines
         scatter.append("g")
             .attr("class", "grid")
             .attr("id", "remove")
             .attr("opacity", 0.3)
             .call(d3.axisLeft(yScale)
                 .tickSize(-chartWidth, 0, 0)
                 .tickFormat("")
             );

         // Draw title
         svg.append("text")
             .attr("class", "title")
             .attr("id", "remove")
             .attr("x", chartWidth / 2 + padding.left)
             .attr("y", padding.top / 2)
             .attr("text-anchor", "middle")
             .text(`Uitgaand toerisme van verschillende landen in ${year} afhankelijk van BBP en koopkrachtpariteit`);

        // calculate the maximum value of the color dataset
        var maxValueColor = maxValue(yearData, colorIndex) * 1.0001;

        // Draw all data entries as points in the scatterplot
        var points = scatter.selectAll(".point")
            .data(yearData)
            .enter()
            .append("circle")
                .attr("class", "point")
                .attr("id", "remove")
                .attr("cx", function(point) {
                return xScale(point[xIndex]);
                })
                .attr("cy", function(point) {
                return yScale(point[yIndex]);
                })
                .attr("fill", function(point) {
                return colors[Math.floor(point[colorIndex] / (maxValueColor / colors.length))];
                })
                .on("mouseover", function(point) {
                    tooltip
                        .transition()
                        .duration(50)
                        .style('opacity', 0.9);
                    tooltip
                        .html(point[point.length - 1])
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 40) + "px");
                })
                .on("mouseout", function() {
                tooltip
                .transition()
                .duration(500)
                .style('opacity', 0);
                });
    };

    // Dimensions of the figure
    var svgWidth = 1000;
    var svgHeight = 600;

    // Dimensions for the scatterplot with padding on all sides
    var padding = {
        top: 30,
        right: 130,
        bottom: 50,
        left: 100
    };

    var chartWidth = svgWidth - padding.left - padding.right;
    var chartHeight = svgHeight - padding.top - padding.bottom;;

    // Define a "svg" for the figure
    const svg = d3.select("body").append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Define a "g" for the scatterplot
    const scatter = svg.append("g")
        .attr("class", "scatterplot")
        .attr("transform", `translate(${padding.left}, ${padding.top})`);

    // Define a "div" for the tooltip
    const tooltip = d3.select("body").append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    // Define a "g" for the legend
    const legend = svg.append("g")
        .attr("class", "legend");

    // Define a "div" for the update buttons
    const buttonGroup = d3.select("body").append("div")
        .attr("class", "buttonGroup")

    // Define the size and location of the legend
    var legendX = padding.left + chartWidth + 10;
    var legendY = padding.top;

    // Define the internal sizes and distances of the legend
    var sizeColorBlock = 10;
    var itemSeperation = 20;

    // Define which dataset will be used for the axes and the color
    var xIndex = dataList.indexOf("tourism");
    var yIndex = dataList.indexOf("gdp");
    var colorIndex = dataList.indexOf("ppp");

    // Define the colors for the color dataset (origin: http://colorbrewer2.org/#type=diverging&scheme=RdYlBu&n=11)
    var colors = ['#a50026','#d73027','#f46d43','#fdae61','#fee090','#ffffbf','#e0f3f8','#abd9e9','#74add1','#4575b4','#313695'];

    // Create a button for each year in yearsList
    buttonGroup.selectAll("input")
        .data(yearsList)
        .enter()
        .append("input")
        .attr("type","button")
        .attr("class","button")
        .attr("value", function (year) {
            return year;
        });

    // When a button is pressed, redraw the scatterplot for the corresponding year
    buttonGroup.selectAll("input")
        .on("click", function(year) {
            return updateScatter(year);
        });

    // Draw the first year as the default plot
    updateScatter(yearsList[0]);
};

function maxValue(data, dataIndex) {
    /*
     * Determines the maximum value of an array of arrays at a specific index
     */
    return d3.max(data, function(country) {
        return country[dataIndex];
    });
};
