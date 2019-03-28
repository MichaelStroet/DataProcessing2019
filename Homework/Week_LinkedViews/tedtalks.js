// Name: Michael Stroet
// Student number: 11293284

//
// WILDCARD GEBRUIKT
//

window.onload = function() {
    /*
     * Main function
     */

    var inputJSON = "data.json";

    // Import the json and visualise its contents
    d3.json(inputJSON).then(function(datasets) {
        visualisationTedTalks(datasets);
    });
};

function visualisationTedTalks(datasets) {

    var totalHeight = 5000;

    var widthBarchart = document.getElementById("barchart").clientWidth;
    var widthCalendar = document.getElementById("calendar").clientWidth;

    var body = d3.select("body")

    // Define a "div" for the barchart tooltip
    body.append("div")
        .attr("class", "barTooltip")
        .style("opacity", 0);

    // Define a "div" for the calendar tooltip
    body.append("div")
        .attr("class", "calTooltip")
        .style("opacity", 0);

    // Define a "svg" for the barchart
    var svgBarchart = d3.select("#barchart")
        .append("svg")
        .attr("class", "container")
        .attr("id", "svgBarchart")
        .attr("width", widthBarchart)
        .attr("height", totalHeight);

    // Define a "svg" for the calendar
    var svgCalendar = d3.select("#calendar")
        .append("svg")
        .attr("class", "container")
        .attr("id", "svgCalendar")
        .attr("width", widthCalendar)
        .attr("height", totalHeight);

    // Add a title to the talks list "div"
    var divTalks = d3.select("#talks");

    divTalks.append("p")
        .text("Talks van de geselecteerde dag")

    // Define the years and colour interpolator for the calendar
    var firstYear = 2000,
        lastYear = 2017;
    var colourInterpolator = d3.interpolateMagma

    // Draw a barchart of the amount of talks per tag
    barChart(datasets, firstYear, lastYear, colourInterpolator);

    // Draw a calendar of the amount of talks per day per tag
    enterCalendar(datasets["calendar"], firstYear, lastYear, colourInterpolator);
};

window.onresize = resize;

function resize() {
    /*
    * Resize the svg's when the window is resized (doesn't resize the actual figures)
    */
    
    var widthBarchart = document.getElementById("barchart").clientWidth;
    var widthCalendar = document.getElementById("calendar").clientWidth;

    d3.select("#svgBarchart")
        .attr('width', widthBarchart);
    d3.select("#svgCalendar")
        .attr('width', widthCalendar);
};
