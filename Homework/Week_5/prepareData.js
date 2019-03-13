// Name: Michael Stroet
// Student number: 11293284

function prepareData(tourism, ppp, gdp, yearsList, dataList) {

    //
    var addDataToDict = function(dataset, datasetCountries, dataIndex) {

        // Itterate over each country common across all datasets
        for (var i = 0; i < datasetCountries.length; i++) {
            var countryName = (datasetCountries[i]);
            if (dataCountries.includes(countryName)) {
                var countryData = dataset[countryName];
                var countryIndex = dataCountries.indexOf(countryName);

                // Isolate each year and corresponding datapoint and add them to the datasets object
                for (var j = 0; j < countryData.length; j++) {
                    var year = countryData[j].Time;
                    if (year == undefined) {
                        year = countryData[j].Year
                    };
                    var data = countryData[j].Datapoint;

                    if (yearsList.includes(year)) {
                        datasets[year][countryIndex][dataIndex] = data
                    };
                };
            };
        };
    };

    // Get the countries in each dataset as a list
    var tourismCountries = Object.keys(tourism);
    var pppCountries = Object.keys(ppp);
    var gdpCountries = Object.keys(gdp);

    // Find all countries shared between all datasets and save them as an array
    var dataCountries = commonCountries([tourismCountries, pppCountries, gdpCountries]);

    // Define an empty object
    var datasets = {};

    // Add each year to the object as an array of arrays with data per country
    yearsList.forEach(function(year) {
        datasets[year] = [];
        dataCountries.forEach(function(country) {
            datasets[year].push([dataList[0], dataList[1], dataList[2], country]);
        });
    });

    // Add all data to the datasets object
    addDataToDict(tourism, tourismCountries, dataList.indexOf("tourism"));
    addDataToDict(ppp, pppCountries, dataList.indexOf("ppp"));
    addDataToDict(gdp, gdpCountries, dataList.indexOf("gdp"));

    // Remove all arrays with missing data from the datasets
    yearsList.forEach(function(year) {
        for (var i = datasets[year].length - 1; i >= 0; --i) {
            var country = datasets[year][i];
            if (typeof(country[0]) == "string" || typeof(country[1]) == "string" || typeof(country[2]) == "string") {
                datasets[year].splice(i, 1);
            };
        };
    });

    // return the finished object
    return datasets;
};

function commonCountries(countryArrays) {
    /*
     * Determines the common countries in each datasets and returns them in an array
     */

    var currentCountries = {};
    var commonCountries = {};

    // Initialise the currentCountries object with the first array of countries
    for (var i = 0; i < countryArrays[0].length; i++) {
        currentCountries[countryArrays[0][i]] = "";
    };

    // Check each other array for common countries, adding them to a seperate object
    for (var i = 1; i < countryArrays.length; i++) {
        var currentArray = countryArrays[i];

        for (var j = 0; j < currentArray.length; j++) {
            if (currentArray[j] in currentCountries){
                commonCountries[currentArray[j]] = "";
            };
        };
        currentCountries = commonCountries;
        commonCountries = {};
    };

    // Return the common countries in an array
    return Object.keys(currentCountries);
};
