// Name: Michael Stroet
// Student number: 11293284

// http://bl.ocks.org/GuilloOme/75f51c64c2132899d58d4cd6a23506d3
function enterCalendar(dataset, calWidth, firstYear, lastYear, colourInterpolator) {
    /*
    Draws an interactive calendar of the given data
    */

    // Define the default tag
    var tag = "technology";

    var padding = {
        top  : 120,
        left  : 60,
        right : 20,
        bottom: 10
    };

    // Calculate the size of each calendar based on it's width
    var daysPerWeek = 7,
        weeksPerYear = 53;

    var cellSize = (calWidth - (padding.left + padding.right)) / weeksPerYear;
    var yearHeight = cellSize * daysPerWeek + padding.bottom;

    var format = d3.timeFormat("%Y-%m-%d");

    // Select g of the calendar view
    var g = d3.select("#gCalendar")

    // Select the tooltip div
    var tooltip = d3.select(".calTooltip");

    // Draw title
    g.append("text")
        .attr("class", "title")
        .attr("x", calWidth / 2)
        .attr("y", padding.top / 4)
        .attr("text-anchor", "middle")
        .text(`Calendar title {${tag}}`);

    var cal = g.selectAll("svg")
        .data(d3.range(firstYear, lastYear + 1))
        .enter()
        .append("g")
        .attr("class", "calendarYear")
        .attr("transform", function(data) {
            return `translate(${padding.left}, ${(lastYear - data) * yearHeight + padding.top})`;
        })
        .attr("width", calWidth)
        .attr("height", yearHeight)

    cal.append("text")
        .attr("transform", `translate(${-2 * cellSize}, ${(yearHeight - padding.bottom) / 2})`)
        .style("text-anchor", "middle")
        .text(function(year) {
            return year;
        });

    var talkAmounts = [];
    Object.values(dataset[tag]).forEach(function(talk){
        talkAmounts.push(talk["talks"]);
    });

    var legendMaxValue = d3.max(talkAmounts);

    var colourScale = d3.scaleSequential()
        .domain([legendMaxValue, 0])
        .interpolator(colourInterpolator);

    var pickColour = function(data) {
        if (data == undefined || data == 0) {
            return "#ffffff";
        };
        if (typeof(data) == "number") {
            return colourScale(data);
        };
        return colourScale(data["talks"]);
    };

    var legendWidth = calWidth,
        legendHeight = padding.top,
        legendPadding = {
            top   : padding.top / 1.5,
            right : padding.right + 5,
            bottom: 25,
            left  : padding.left + 5
        };

    var gradientWidth = legendWidth - legendPadding.right - legendPadding.left;
    var gradientHeight = legendHeight - legendPadding.top - legendPadding.bottom;

    // Scaling function for x values
    var legendScale = d3.scaleLinear()
            .range([0, gradientWidth - 1])
            .domain([0, legendMaxValue]);

    // Append a defs (for definition) element to g
    var defs = g.append("defs")
        .attr("class", "linearGradient");

    //A ppend a linearGradient element to the defs and give it a unique id
    var linearGradient = defs.append("linearGradient")
        .attr("id", "calendarGradient");

    //Horizontal gradient
    linearGradient
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");

    //Append multiple color stops by using D3's data/enter step
    linearGradient.selectAll("stop")
        .data([
            {offset: "0%", color: `${pickColour(0)}`},
            {offset: "12.5%", color: `${pickColour(0.125 * legendMaxValue)}`},
            {offset: "25%", color: `${pickColour(0.25 * legendMaxValue)}`},
            {offset: "37.5%", color: `${pickColour(0.375 * legendMaxValue)}`},
            {offset: "50%", color: `${pickColour(0.5 * legendMaxValue)}`},
            {offset: "62.5%", color: `${pickColour(0.625 * legendMaxValue)}`},
            {offset: "75%", color: `${pickColour(0.75 * legendMaxValue)}`},
            {offset: "87.5%", color: `${pickColour(0.875 * legendMaxValue)}`},
            {offset: "100%", color: `${pickColour(legendMaxValue)}`}
          ])
        .enter()
        .append("stop")
        .attr("offset", function(data) { return data.offset; })
        .attr("stop-color", function(data) { return data.color; });

    var legend = g.append("g")
        .attr("class", "legend")
        .attr("width", legendWidth)
        .attr("height", legendHeight)

    legend.append("rect")
        .attr("x", legendPadding.left)
        .attr("y", legendPadding.top)
        .attr("width", gradientWidth)
        .attr("height", gradientHeight)
        .style("fill", "url(#calendarGradient)");

    // Draw x-axis
    legend.append("g")
        .attr("class", "axis")
        .attr("id", "legendAxis")
        .call(d3.axisBottom(legendScale)
            .ticks(legendMaxValue)
        )
        .attr("transform", `translate(${legendPadding.left}, ${gradientHeight + legendPadding.top})`);

    // Draw x label
    legend.append("text")
        .attr("class", "label")
        .attr("x", legendWidth / 2)
        .attr("y", legendPadding.top / 1.2)
        .attr("text-anchor", "middle")
        .text("Talks given per day");

    var rect = cal.selectAll(".day")
        .data(function(year) { return d3.timeDays(new Date(year, 0, 1), new Date(year + 1, 0, 1)); })
        .enter()
        .append("rect")
        .attr("class", "day")
        .attr("id", `${tag}`)
        .attr("width", cellSize)
        .attr("height", cellSize)

        .attr("x", function(date) {
            return d3.timeWeek.count(d3.timeYear(date), date) * cellSize;
        })
        .attr("y", function(date) {
            return date.getDay() * cellSize;
        })
        .datum(format)
        .attr("fill", function(date) {
            return pickColour(dataset[tag][date]);
        })

        .on("click", function(date) {
            console.log(`Clicked on "${date}", with ${getTalks(dataset, d3.event.target.id, date)} talks`);
            var thing = dataset[d3.event.target.id][date]["links"]
            var txt = ""
            thing.forEach(function(bit) {
                txt += bit + "\n"
            });

            console.log(txt)
            window.alert(txt);

        })
        .on("mousemove", function(date) {
            tooltip
                .transition()
                .duration(50)
                .style('opacity', 0.9);

            tooltip
                .html(date + "<br/>" + getTalks(dataset, d3.event.target.id, date) + " talks")
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 40) + "px");
        })
        .on("mouseout", function() {
            tooltip
                .transition()
                .duration(500)
                .style('opacity', 0);
        });

    cal.selectAll(".month")
        .data(function(data) {
            return d3.timeMonths(new Date(data, 0, 1), new Date(data + 1, 0, 1));
        })
        .enter()
        .append("path")
        .attr("class", "month")
        .attr("d", function(data) {
            return monthPath(data, cellSize);
        });
};

function getTalks(dataset, tag, date) {
    var talks = dataset[tag][date];

    if (talks == undefined) {
        return 0;
    }
    return talks["talks"];
};

function monthPath(t0, cellSize) {
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


function updateCalendar(dataset, newTag, firstYear, lastYear, calWidth, colourInterpolator) {

    var transDuration = 500;
    var format = d3.timeFormat("%Y-%m-%d");

    var g = d3.select("#gCalendar").transition();

    g.select(".title")
        .duration(transDuration)
        .text(`Calendar title {${newTag}}`);

    var talkAmounts = [];
    Object.values(dataset[newTag]).forEach(function(talk){
        talkAmounts.push(talk["talks"]);
    });

    var legendMaxValue = d3.max(talkAmounts);

    var colourScale = d3.scaleSequential()
        .domain([legendMaxValue, 0])
        .interpolator(colourInterpolator);

        var pickColour = function(data) {
            if (data == undefined || data == 0) {
                return "#ffffff";
            };
            if (typeof(data) == "number") {
                return colourScale(data);
            };
            return colourScale(data["talks"]);
        };

    var rect = g.selectAll(".day")
        .duration(transDuration)
        .attr("id", `${newTag}`)
        .attr("fill", function(date) {
            return pickColour(dataset[newTag][date]);
        });

    var padding = {
        top  : 120,
        left  : 60,
        right : 20,
        bottom: 10
    };

    var legendWidth = calWidth,
        legendHeight = padding.top,
        legendPadding = {
            top   : padding.top / 1.5,
            right : padding.right + 5,
            bottom: 25,
            left  : padding.left + 5
        };

    var gradientWidth = legendWidth - legendPadding.right - legendPadding.left;
    var gradientHeight = legendHeight - legendPadding.top - legendPadding.bottom;

    // Scaling function for x values
    var legendScale = d3.scaleLinear()
        .range([0, gradientWidth - 1])
        .domain([0, legendMaxValue]);

    // Draw x-axis
    g.select("#legendAxis")
        .duration(transDuration)
        .call(d3.axisBottom(legendScale)
            .ticks(legendMaxValue)
        )
};
