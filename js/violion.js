// --------------------------------------
//  Margin and canvas
// --------------------------------------

const margin0 = {top: 60, right: 60, bottom: 20, left:60};
const width0 = 1000;
const height0 = 180;
const innerwidth0 = width0 - margin0.left - margin0.right;
const innerheight0 = height0 - margin0.top - margin0.bottom;
//console.log(innerheight0);

// Append the SVG container
const svg0 = d3.select("#chart0")
  .append("svg")
    .attr("viewBox", `0, 0, ${width0}, ${height0}`);

// Append the group for the inner chart
const innerChart0 = svg0
  .append("g")
    .attr("transform", `translate(${margin0.left}, ${margin0.top})`);

// --------------------------------------
//  Data loading
// --------------------------------------

const disaster = [
  {id: "Flooding" },
  {id: "Drought" },
  {id: "Wildfire" },
  {id: "Winter Storm" },
  {id: "Tropical Cyclone" },
  {id: "Severe Storm" },
];

const data0 = d3.csv("./data/violin.csv", d3.autoType) 
  .then(function(data0){ 

    disaster.forEach(disaster => {

      disaster["costs"] = data0
        .filter(d => d.disaster === disaster.id)
        .map(d => d.costs);

      disaster["bins"] = d3.bin()(disaster.costs);
      //console.log(disaster.bins);
  
    });

    disaster.sort((a, b) => a.mean - b.mean);

// --------------------------------------
//  Formating 
// --------------------------------------

format = d3.format(".01s");

// --------------------------------------
//  Scales
// --------------------------------------

let color = d3.scaleOrdinal()
    .domain(["Tropical Cyclone", "Drought", "Wildfire", "Flooding", "Winter Storm", "Severe Storm"])
    .range(["#ccff99", "#cccc99", "#B0CCA3", "#99FFD7", "#99FFB4", "#A8A87E"]);  

// const x = d3.scalePoint()
//     .domain(["Tropical Cyclone (TC)", "Severe Storm (Storm)", "Drought", "Flooding", "Wildfire", "Winter Storm (Winter)"])
//     .range([0, innerwidth0])
//     .padding(0.4);

const x = d3.scalePoint()
    .domain(["Tropical Cyclone", "Severe Storm", "Drought", "Flooding", "Wildfire", "Winter Storm"])
    .range([0, innerwidth0])
    .padding(0.4);

const y = d3.scaleLinear()
    .domain([0, 85000])
    //.domain([0, d3.max(data0, d => d.costs)])
    .range([0, innerheight0]);

let maxBinLength = 0;

disaster.forEach(disaster => {
    const max = d3.max(disaster.bins, d => d.length);
    if (max > maxBinLength) {maxBinLength = max;}
  });

const violinsScale = d3.scaleLinear()
        .domain([0, maxBinLength])
        .range([0, x.step()/2]);

// --------------------------------------
//  Data drawing
// --------------------------------------

disaster.forEach(disaster => {

    const disasterContainer = innerChart0
      .append("g");

    const areaGenerator = d3.area()
      .x0(d => x(disaster.id) - violinsScale(d.length))
      .x1(d => x(disaster.id) + violinsScale(d.length))
      .y(d => y(d.x1) + ((y(d.x0) - y(d.x1))))
      .curve(d3.curveCatmullRom);

    disasterContainer
      .append("path")
        .attr("d", areaGenerator(disaster.bins))
        .attr("fill", (d) => color(disaster.id));

  });

// --------------------------------------
//  Axes
// --------------------------------------

  innerChart0
    .append("g")
      .attr("class", "x-axis-violin")
      .attr("transform", `translate(0, 0)`)
      .call( d3.axisTop(x)
              .tickPadding(10)
              .tickSizeOuter(20));

  innerChart0
    .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(0, 0)`)
      .call(d3.axisLeft(y)
      .tickSize(-innerwidth0)
      .tickFormat(format)
      .tickPadding(5)
      .tickValues([5000, 50000, 80000]));

});