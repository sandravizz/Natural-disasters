// --------------------------------------
//  Margin and canvas
// --------------------------------------

const margin3 = {top: 55, right: 15, bottom: 30, left:15};
const width3 = 1000;
const height3 = 450;
const innerwidth3 = width3 - margin3.left - margin3.right;
const innerheight3 = height3 - margin3.top - margin3.bottom;

const svg3 = d3.select("#chart3")
  .append("svg")
    .attr("viewBox", `0, 0, ${width3}, ${height3}`);

const innerChart3 = svg3
  .append("g")
    .attr("transform", `translate(${margin3.left}, ${margin3.top})`);

// --------------------------------------
//  Formating 
// --------------------------------------

parseDate = d3.timeParse("%Y");
formatDate = d3.timeFormat("%Y");
format = d3.format(".03s");

// --------------------------------------
//  Data loading
// --------------------------------------

const data3 = d3.csv("./data/tropical.csv", d => {

    return {
        Costs: +d.Costs,
        Deaths: +d.Deaths,
        Name: d.Name,
        Disaster: d.Disaster,
        Year: parseDate(d.Year)
    };

  }).then(data3 => {

// console.log(data3);

// --------------------------------------
// Tooltip
// --------------------------------------

const tooltip = d3.tip()
    .attr("class", "tooltip")
    .html(
      (event, d) => `<div>${(d.Name)}<br>Year ${formatDate(d.Year)}</br>Death ${(d.Deaths)}<br>Damage ${format(d.Costs)}</br></div>`
    );

svg3.call(tooltip); 

// --------------------------------------
//  Scales
// --------------------------------------

let x = d3.scaleTime()
    .domain(d3.extent(data3, d => d.Year))
    .range([0, innerwidth3]);

let y = d3.scaleLinear()
    .domain(d3.extent(data3, d => d.Costs))
    .range([innerheight3, 0]);

let r2 = d3.scaleSqrt()
    .domain(d3.extent(data3, d => d.Deaths))
    .range([0, 23]);

let r1 = d3.scaleSqrt()
    .domain(d3.extent(data3, d => d.Costs))
    .range([0, 34]);

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
        	.tickValues([parseDate(1980), parseDate(2023)]) 
            .tickFormat(formatDate)
     		.tickSize(10)
            .tickPadding(5));

    d3.select(".x-axis")
            .transition()
            .delay(9000)
            .duration(500)
            .call(d3.axisBottom(x)
            .tickValues([parseDate(1980), parseDate(1992), parseDate(2005), parseDate(2012), parseDate(2017), parseDate(2020), parseDate(2023)])
            .tickFormat(formatDate)
            .tickSize(10)
            .tickPadding(5));
         
// --------------------------------------
//  Data drawing check
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
    .attr("y2",  innerheight3)
    .attr("stroke", (d) => c(d.Hurricane))
    .attr("stroke-width", 0.7)
    .attr("opacity", 0.87)
    .transition()
    .delay((d, i) => 500+ x(d.Year) * 5)
    .duration(1000)
    .attr("y2", (d) => y(d.Costs) + r1(d.Costs));

//Circle costs
innerChart3
    .append("g")
    .selectAll(".cost_circle")
    .data(data3)
    .join("circle")
    .attr("class", "cost_circle")   
    .attr("cx", (d) => x(d.Year))
    .attr("cy", (d) => y(d.Costs))
    .attr("r", 0)
    .attr("fill", (d) => c(d.Hurricane))
    .attr("fill-opacity", (d) => (d.Hurricane === true ? 0.87 : 0.87))
    .attr("stroke", (d) => c(d.Hurricane))
    .attr("stroke-opacity", 1)
    .attr("stroke-width", 0.2)
    .on("mouseover", tooltip.show)
    .on("mouseout", tooltip.hide)
    .transition()
    .delay((d, i) => 500+ x(d.Year) * 5)
    .duration(1000)
    .attr("r", (d) => r1(d.Costs));

//Circle death
innerChart3
    .append("g")
    .selectAll(".death_circle")
    .data(data3)
    .join("circle")
    .attr("class", "death_circle")   
    .attr("cx", (d) => x(d.Year))
    .attr("cy", (d) => y(d.Costs))
    .attr("r", 0)
    .attr("fill", "#ff00c4")
    .attr("fill-opacity", 0.7)
    .on("mouseover", tooltip.show)
    .on("mouseout", tooltip.hide)
    .transition()
    .delay(7000)
    .duration(500)
    .attr("r", (d) => r2(d.Deaths)); 

//Text 
innerChart3
    .append("g")
    .selectAll("text")
    .data(data3)
    .join("text")
    .filter(d => d.Costs > 80000)
    .attr("x", (d) => x(d.Year) -2)
    .attr("y", (d) => y(d.Costs) - d3.max([r1(d.Costs),r2(d.Deaths)])-6)
    .attr("class", "super_hurricane")
    .attr("opacity", 0)
    .text(d => d.Name)
    .attr("text-anchor", "end")
    .on("mouseover", tooltip.show)
    .on("mouseout", tooltip.hide)
    .transition()
    .delay(8000)
    .duration(500)
    .attr("opacity", 1); 

// --------------------------------------
//  Description text 
// --------------------------------------

innerChart3
    .append("text")
    .attr("x", 430)
    .attr("y", 10)
    .attr("class", "anotations")
    .text("WTF 😱")
    .attr("opacity", 0) 
    .transition()
    .delay(12000)
    .duration(500)
    .attr("opacity", 1); 

// --------------------------------------
//  Buttons 
// --------------------------------------

    const filters = [
    { id: "damage", label: "Damage", isActive: false,  color: "#ccff99" },
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

//Click event: deaths

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

        d3.selectAll(".anotations")
            .transition()
           .duration(1000)
           .attr("opacity", 0);
                  
    });

//Click event: damage

    d3.select("#damage")
        .on("click", (e, d) => {

    d3.selectAll(".death_circle")
        .transition()
        .duration(1000)
        .attr("fill-opacity", 0);

    d3.selectAll(".cost_circle")
        .data(data3)
        .transition()
        .duration(1000)
        .attr("fill-opacity", (d) => (d.Hurricane === true ? 0.7 : 0.7)); 

    d3.selectAll(".anotations")
            .transition()
           .duration(1000)
           .attr("opacity", 0);

});

//Click event: reset

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
 
        d3.selectAll(".anotations")
            .transition()
           .duration(1000)
           .attr("opacity", 1);

});

});