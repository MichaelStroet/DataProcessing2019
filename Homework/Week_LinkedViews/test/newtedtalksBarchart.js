// Name: Michael Stroet
// Student number: 11293284

function barChart(datasets, svgWidth, svgHeight, firstYear, lastYear, calWidth, colourInterpolator) {
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

    var orders = ["Descending", "Ascending", "Alphabetical"],
        orderedTags = {};

    // Create a dropdown
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

    var descendingDataset = Object.entries(datasetBar).sort(function(a, b) {
        aValue = a[1];
        bValue = b[1];
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    });

    var descendingTags = [];
    for (var i = 0; i < descendingDataset.length; i++) {
        descendingTags.push(descendingDataset[i][0]);
    };
    orderedTags[orders[0]] = descendingTags;

    var ascendingDatabase = Object.entries(datasetBar).sort(function(a, b) {
        aValue = a[1];
        bValue = b[1];
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    });

    var ascendingTags = [];
    for (var i = 0; i < ascendingDatabase.length; i++) {
        ascendingTags.push(ascendingDatabase[i][0]);
    };
    orderedTags[orders[1]] = ascendingTags;

    var alphabeticalDataset = Object.entries(datasetBar).sort(function(a, b) {
        a = a[0].toLowerCase();
        b = b[0].toLowerCase();
        return a < b ? -1 : a > b ? 1 : 0;
    });

    var alphabeticalTags = [];
    for (var i = 0; i < alphabeticalDataset.length; i++) {
        alphabeticalTags.push(alphabeticalDataset[i][0]);
    };
    orderedTags[orders[2]] = alphabeticalTags;

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
        .domain(orderedTags[orders[0]])
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
        .attr("class", "axis")
        .attr("id", "tags");

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
            console.log(`Clicked on "${values[0]}", with ${values[1]} talks`);
            return updateCalendar(datasets["calendar"], values[0], firstYear, lastYear, calWidth, colourInterpolator);
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

    // Run update function when dropdown selection changes
 	orderMenu.on("change", function(){

 		// Find which fruit was selected from the dropdown
 		var order = d3.select(this)
            .select("select")
            .property("value")

        // Run update function with the selected fruit
        updateBarchart(datasetBar, order, orderedTags, chartHeight)
    });

};

function updateBarchart(datasetBar, order, orderedTags, chartHeight) {

    var transDuration = 500;

    var g = d3.select("#gBarchart").transition();

    var newTagScale = d3.scaleBand()
        .range([0, chartHeight])
        .domain(orderedTags[order])

    g.selectAll(".bar")
        .duration(transDuration)
        .attr("y", function(data) {
            return newTagScale(data[0]);
        });

    // Draw y-axis
    var tagTicks = g.select("#tags").selectAll(".tick")

    tagTicks.duration(transDuration)
        .attr("transform", function(data) {
            return `translate(0, ${newTagScale(data) + newTagScale.bandwidth() / 2})`;
        });

};
