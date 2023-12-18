// --------------------------------------
//  Margin and canvas
// --------------------------------------

const margin3 = {top: 60, right: 35, bottom: 50, left: 30};
const width3 = 1000;
const height3 = 600;
const innerwidth3 = width3 - margin3.left - margin3.right;
const innerheight3 = height3 - margin3.top - margin3.bottom;

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

format = d3.format(".03s");

// --------------------------------------
//  Scales
// --------------------------------------

let x = d3.scaleLinear()
    .domain(d3.extent(data3, d => d.Year))
    .range([0, innerwidth3]);

let y = d3.scaleLinear()
    .domain(d3.extent(data3, d => d.Costs))
    .range([innerheight3, 0]);

let r = d3.scaleSqrt()
    .domain(d3.extent(data3, d => d.Costs))
    .range([0, 45]);

let c = d3.scaleOrdinal()
    .domain(["True", "False"])
    .range(["#ccff99", "white"]);

// --------------------------------------
//  Axes 
// --------------------------------------

innerChart3.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${innerheight3})`)
    .call(d3.axisBottom(x)
        	   .tickValues([1980, 1983, 1989, 1995, 2000, 2005, 2010, 2015, 2020, 2022]) 
     		     .tickSize(10)
             .tickPadding(5));

// --------------------------------------
//  Data drawing 
// --------------------------------------

//Lines
innerChart3
    .selectAll("line")
    .data(data3)
    .join("line")
    .attr("x1", (d) => x(d.Year))
    .attr("x2", (d) => x(d.Year))
    .attr("y1", innerheight3)
    .attr("y2", (d) => y(d.Costs) + r(d.Costs))
    .attr("stroke", (d) => c(d.Hurricane))
    .attr("stroke-width", 0.5)
    .attr("opacity", 0.7); 



//Circle 
innerChart3
    .selectAll("circle")
    .data(data3)
    .join("circle")
    .attr("cx", (d) => x(d.Year))
    .attr("cy", (d) => y(d.Costs))
    .attr("r", (d) => r(d.Costs))
    .attr("fill", (d) => c(d.Hurricane))
    .attr("fill-opacity", 0.5)
    .attr("stroke", (d) => c(d.Hurricane))
    .attr("fill", (d) => c(d.Hurricane))
    .attr("stroke-opacity", 1)
    .attr("stroke-width", 0.2); 

//Text 
innerChart3
    .selectAll("text")
    .data(data3)
    .join("text")
    .filter(d => d.Costs > 60000)
    .attr("x", (d) => x(d.Year))
    .attr("y", (d) => y(d.Costs))
    .attr("class", "super_hurricane")
    .text("🔥🔥🔥")
    .attr("fill", "red")
    .attr("text-anchor", "middle");

});