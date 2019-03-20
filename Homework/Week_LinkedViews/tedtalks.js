// Name: Michael Stroet
// Student number: 11293284

window.onload = function() {
    /*
     * Main function
     */

    var inputJSON = "data.json";
    var data = d3.json(inputJSON);

    Promise.all([data]).then(function(response) {

        //
        var datasets = response[0];

        visualisationTedTalks(datasets);

        // Catch errors
        }).catch(function(e){
            throw(e);
        });
    };

function visualisationTedTalks(datasets) {

    var totalWidth = 1100,
        totalHeight = 4000;

    var svg = d3.select("body")
        .append("svg")
        .attr("width", totalWidth)
        .attr("height", totalHeight)
        .attr("class", "visualisation");

    var barWidth = totalWidth / 2,
        barHeight = totalHeight,
        calWidth = totalWidth - barWidth;

    svg.append("g")
        .attr("class", "gBarchart")
        .attr("transform", `translate(0, 30)`);

    // Define a "div" for the tooltip
    d3.select("body")
        .append('div')
        .attr('class', 'barTooltip')
        .style('opacity', 0);

    svg.append("g")
        .attr("class", "gCalendar")
        .attr("transform", `translate(${barWidth}, 0)`);

    // Define a "div" for the tooltip
    d3.select("body")
        .append('div')
        .attr('class', 'calTooltip')
        .style('opacity', 0);

    var firstYear = 1984,
        lastYear = 2018;

    barChart(datasets, barWidth, barHeight, firstYear, lastYear);
    enterCalendar(datasets["calendar"], calWidth, firstYear, lastYear);

};

function barChart(datasets, svgWidth, svgHeight, firstYear, lastYear) {
    /*
    Draws an interactive barchart of the given data
    */

    // Dimensions for the scatterplot with padding on all sides
    var padding = {
        top: 80,
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

    var alphabeticalKeys = Object.keys(datasetBar).sort(function(a, b) {
        a = a.toLowerCase();
        b = b.toLowerCase();
        return a < b ? -1 : a > b ? 1 : 0;
    });

    // Select the "g" of the barchart
    var g = d3.select(".gBarchart");

    // Define a "div" for the tooltip
    var tooltip = d3.select(".barTooltip");

    // Define a "svg" for drawing the figure
    var svg = g.append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

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
        .domain(alphabeticalKeys)

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

    // // Draw y label
    // svg.append("text")
    //     .attr("class", "label")
    //     .attr("x", - (chartHeight / 2) - padding.top)
    //     .attr("y", padding.left / 5)
    //     .attr("transform", "rotate(270)")
    //     .attr("text-anchor", "middle")
    //     .text("Y label");

    // Draw title
    svg.append("text")
        .attr("class", "title")
        .attr("id", "remove")
        .attr("x", chartWidth / 2 + padding.left)
        .attr("y", padding.top / 5)
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

// http://bl.ocks.org/GuilloOme/75f51c64c2132899d58d4cd6a23506d3
function enterCalendar(dataset, svgWidth, firstYear, lastYear) {
    /*
    Draws an interactive calendar of the given data
    */

    // Define the default tag
    var tag = "technology";

    var padding = {
        left  : 60,
        right : 20,
        top   : 10,
        bottom: 0
    };

    // Calculate the size of each calendar based on it's width
    var daysPerWeek = 7,
        weeksPerYear = 53;

    cellSize = (svgWidth - (padding.left + padding.right)) / weeksPerYear;
    var yearHeight = cellSize * daysPerWeek + padding.top;

    var format = d3.timeFormat("%Y-%m-%d");

    // Select g of the calendar view
    var g = d3.select(".gCalendar")

    // Select the tooltip div
    var tooltip = d3.select(".calTooltip");

    var svg = g.selectAll("svg")
        .data(d3.range(firstYear, lastYear))
        .enter()
        .append("g")
        .attr("transform", function(data) {
            console.log(data);
            return `translate(0, ${(data - firstYear) * yearHeight + padding.top + padding.bottom})`;
        })
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", yearHeight)
        .attr("class", "calendarYear")
        .append("g")
        .attr("transform", `translate(${padding.left}, ${padding.top / 2})`);

    svg.append("text")
        .attr("transform", `translate(${-2 * cellSize}, ${(yearHeight - padding.top) / 2})`)
        .style("text-anchor", "middle")
        .text(function(year) {
            return year;
        });

    var rect = svg.selectAll(".day")
        .data(function(year) { return d3.timeDays(new Date(year, 0, 1), new Date(year + 1, 0, 1)); })
        .enter()
        .append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function(date) { return d3.timeWeek.count(d3.timeYear(date), date) * cellSize; })
        .attr("y", function(date) { return date.getDay() * cellSize; })
        .attr("fill", function(date) {
            if (dataset[tag][format(date)] == undefined) {
                return "#fff";
            };
            if (dataset[tag][format(date)] == 1) {
                return "yellow";
            };
            if (dataset[tag][format(date)] <= 5) {
                return "orange";
            };
            if (dataset[tag][format(date)] <=10) {
                return "red";
            };

            return "darkred";

        })
        .datum(format)
        .on("mousemove", function(date) {
            tooltip
                .transition()
                .duration(50)
                .style('opacity', 0.9);
            tooltip
                .html(date)
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 40) + "px");
            })
        .on("mouseout", function() {
            tooltip
                .transition()
                .duration(500)
                .style('opacity', 0);
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

function updateCalendar(dataset, newTag, firstYear, lastYear) {

    var transDuration = 750;
    var format = d3.timeFormat("%Y-%m-%d");

    var svg = d3.select(".visualisation").transition();

    var rect = svg.selectAll(".day")
        .duration(transDuration)
        .attr("fill", function(date) {
            if (dataset[newTag][date] == undefined) {
                return "#fff";
            };
            if (dataset[newTag][date] == 1) {
                return "yellow";
            };
            if (dataset[newTag][date] <= 5) {
                return "orange";
            };
            if (dataset[newTag][date] <=10) {
                return "red";
            };

            return "darkred";
        });
};
