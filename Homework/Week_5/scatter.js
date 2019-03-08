// Name: Michael Stroet
// Student number: 11293284

/*
 * Main function
 */

window.onload = function() {

    // Call OECD API for three datasets
    const tourismInbound = "https://stats.oecd.org/SDMX-JSON/data/TOURISM_INBOUND/AUS+AUT+BEL+BEL-BRU+BEL-VLG+BEL-WAL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+EGY+MKD+IND+IDN+MLT+MAR+PER+PHL+ROU+RUS+ZAF.INB_ARRIVALS_TOTAL/all?startTime=2009&endTime=2017";
    const purchasingPowerParities = "https://stats.oecd.org/SDMX-JSON/data/PPPGDP/PPP.AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EA18+OECD/all?startTime=2009&endTime=2017&dimensionAtObservation=allDimensions";
    const grossDomesticProduct = "https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EA19+EU28+OECD+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+ROU+RUS+SAU+ZAF.B1_GA.C/all?startTime=2009&endTime=2017&dimensionAtObservation=allDimensions";

    // Convert the recieved responses to json strings
    var requests = [d3.json(tourismInbound), d3.json(purchasingPowerParities), d3.json(grossDomesticProduct)];

    // transform the responses into useful data objects
    Promise.all(requests).then(function(response) {
        let tourism = transformResponseTourism(response[0]);
        let ppp = transformResponsePPP(response[1]);
        let gdp = transformResponseGDP(response[2]);

        // Draw a scatterplot with the recieved data
        scatterPlot([tourism, ppp, gdp])

        // Catch errors
        }).catch(function(e){
        throw(e);
    });

};


/*
 * Draws an interactive scatterplot
 */

function scatterPlot(datasets) {
    console.log(datasets);
};
