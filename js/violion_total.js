// --------------------------------------
//  Margin and canvas
// --------------------------------------

const margin00 = {top: 18, right: 0, bottom: 0, left:0};
const width00 = 1000;
const height00 = 320;
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

const data00 = d3.csv("./data/violin.csv", d3.autoType) 
  .then(function(data00){ 

    costs = data00.map(d => d.costs);
    console.log(costs);

    var bins = d3.bin()(costs);
    console.log(bins);

// --------------------------------------
//  Scales
// -------------------------------------- 

    const y = d3.scaleLinear()
        .domain([0, d3.max(data00, d => d.costs)])
        .range([0, innerheight00]);

        console.log(d3.max(data00, d => d.costs));

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
          .curve(d3.curveCatmullRom.alpha(0.3));

    console.log(areaGenerator(bins)) //Its just one long path

    Container
          .append("path")
            .attr("d", areaGenerator(bins))
            .attr("fill", "white");

// --------------------------------------
//  Lables 
// --------------------------------------

    innerChart00
        .append("text")
        .attr("class", "text")
        .text("367 natural disasters")
        .attr("x", innerwidth00/2 - 70)
        .attr("y", -9)
        .attr("fill", "white");

// --------------------------------------
//  Description text 
// --------------------------------------

innerChart00
    .append("text")
    .attr("x", 0)
    .attr("y", 50)
    .attr("class", "text")
    .text("Long tail distribution")
    .append("tspan")
    .attr("class", "tspan")
    .attr("x", 0)
    .attr("y", 70)
    .text("Long tail is the name for a long-known feature of some statistical distributions.")
    .append("tspan")
    .attr("x", 0)
    .attr("y", 85)
    .text("A high-amplitude is followed by a low-amplitude population.")
    .append("tspan")
    .attr("x", 0)
    .attr("y", 100)
    .text("Events at the far end of the tail have a very low probability of occurrence.");

// --------------------------------------
//  Axes
// --------------------------------------

    innerChart00
      .append("g")
      .attr("class", "y-violin")
        .attr("transform", `translate(0, 0)`)
        .call(d3.axisRight(y)
        .tickSize(innerwidth00/2)
        .tickFormat(d3.format(".02s"))
        .tickPadding(9)
        .tickValues([28000, 60000, 100000, 140000, 180000 ]))
        .call(g => g.append("text")
        .attr("x", innerwidth00/2 +35)
        .attr("y", y(180000) +3.5)
        .attr("fill", "white")
        .text(" = 180.000.000.000.000 $"));

});