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
        console.log(datasets);

        // Catch errors
        }).catch(function(e){
            throw(e);
        });
    };


function visualisationTedTalks(datasets) {

    var totalWidth = 1100,
        totalHeight = 4000;

    var body = d3.select("body")

    var svg = body.append("svg")
        .attr("width", totalWidth)
        .attr("height", totalHeight)
        .attr("class", "visualisation");

    var barWidth = totalWidth / 2,
        barHeight = totalHeight,
        calWidth = totalWidth - barWidth;

    // Define a "g" for the barchart
    var gBar = svg.append("g")
        .attr("class", "container")
        .attr("id", "gBarchart")
        .attr("transform", `translate(0, 0)`);

    // Define a "svg" for the barchart
    gBar.append("svg")
        .attr("width", barWidth)
        .attr("height", barHeight);

    // Define a "div" for the barchart tooltip
    body.append("div")
        .attr("class", "barTooltip")
        .style("opacity", 0);

    // Define a "g" for the calendar view
    svg.append("g")
        .attr("class", "container")
        .attr("id", "gCalendar")
        .attr("transform", `translate(${barWidth}, 0)`);

    // Define a "div" for the calendar tooltip
    body.append("div")
        .attr("class", "calTooltip")
        .style("opacity", 0);

    var firstYear = 2000,
        lastYear = 2017;
    var colourInterpolator = d3.interpolateMagma

    barChart(datasets, barWidth, barHeight, firstYear, lastYear, calWidth, colourInterpolator);
    enterCalendar(datasets["calendar"], calWidth, firstYear, lastYear, colourInterpolator);

};
