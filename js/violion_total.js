// --------------------------------------
//  Margin and canvas
// --------------------------------------

const margin00 = {top: 0, right: 0, bottom: 0, left:0};
const width00 = 1000;
const height00 = 350;
const innerwidth00 = width00 - margin00.left - margin00.right;
const innerheight00 = height00 - margin00.top - margin00.bottom;

const svg00 = d3.select("#chart00")
  .append("svg")
    .attr("viewBox", `0, 0, ${width00}, ${height00}`);

const innerChart00 = svg00
  .append("g")
    .attr("transform", `translate(${margin00.left}, ${margin00.top})`);

// --------------------------------------
//  Data loading
// --------------------------------------

const data0 = d3.csv("./data/violin.csv", d3.autoType) 
  .then(function(data0){ 

    costs = data0.map(d => d.costs);
    console.log(costs);

    var bins = d3.bin()(costs);
    console.log(bins);

// --------------------------------------
//  Formating 
// --------------------------------------

    format = d3.format(".02s");

// --------------------------------------
//  Scales
// -------------------------------------- 

    const y = d3.scaleLinear()
        .domain([0, d3.max(data0, d => d.costs)])
        .range([0, innerheight00]);

   const violinsScale = d3.scaleLinear()
            .domain([0, d3.max(bins, d => d.length)])
            .range([0, innerwidth00/2]);

// --------------------------------------
//  Data drawing
// --------------------------------------

    const Container = innerChart00
          .append("g");

        const areaGenerator = d3.area()
          .x0((d => 500 - violinsScale(d.length)))
          .x1(d => 500 + violinsScale(d.length))
          .y(d => y(d.x1) + ((y(d.x0) - y(d.x1))))
          .curve(d3.curveCatmullRom);

    Container
          .append("path")
            .attr("d", areaGenerator(bins))
            .attr("fill", "white");

// --------------------------------------
//  Lables 
// --------------------------------------

    // Counts: text 
    innerChart00
        .append("text")
        .text("364 disasters")
        .attr("x", innerwidth00/2)
        .attr("y", 0)
        .attr("fill", "white");

// --------------------------------------
//  Axes
// --------------------------------------

    innerChart00
      .append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(0, 0)`)
        .call(d3.axisRight(y)
        .tickSize(innerwidth00/2)
        .tickFormat(format)
        .tickPadding(5)
        .tickValues([20000, 70000, 120000, 180000 ]));

});