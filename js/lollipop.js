// --------------------------------------
//  Margin and canvas
// --------------------------------------

const margin3 = {top: 65, right: 50, bottom: 40, left:15};
const width3 = 1000;
const height3 = 600;
const innerwidth3 = width3 - margin3.left - margin3.right;
const innerheight3 = height3 - margin3.top - margin3.bottom;

const svg3 = d3.select("#chart3")
  .append("svg")
    .attr("viewBox", `0, 0, ${width3}, ${height3}`);

const innerChart3 = svg3
  .append("g")
    .attr("transform", `translate(${margin3.left}, ${margin3.top})`);

// --------------------------------------
//  Data loading
// --------------------------------------

const data3 = d3.csv("./data/tropical.csv", d3.autoType) 
  .then(function(data3){ 

    // console.log(data3);

// --------------------------------------
// Tooltip
// --------------------------------------

const tooltip = d3.tip()
    .attr("class", "tooltip")
    .html(
      (event, d) => `<div>${(d.Name)}<br>Year ${(d.Year)}</br>Death ${(d.Deaths)}<br>Damage ${format(d.Costs)}</br></div>`
    );

svg3.call(tooltip); 

// --------------------------------------
//  Scales
// --------------------------------------

let x = d3.scaleLinear()
    .domain(d3.extent(data3, d => d.Year))
    .range([0, innerwidth3]);

let y = d3.scaleLinear()
    .domain(d3.extent(data3, d => d.Costs))
    .range([innerheight3, 0]);

let r2 = d3.scaleSqrt()
    .domain(d3.extent(data3, d => d.Deaths))
    .range([0, 30]);

let r1 = d3.scaleSqrt()
    .domain(d3.extent(data3, d => d.Costs))
    .range([0, 47]);

let c = d3.scaleOrdinal()
    .domain(["True", "False"])
    .range(["#ccff99", "#ccff99"]);

// --------------------------------------
//  Axes 
// --------------------------------------

innerChart3.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${innerheight3})`)
    .call(d3.axisBottom(x)
        	.tickValues([1980, 1992, 2005, 2012, 2017, 2020, 2022]) 
     		.tickSize(10)
            .tickPadding(5));

// --------------------------------------
//  Data drawing 
// --------------------------------------

//Lines
innerChart3
    .append("g")
    .selectAll("line")
    .data(data3)
    .join("line")
    .attr("x1", (d) => x(d.Year))
    .attr("x2", (d) => x(d.Year))
    .attr("y1", innerheight3)
    .attr("y2", (d) => y(d.Costs) + r1(d.Costs))
    .attr("stroke", (d) => c(d.Hurricane))
    .attr("stroke-width", 0.4)
    .attr("opacity", 0.7); 

//Circle costs
innerChart3
    .append("g")
    .selectAll(".cost_circle")
    .data(data3)
    .join("circle")
    .attr("class", "cost_circle")   
    .attr("cx", (d) => x(d.Year))
    .attr("cy", (d) => y(d.Costs))
    .attr("r", (d) => r1(d.Costs))
    .attr("fill", (d) => c(d.Hurricane))
    .attr("fill-opacity", (d) => (d.Hurricane === true ? 0.87 : 0.87))
    .attr("stroke", (d) => c(d.Hurricane))
    .attr("stroke-opacity", 1)
    .attr("stroke-width", 0.2)
    .on("mouseover", tooltip.show)
    .on("mouseout", tooltip.hide); 

//Circle death
innerChart3
    .append("g")
    .selectAll(".death_circle")
    .data(data3)
    .join("circle")
    .attr("class", "death_circle")   
    .attr("cx", (d) => x(d.Year))
    .attr("cy", (d) => y(d.Costs))
    .attr("r", (d) => r2(d.Deaths))
    .attr("fill", "#ff00c4")
    .attr("fill-opacity", 0.7)
    .on("mouseover", tooltip.show)
    .on("mouseout", tooltip.hide); 

//Text 
innerChart3
    .append("g")
    .selectAll("text")
    .data(data3)
    .join("text")
    .filter(d => d.Costs > 80000)
    .attr("x", (d) => x(d.Year))
    .attr("y", (d) => y(d.Costs) - d3.max([r1(d.Costs),r2(d.Deaths)])-6)
    .attr("class", "super_hurricane")
    .text(d => d.Name)
    .attr("text-anchor", "middle")
    .on("mouseover", tooltip.show)
    .on("mouseout", tooltip.hide);

// --------------------------------------
//  Buttons 
// --------------------------------------

    const filters = [
    { id: "hurricane", label: "Hurricane", isActive: false,  color: "#ccff99" },
    { id: "tropical_storm", label: "Tropical storm", isActive: false, color: "#ccff99" }, 
    { id: "deaths", label: "Deaths", isActive: false, color: "#ff00c4" },
    { id: "reset", label: "Reset", isActive: false, color: "lightgrey" }
    ];

    d3.select("#filters")
        .selectAll(".filter")
        .data(filters)
        .join("button")
        .attr("class", "content__nav-button content__nav-button--prev")
        .attr("id", d => d.id)
        .text(d => d.label)
        .style("color", d => d.color);

//When clicking on the deaths button

    d3.select("#deaths")
        .on("click", (e, d) => {

        d3.selectAll(".death_circle")
            .transition()
            .duration(1000)
            .attr("fill-opacity", 0.7);
        
        d3.selectAll(".cost_circle")
            .data(data3)
            .transition()
            .duration(1000)
            .attr("fill-opacity", (d) => (d.Hurricane === true ? 0 : 0)); 
       
    });

//When clicking on the tropical_storm button

    d3.select("#tropical_storm")
        .on("click", (e, d) => {

        d3.selectAll(".death_circle")
            .transition()
            .duration(1000)
            .attr("fill-opacity", 0);

        d3.selectAll(".cost_circle")
            .data(data3)
            .transition()
            .duration(1000)
            .attr("fill-opacity", (d) => (d.Hurricane === true ? 0 : 1)); 

    });

//When clicking on the hurricane button

    d3.select("#hurricane")
        .on("click", (e, d) => {

    d3.selectAll(".death_circle")
        .transition()
        .duration(1000)
        .attr("fill-opacity", 0);

    d3.selectAll(".cost_circle")
        .data(data3)
        .transition()
        .duration(1000)
        .attr("fill-opacity", (d) => (d.Hurricane === true ? 1 : 0)); 

});

//When clicking on the reset button

    d3.select("#reset")
        .on("click", (e, d) => {

        d3.selectAll(".death_circle")
            .transition()
            .duration(1000)
            .attr("fill-opacity", 0.7);

        d3.selectAll(".cost_circle")
            .data(data3)
            .transition()
            .duration(1000)
            .attr("fill-opacity", (d) => (d.Hurricane === true ? 0.7 : 0.7)); 

});

});