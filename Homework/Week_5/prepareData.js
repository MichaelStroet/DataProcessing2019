// Name: Michael Stroet
// Student number: 11293284

function prepareData(tourism, ppp, gdp, dataYears, dataList) {

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

    var datasets = {};

    dataYears.forEach(function(year) {
        datasets[year] = [];
        dataCountries.forEach(function(country) {
            datasets[year].push([dataList[0], dataList[1], dataList[2], country]);
        })
    });

    addDataToDict(tourism, tourismCountries, dataList.indexOf("tourism"));
    addDataToDict(ppp, pppCountries, dataList.indexOf("ppp"));
    addDataToDict(gdp, gdpCountries, dataList.indexOf("gdp"));

    dataYears.forEach(function(year) {
        for (var i = datasets[year].length - 1; i >= 0; --i) {
            var country = datasets[year][i];
            if (typeof(country[0]) == "string" || typeof(country[1]) == "string" || typeof(country[2]) == "string") {
                datasets[year].splice(i, 1);
            }
        }
    });

    return datasets;
};


// https://codereview.stackexchange.com/questions/96096/find-common-elements-in-a-list-of-arrays
function CommonCountries(countryArrays) {
    /*
     * Determines the common countries in each datasets and returns them in an array
     */

    var currentValues = {};
    var commonValues = {};

    // Initialise the currentValues object with the first array of countries
    for (var i = 0; i < countryArrays[0].length; i++) {
        currentValues[countryArrays[0][i]] = "";
    };

    // Check each other array for common countries, adding them to a seperate object
    for (var i = 1; i < countryArrays.length; i++) {
        var currentArray = countryArrays[i];

        for (var j = 0; j < currentArray.length; j++) {
            if (currentArray[j] in currentValues){
                commonValues[currentArray[j]] = "";
            }
        }
        currentValues = commonValues;
        commonValues = {};
    }

    // Return the common countries in an array
    return Object.keys(currentValues);
};
