// Name: Michael Stroet
// Student number: 11293284

window.onload = function() {
    /*
     * Main function
     */

     var inputJSON = "data.json";
     var data = d3.json(inputJSON);

     Promise.all([data]).then(function(response) {

         // Prepare the datasets for the scatterplot
         var dataset = response[0];

         barChart(dataset["barchart"]);
         calendarView(dataset["calendar"]);

         // Catch errors
         }).catch(function(e){
             throw(e);
     });
};

function barChart(dataset) {
    /*
    Draws an interactive barchart of the given data
    */

    // Dimensions of the figure
    var svgWidth = 1280;
    var svgHeight = 720;

    // Dimensions for the scatterplot with padding on all sides
    var padding = {
        top: 30,
        right: 20,
        bottom: 50,
        left: 100
    };

    var chartWidth = svgWidth - padding.left - padding.right;
    var chartHeight = svgHeight - padding.top - padding.bottom;

    var alphabeticalDataset = Object.entries(dataset).sort(function(a, b) {
        a = a[0].toLowerCase();
        b = b[0].toLowerCase();
        return a < b ? -1 : a > b ? 1 : 0;
    });

    var alphabeticalKeys = Object.keys(dataset).sort(function(a, b) {
        a = a.toLowerCase();
        b = b.toLowerCase();
        return a < b ? -1 : a > b ? 1 : 0;
    });

    // Define a "svg" for drawing the figure
    const svg = d3.select("body").append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Define a "g" for the barchart
    const barChart = svg.append("g")
        .attr("class", "barchart")
        .attr("transform", `translate(${padding.left}, ${padding.top})`);

    // Define a "div" for the tooltip
    const tooltip = d3.select("body").append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    // Scaling function for x values
    const xScale = d3.scaleBand()
        .range([0, chartWidth])
        .domain(alphabeticalKeys)
        .padding(0.2);

    // Scaling function for y values
    const yScale = d3.scaleLinear()
        .range([chartHeight, 0])
        .domain([0, d3.max(Object.keys(dataset).map((tag) => dataset[tag])) * 1.02]);

    // Draw x-axis
    barChart.append("g").call(d3.axisBottom(xScale))
        .attr("class", "axis")
        .attr("transform", `translate(0, ${chartHeight})`);

    // Draw x label
    svg.append("text")
        .attr("class", "label")
        .attr("x", chartWidth / 2 + padding.left)
        .attr("y", chartHeight + padding.top + padding.bottom / 1.3)
        .attr("text-anchor", "middle")
        .text("X label");

    // Draw y-axis
    barChart.append("g").call(d3.axisLeft(yScale))
        .attr("class", "axis");

    // Draw y label
    svg.append("text")
        .attr("class", "label")
        .attr("x", - (chartHeight / 2) - padding.top)
        .attr("y", padding.left / 5)
        .attr("transform", "rotate(270)")
        .attr("text-anchor", "middle")
        .text("Y label");

    // Draw horizontal gridlines
    barChart.append("g")
        .attr("class", "grid")
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
        .text("Title");

    // Define a "g" for each bar
    var bars = barChart.selectAll(".bar")
        .data(alphabeticalDataset)
        .enter();

    // Draw bars with tooltips of their value when mousing over them
    bars.append("rect")
        .attr("class", "bar")
        .attr("x", function(data) {
            return xScale(data[0]);
        })
        .attr("y", function(data) {
            return yScale(data[1]);
        })
        .attr("height", function(data) {
            return chartHeight - yScale(data[1]);
        })
        .attr("width", xScale.bandwidth())
        .on("mousemove", function(data) {
            tooltip
                .transition()
                .duration(50)
                .style('opacity', 0.9);
            tooltip
                .html(data[0] + '<br/>' + data[1] + " talks")
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 40) + "px");
            })
        .on("mouseout", () => {
            tooltip
                .transition()
                .duration(500)
                .style('opacity', 0);
    });

};


function calendarView(dataset) {
    var defaultTag = "technology";

    var dates = Object.keys(dataset[defaultTag]);
    var years = [];

    for (date in dates) {
        years.push(dates[date].substring(0,4));
    };
    years = years.map(Number);

    drawCalendar(dataset, d3.min(years), d3.max(years));
};


function drawCalendar(dataset, firstYear, lastYear) {
    /*
    Draws an interactive calendar of the given data
    */

    // http://bl.ocks.org/GuilloOme/75f51c64c2132899d58d4cd6a23506d3
    var padding = {
        left : 100,
        right: 10,
        top  : 20
    };

    // Calculate the size of each calendar based on it's width
    var yearWidth = 1280,
        daysPerWeek = 7,
        weeksPerYear = 53;

    cellSize = (yearWidth - (padding.left + padding.right)) / weeksPerYear;
    var yearHeight = cellSize * daysPerWeek + padding.top;

    var percent = d3.format(".1%");
    var format = d3.timeFormat("%Y-%m-%d");

    // Create div for the calender view
    d3.select("body").append("div")
        .attr("class", "calendar")

    var svg = d3.select(".calendar").selectAll("svg")
        .data(d3.range(firstYear, lastYear + 1))
        .enter()
        .append("svg")
        .attr("width", yearWidth)
        .attr("height", yearHeight)
        .attr("class", "RdYlGn")
        .append("g")
        .attr("transform", `translate(${padding.left}, ${padding.top / 2})`);

    svg.append("text")
        .attr("transform", `translate(${- cellSize}, ${(yearHeight - padding.top) / 2})rotate(270)`)
        .style("text-anchor", "middle")
        .text(function(data) {
            return data;
        });

    var rect = svg.selectAll(".day")
        .data(function(data) { return d3.timeDays(new Date(data, 0, 1), new Date(data + 1, 0, 1)); })
        .enter()
        .append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function(data) { return d3.timeWeek.count(d3.timeYear(data), data) * cellSize; })
        .attr("y", function(data) { return data.getDay() * cellSize; })
        .datum(format);

    rect.append("title")
        .text(function(data) {
            return data;
        });

    svg.selectAll(".month")
        .data(function(data) {
            return d3.timeMonths(new Date(data, 0, 1), new Date(data + 1, 0, 1));
        })
        .enter()
        .append("path")
        .attr("class", "month")
        .attr("d", monthPath);
};


function monthPath(t0) {
    /*

    */

    var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
        d0 = t0.getDay(),
        w0 = d3.timeWeek.count(d3.timeYear(t0),t0),
        d1 = t1.getDay(),
        w1 = d3.timeWeek.count(d3.timeYear(t1),t1);

    return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
        + "H" + w0 * cellSize + "V" + 7 * cellSize
        + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
        + "H" + (w1 + 1) * cellSize + "V" + 0
        + "H" + (w0 + 1) * cellSize + "Z";
};
