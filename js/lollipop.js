// --------------------------------------
//  Margin and canvas
// --------------------------------------

const margin3 = {top: 0, right: 100, bottom: 10, left: 180};
const width3 = 1000;
const height3 = 250;
const innerwidth3 = width3 - margin3.left - margin3.right;
const innerheight3 = height3 - margin3.top - margin3.bottom;
console.log(innerheight3);


// Append the SVG container
const svg3 = d3.select("#chart3")
  .append("svg")
    .attr("viewBox", `0, 0, ${width3}, ${height3}`);

// Append the group for the inner chart
const innerChart3 = svg3
  .append("g")
    .attr("transform", `translate(${margin3.left}, ${margin3.top})`);

// --------------------------------------
//  Data loading
// --------------------------------------

const data3 = d3.csv("./data/tropical.csv", d3.autoType) 
  .then(function(data3){ 

    console.log(data3);

// --------------------------------------
//  Formating 
// --------------------------------------

format = d3.format(".03s")

// --------------------------------------
//  Scales
// --------------------------------------






let color = d3.scaleOrdinal()
    .domain(["Tropical Cyclone", "Drought", "Wildfire", "Flooding", "Winter Storm", "Severe Storm"])
    .range(["#ccff99", "#cccc99", "#B0CCA3", "#99FFD7", "#99FFB4", "#A8A87E"]);



// --------------------------------------
//  Data drawing 
// --------------------------------------

//Circle 
innerChart3
    .selectAll("circle")
    .data(data3)
    .join("circle")
    .attr("r", (d) => d.y1 - d.y0)
    .attr("cy", (d) => d.y0)
    .attr("cx", (d) => d.x0)
    .attr("fill", (d) => (d.x0 < innerwidth3 / 2 ? color(d.name) : "white"));

//Labels  
innerChart3
    .selectAll("text")
    .data(data3)
    .join("text")
    .text((d) => (d.name) + " | " + format(d.value))
    .attr("x", (d) => (d.x0 > innerwidth3 / 2 ? d.x1 + 10 : d.x0 - 10))
    .attr("y", (d) => (d.y1 + d.y0) / 2)
    .attr("fill", "white")
    .attr("dy", "0.4em")
    .attr("text-anchor", (d) => (d.x0 < innerwidth3 / 2 ? "end" : "start"));

});