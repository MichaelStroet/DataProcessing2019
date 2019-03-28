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

    var svgBarchart = d3.select("#barchart")
        .append("svg")
        .attr("class", "container")
        .attr("id", "svgBarchart")
        .attr("width", widthBarchart)
        .attr("height", totalHeight);

    var svgCalendar = d3.select("#calendar")
        .append("svg")
        .attr("class", "container")
        .attr("id", "svgCalendar")
        .attr("width", widthCalendar)
        .attr("height", totalHeight);

    var divTalks = d3.select("#talks");

    divTalks.append("p")
        .text("Talks van de geselecteerde dag")

    var firstYear = 2000,
        lastYear = 2017;
    var colourInterpolator = d3.interpolateMagma

    barChart(datasets, firstYear, lastYear, colourInterpolator);
    enterCalendar(datasets["calendar"], firstYear, lastYear, colourInterpolator);

};

window.onresize = resize;

//We will build a basic function to handle window resizing.
function resize() {

    var widthBarchart = document.getElementById("barchart").clientWidth;
    var widthCalendar = document.getElementById("calendar").clientWidth;

    d3.select("#svgBarchart")
        .attr('width', widthBarchart);
    d3.select("#svgCalendar")
        .attr('width', widthCalendar);
};
