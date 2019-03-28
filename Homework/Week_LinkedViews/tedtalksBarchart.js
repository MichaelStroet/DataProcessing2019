// Name: Michael Stroet
// Student number: 11293284

//
// WILDCARD GEBRUIKT
//

function barChart(datasets, firstYear, lastYear, colourInterpolator) {
    /*
    Draws an interactive barchart of the given data
    */

    // Isolate the barchart dataset from the datasets
    var datasetBar = datasets["barchart"];

    // The different ordering options for the barchart (descending, ascending, alphabetical)
    var orders = ["Afnemend", "Toenemend", "Alfabetisch"];

    // Sort the dataset in a descending order
    var descendingDataset = Object.entries(datasetBar).sort(function(a, b) {
        aValue = a[1];
        bValue = b[1];
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    });

    // Get all sorted tags from the sorted dataset
    var descendingTags = [];
    for (var i = 0; i < descendingDataset.length; i++) {
        descendingTags.push(descendingDataset[i][0]);
    };

    // Sort the dataset in an ascending order
    var ascendingDatabase = Object.entries(datasetBar).sort(function(a, b) {
        aValue = a[1];
        bValue = b[1];
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    });

    // Get all sorted tags from the sorted dataset
    var ascendingTags = [];
    for (var i = 0; i < ascendingDatabase.length; i++) {
        ascendingTags.push(ascendingDatabase[i][0]);
    };

    // Sort the dataset in an alphabetical order
    var alphabeticalDataset = Object.entries(datasetBar).sort(function(a, b) {
        a = a[0].toLowerCase();
        b = b[0].toLowerCase();
        return a < b ? -1 : a > b ? 1 : 0;
    });

    // Get all sorted tags from the sorted dataset
    var alphabeticalTags = [];
    for (var i = 0; i < alphabeticalDataset.length; i++) {
        alphabeticalTags.push(alphabeticalDataset[i][0]);
    };

    // Dictionary for the different ordened version of the barchart
    var orderedTags = {};

    // Add all the sorted tags to the dictionary
    orderedTags[orders[0]] = descendingTags;
    orderedTags[orders[1]] = ascendingTags;
    orderedTags[orders[2]] = alphabeticalTags;

    // Create a dropdown menu for the different orders
    var orderMenu = d3.select("#orderDropdown")

    orderMenu.append("select")
        .selectAll("option")
        .data(orders)
        .enter()
        .append("option")
        .attr("value", function(order){
            return order;
        })
        .text(function(order){
            return order;
        });

    // Padding for the barchart
    var padding = {
        top: 120,
        right: 50,
        bottom: 30,
        left: 180
    };

    var svgWidth = document.getElementById("barchart").clientWidth;
    var svgHeight = document.getElementById("barchart").clientHeight;

    var chartWidth = svgWidth - padding.left - padding.right;
    var chartHeight = svgHeight - padding.top - padding.bottom;

    // Select the "svg" for the barchart
    var svgBarchart = d3.select("#svgBarchart")

    // Select the "div" for the tooltip
    var tooltip = d3.select(".barTooltip");

    // Define a "g" for the barchart
    var barChart = svgBarchart.append("g")
        .attr("class", "barchart")
        .attr("transform", `translate(${padding.left}, ${padding.top})`);

    // Scaling function for x values
    var xScale = d3.scaleLinear()
        .range([0, chartWidth])
        .domain([0, d3.max(Object.keys(datasetBar).map((tag) => datasetBar[tag])) * 1.05]);

    // Scaling function for y values
    var yScale = d3.scaleBand()
        .range([0, chartHeight])
        .domain(orderedTags[orders[0]])
        .padding(0.2);

    // Draw x-axis
    barChart.append("g").call(d3.axisTop(xScale))
        .attr("class", "axis");

    // Draw x label
    svgBarchart.append("text")
        .attr("class", "label")
        .attr("x", chartWidth / 2 + padding.left)
        .attr("y", padding.top / 1.5)
        .attr("text-anchor", "middle")
        .text("Talks gegeven per thema");

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
        .attr("class", "axis")
        .attr("id", "tags");

    // Draw title
    svgBarchart.append("text")
        .attr("class", "title")
        .attr("x", chartWidth / 2 + padding.left)
        .attr("y", padding.top / 4)
        .attr("text-anchor", "middle")
        .text("Het gebruik van thema's in TEDtalks");

    // Draw bars with tooltips and updating the calendar when pressed
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
            return updateCalendar(datasets["calendar"], values[0], firstYear, lastYear, colourInterpolator);
        })
        .on("mousemove", function(data) {
            tooltip
                .transition()
                .duration(50)
                .style("opacity", 0.9);
            tooltip
                .html(data[0] + "<br/>" + data[1] + " talks")
                .style("left", (d3.event.pageX + 15) + "px")
                .style("top", (d3.event.pageY - 15) + "px");
            })
        .on("mouseout", () => {
            tooltip
                .transition()
                .duration(500)
                .style("opacity", 0);
    });

    // Update the order of the barchart with the chosen order
 	orderMenu.on("change", function(){

 		// Find which order was selected from the dropdown menu
 		var order = d3.select(this)
            .select("select")
            .property("value")

        // Update the barchart
        updateBarchart(datasetBar, order, orderedTags, chartHeight)
    });

};

function updateBarchart(datasetBar, order, orderedTags, chartHeight) {
    /*
    * Updates the barchart with the new order
    */

    var transDuration = 500;

    // Select the "svg" for the barchart
    var svgBarchart = d3.select("#svgBarchart").transition();

    // Create the new tag scale for the y axis
    var newTagScale = d3.scaleBand()
        .range([0, chartHeight])
        .domain(orderedTags[order])

    // Update all bars
    svgBarchart.selectAll(".bar")
        .duration(transDuration)
        .attr("y", function(data) {
            return newTagScale(data[0]);
        });

    // Select all y-axis ticks
    var tagTicks = svgBarchart.select("#tags").selectAll(".tick")

    // Update the y-axis ticks
    tagTicks.duration(transDuration)
        .attr("transform", function(data) {
            return `translate(0, ${newTagScale(data) + newTagScale.bandwidth() / 2})`;
        });

};
