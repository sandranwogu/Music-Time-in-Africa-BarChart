

var data = []; // Global Variable
yearField = ["1966", "1967", "1968", "1969", "1970", "1971", "1972", "1972", "1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003"];

$(document).ready(function () {
    loadData();
});

var countryDict = {};
function loadData() {
    d3.csv("data/countryCounter.csv",
    function (d) {
        data = d;

        data.forEach(function(d){
            var country = d.country;
            countryDict[country] = [];
            yearField.forEach(function(field){
                countryDict[country].push(+d[field]);
            });
        })
        // console.log(data);
        console.log(countryDict);
        visualizeBarChart1(countryDict);
        visualizeBarChart2(countryDict);
        // FIRST load the data, then run the function.
    });
}

function visualizeBarChart1(countryDict) {

    //Define Vis Dimensions
    var margin = { top: 20, right: 20, bottom: 30, left: 60 }, width = 940 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    // Make X scale/width
    var xScale = d3.scaleBand()
        .domain(yearField)
        .range([0, width])
        .padding(0.1);

    // Make Y scale/height updatable on selection
    var yScale = d3.scaleLinear()
        .range([height, 0]);
        // domain define when bar updates

    // Create the vis canvas
    var svg = d3.select("#chart1").append("svg")
        // .attr("width", width + margin.left + margin.right)
        // .attr("height", height + margin.top + margin.bottom)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 940 500")
        .classed("twelve columns question alpha", true)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Make x-axis and add it to the canvas
    var xAxis = d3.axisBottom(xScale);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-30)");

    //Make y-axis and add it to the canvas
    var yAxis = d3.axisLeft(yScale);

    // Make UPDATABLE Y-AXIS
    var yAxisHandleForUpdate = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    yAxisHandleForUpdate.append("text")
        .attr("transform", "rotate(-90)")
        // continuous.nice([count])
        // .tickFormat(count, d3.format(",f"))
        .attr("y", 6)
        .attr("dy", ".85em")
        .attr("fill", "#000") // Text Color
        .style("text-anchor", "end")
        .text("TOTAL MENTIONS");

    // ------ START UPDATING BARS [w/in overall function]-----
    var updateBars = function(data){

        if (initialData === undefined) {
            return;
            // if the initialData does not have any values loaded into it, don't run this funciton
        }
        console.log('This is the updateBars() for chart1: ' + data);
            // This is grabbing the value for the initialData() at the bottom. If they match upon changing the country, that is good.

        // Update Y-AXIS 1st
        // Only the SELECTED country should be in the yScale variable

        yScale.domain([0, d3.max(data)]).nice();
            // This will update the y-axis when each country is selected

        yAxisHandleForUpdate.call(yAxis);

        // Create the BARS
        var bars = svg.selectAll(".bar").data(data);
        // console.log(bars);

        // Add the BARS for NEW data
            bars
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("fill", "#E0D22E")
                .attr("x", function(d,i) {return xScale(yearField[i] ); })
                .attr("width", xScale.bandwidth())
                .attr("y", function(d,i) {return yScale(d); })
                .attr("height", function(d,i) { return height - yScale(d); });
            // console.log(bars);

            // UPDATE old bars, but KEEP x/width from above
            bars
                .transition().duration(400)
                    // microseconds
                .attr("y", function(d,i) { return yScale(d); })
                .attr("height", function(d,i) { return height - yScale(d); });
            // console.log(bars);

            bars // Remove old bars to prep for the change
                .exit()
                .remove();
    }; // ----- END UPDATE BARS -----

// ----- DROP DOWN VALUE CHANGE HANDLER -----
var dropDownChange = function(){
    var newCountry = d3.select(this).property('value');
    var newData = countryDict[newCountry];
        console.log('This is newData for chart1: ' + newData);
    updateBars(newData);
}; // ----- END DROP DOWN VALUE CHANGE HANDLER -----

// ----- Get Country Names for DROP DOWN -----

var countries = Object.keys(countryDict);
    // USED TO POPULATE THE DROP DOWN LIST
    // console.log(countries);

// ----- Adding the DROP DOWN to the Page------
var dropdown = d3.select("#chart1")
    // Here is adding the drop down
    .insert("select", "svg")
        // And inserting it into the canvas
    .classed("twelve columns question alpha", true)
        // This is positioning the drop down in the SVG
    .on("change", dropDownChange);
        // HERE IS WHERE THE CHANGE OCCURS

    dropdown.selectAll("option")
        .data(countries)
        .enter()
        .append("option")
        .attr("value", function(d) {return d; })
        .text(function(d){ return d.toUpperCase(); });

    var initialData = countryDict['Algeria'];
    console.log('This is the initialData for chart1: ' + initialData);
        // What is being updated
    updateBars(initialData);
};

function visualizeBarChart2(countryDict) {

    var margin = { top: 20, right: 20, bottom: 30, left: 60 }, width = 940 - margin.left - margin.right, height = 500 - margin.top - margin.bottom;

    var xScale = d3.scaleBand()
        .domain(yearField)
        .range([0, width])
        .padding(0.1);

    var yScale = d3.scaleLinear()
        .range([height, 0]);

    var svg = d3.select("#chart2").append("svg")
        // .attr("width", width + margin.left + margin.right)
        // .attr("height", height + margin.top + margin.bottom)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 940 500")
        .classed("twelve columns question alpha", true)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xAxis = d3.axisBottom(xScale);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-30)");

    var yAxis = d3.axisLeft(yScale);

    var yAxisHandleForUpdate = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    yAxisHandleForUpdate.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".85em")
        .attr("fill", "#000")
        .style("text-anchor", "end")
        .text("TOTAL MENTIONS");

    // ------ START UPDATING BARS [w/in overall function]-----
    var updateBars = function(data){
        if (initialData === undefined) {
            return;
        }
        console.log('This is the updateBars() for chart2: ' + data);
            // This is grabbing the value for the initialData() at the bottom. If they match upon changing the country, that is good.

        yScale.domain([0, d3.max(data)]).nice();

        yAxisHandleForUpdate.call(yAxis);

        var bars = svg.selectAll(".bar").data(data);
        // console.log(bars);

            bars
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("fill", "#3090C7")
                .attr("x", function(d,i) {return xScale(yearField[i] ); })
                .attr("width", xScale.bandwidth())
                .attr("y", function(d,i) {return yScale(d); })
                .attr("height", function(d,i) { return height - yScale(d); });

            bars
                .transition().duration(400)
                .attr("y", function(d,i) { return yScale(d); })
                .attr("height", function(d,i) { return height - yScale(d); });

            bars
                .exit()
                .remove();
    }; // ----- END UPDATE BARS -----

// ----- DROP DOWN VALUE CHANGE HANDLER -----
var dropDownChange = function(){
    var newCountry = d3.select(this).property('value');
    var newData = countryDict[newCountry];
        console.log('This is newData for chart2: ' + newData);
    updateBars(newData);
}; // ----- END DROP DOWN VALUE CHANGE HANDLER -----

// ----- Get Country Names for DROP DOWN -----
var countries = Object.keys(countryDict);
    // console.log(countries);

// ----- Adding the DROP DOWN to the Page------
var dropdown = d3.select("#chart2")
    .insert("select", "svg")
    .classed("twelve columns question alpha", true)
    .on("change", dropDownChange);

    dropdown.selectAll("option")
        .data(countries.splice(1))
        .enter()
        .append("option")
        .attr("value", function(d) {return d; })
        .text(function(d){ return d.toUpperCase(); })
        .style('text-anchor','middle');

    var initialData = countryDict['Angola'];
    console.log('This is the initialData for chart2: ' + initialData);
    updateBars(initialData);
};
