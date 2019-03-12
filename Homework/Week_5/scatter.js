// Name: Michael Stroet
// Student number: 11293284

/*
 * Main function
 */

window.onload = function() {

    // Call OECD API for three datasets
    // var tourismInbound = "https://stats.oecd.org/SDMX-JSON/data/TOURISM_INBOUND/AUS+AUT+BEL+BEL-BRU+BEL-VLG+BEL-WAL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+EGY+MKD+IND+IDN+MLT+MAR+PER+PHL+ROU+RUS+ZAF.INB_ARRIVALS_TOTAL/all?startTime=2009&endTime=2017";
    // var purchasingPowerParities = "https://stats.oecd.org/SDMX-JSON/data/PPPGDP/PPP.AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EA18+OECD/all?startTime=2009&endTime=2017&dimensionAtObservation=allDimensions";
    // var grossDomesticProduct = "https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EA19+EU28+OECD+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+ROU+RUS+SAU+ZAF.B1_GA.C/all?startTime=2009&endTime=2017&dimensionAtObservation=allDimensions";

    // Convert the recieved responses to json strings
    var tourismInbound = "tourism.json";
    var purchasingPowerParities = "ppp.json";
    var grossDomesticProduct = "gdp.json";

    var requests = [d3.json(tourismInbound), d3.json(purchasingPowerParities), d3.json(grossDomesticProduct)];

    // transform the responses into useful data objects
    Promise.all(requests).then(function(response) {
        let tourism = response[0]//transformResponseTourism(response[0]);
        let ppp = response[1]//transformResponsePPP(response[1]);
        let gdp = response[2]//transformResponseGDP(response[2]);
        let datasets = prepareData(tourism, ppp, gdp);

        // Draw a scatterplot with the recieved data
        scatterPlot(datasets)

        // Catch errors
        }).catch(function(e){
        throw(e);
    });
};


function prepareData(tourism, ppp, gdp) {

    var addDataToDict = function(dataset, datasetCountries, dataIndex) {
        for (var i = 0; i < datasetCountries.length; i++) {
            var countryName = (datasetCountries[i])
            if (dataCountries.includes(countryName)) {
                var countryData = dataset[countryName];
                var countryIndex = dataCountries.indexOf(countryName);

                for (var j = 0; j < countryData.length; j++) {
                    var year = countryData[j].Time;
                    if (year == undefined) {
                        year = countryData[j].Year
                    };
                    var data = countryData[j].Datapoint;

                    if (dataYears.includes(year)) {
                        datasets[year][countryIndex][dataIndex] = data

            }}}
        }
    };

    var tourismCountries = Object.keys(tourism);
    var pppCountries = Object.keys(ppp);
    var gdpCountries = Object.keys(gdp);

    var dataCountries = CommonCountries([tourismCountries, pppCountries, gdpCountries]);
    var dataYears = ["2012","2013","2014","2015","2016","2017"]; // alleen 2012-2017

    var datasets = {}
    dataYears.forEach(function(year) {
        datasets[year] = [];
        dataCountries.forEach(function(country) {
            datasets[year].push([country, "tourism", "ppp", "gdp"]);
        })
    });


    addDataToDict(tourism, tourismCountries, 1);
    console.log(datasets);
    addDataToDict(ppp, pppCountries, 2);
    console.log(datasets);
    addDataToDict(gdp, gdpCountries, 3);
    console.log(datasets);

    return [tourism, ppp, gdp]
};

// https://codereview.stackexchange.com/questions/96096/find-common-elements-in-a-list-of-arrays
function CommonCountries(dataCountries) {
    var currentValues = {};
    var commonValues = {};
    for (var i = 0; i < dataCountries[0].length; i++) {
        currentValues[dataCountries[0][i]] = "";
    }
    for (var i = 1; i < dataCountries.length; i++) {
        var currentArray = dataCountries[i];
        for (var j = 0; j < currentArray.length; j++) {
            if (currentArray[j] in currentValues){
                commonValues[currentArray[j]] = "";
            }
        }
        currentValues = commonValues;
        commonValues = {};
    }
    return Object.keys(currentValues);
};

/////////////////////////////////////////////////////////////////////////////////
    /*
     * Maken van data lijst met elementen dictionary van dataset waarden
     * data = [ {tourism : 2342342, ppp : 23456, gdp: 2345634},
     *          {tourism : 234234,  ppp : 156,   gdp: Null},
     *          {tourism : Null, ppp : 1346,  gdp: 4234213}
     *          ]
     *
     * Eventueel land en jaar toevoegen? => mogelijkheid landen / jaren te isoleren
     */

     // Lijst van landen in alle 3 datasets
     // Lijst van alle jaren (2009 - 2017)

     // Maak lege lijst aan voor data

     // Loopen over alle landen in de landen Lijst

        // Loopen over elk jaar

            // Maak lege dict aan
            // Voeg eventueel land en jaar toe aan dic

            // Als tourism een waarde bij dit land en jaar heeft
                // Voeg {tourism : datapunt} toe aan dict
            // Anders voeg Null waarde toe

            // Als ppp een waarde bij dit land en jaar heeft
                // Voeg {ppp : datapunt} toe aan dict
            // Anders voeg Null waarde toe

            // Als gdp een waarde bij dit land en jaar heeft
                // Voeg {gdp : datapunt} toe aan dict
            // Anders voeg Null waarde toe

            // Als dict minimaal 2 non-Null waardes heeft
                // Voeg dict toe aan data lijst






/*
 * Draws an interactive scatterplot
 */

function scatterPlot(datasets) {

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

    // List for an axis label for each dataset
    var labelList = [
        "Inkomend toerisme (miljoenen)",
        "Koopkrachtpariteit (US$)",
        "Bruto binnenlands product (miljarden US$)"
    ];
    // List for reducing the length of tick labels
    var axisTicksScaling = [
        1e+9,
        1,
        1e+12
    ];

    // Define x- and y-axis datasets
    var xDataIndex = 0;
    var yDataIndex = 1;

    // Determine the maximum value of dataset x
    var xDataMax = maxDatapoint(datasets[xDataIndex]);

    // Scaling function for x values
    const xScale = d3.scaleLinear()
        .range([0, chartWidth])
        .domain([0, xDataMax * 1.05]);

    // Determine the maximum value of dataset y
    var yDataMax = maxDatapoint(datasets[yDataIndex]);

    // Scaling function for y values
    const yScale = d3.scaleLinear()
        .range([chartHeight, 0])
        .domain([0, yDataMax * 1.05]);

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
        .text(`${labelList[xDataIndex]}`);

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
        .text(`${labelList[yDataIndex]}`);

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

    tourism = datasets[0];
    ppp = datasets[1];

    var tourismCountries = Object.keys(tourism);
    var data = [];
    var years = ["2009","2010","2011","2012","2013","2014","2015","2016","2017"];

    // tourismCountries.forEach(function(country) {
    //     let countryIndex = tourismCountries.indexOf(country);
    //     console.log(country);
    //     console.log(tourism[country]);
    //     years.forEach(function(year) {
    //         let yearIndex = years.indexOf(year);
    //         let xValue = tourism[tourismCountries[countryIndex]][yearIndex];
    //         let yValue = ppp[tourismCountries[countryIndex]][yearIndex];
    //         console.log(xValue, yValue);
    //         console.log("NEXT");
    //         data.push([xValue, yValue]);
    //     });
    // });
    years.forEach(function(year) {
        let yearIndex = years.indexOf(year);
        let xValue = tourism[tourismCountries[0]][yearIndex].Datapoint;
        let yValue = ppp[tourismCountries[0]][yearIndex].Datapoint;
        data.push([xValue, yValue]);
    });

    // Define a "g" for each point
    var points = scatter.selectAll(".point")
    .data(data)
    .enter()
    .append("g");

    // Draw bars with tooltips of their value when mousing over them
    points.append("circle")
    .attr("class", "point")
    .attr("cx", function(point) {
         return xScale(point[0]);
    })
    .attr("cy", function(point) {
         return yScale(point[1]);
    })
    .attr("r", 5);



};


/*
 * Determines the maximum datapoint of a given dataset
 */

function maxDatapoint(dataset) {

    // Reduce the data set to an array of arrays
    data = Object.values(dataset);

    // Determine the maximum value in the data
    var maxData = d3.max(data, function(country) {
        return d3.max(country, function(years) {
            return years.Datapoint;
        });

    });

    return maxData;
};
