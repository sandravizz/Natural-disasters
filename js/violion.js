// --------------------------------------
//  Margin and canvas
// --------------------------------------

const margin0 = {top: 60, right: 0, bottom: 0, left:10};
const width0 = 1000;
const height0 = 250;
const innerwidth0 = width0 - margin0.left - margin0.right;
const innerheight0 = height0 - margin0.top - margin0.bottom;

const svg0 = d3.select("#chart0")
  .append("svg")
    .attr("viewBox", `0, 0, ${width0}, ${height0}`);

const innerChart0 = svg0
  .append("g")
    .attr("transform", `translate(${margin0.left}, ${margin0.top})`);

// --------------------------------------
//  Data loading
// --------------------------------------

const disaster = [
  {id: "Tropical Cyclone", count: 62},
  {id: "Severe Storm", count: 186},
  {id: "Drought", count: 31},
  {id: "Flooding", count: 44},
  {id: "Wildfire", count: 22},
  {id: "Winter Storm", count: 22}
];

console.log(disaster);

const data0 = d3.csv("./data/violin.csv", d3.autoType) 
  .then(function(data0){ 

    disaster.forEach(disaster => {

      disaster["costs"] = data0
        .filter(d => d.disaster === disaster.id)
        .map(d => d.costs);

      disaster["bins"] = d3.bin()(disaster.costs);
      console.log(disaster.bins);
  
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

    const x = d3.scalePoint()
        .domain(["Tropical Cyclone", "Severe Storm", "Drought", "Flooding", "Wildfire", "Winter Storm"])
        .range([0, innerwidth0])
        .padding(0.4);

    const y = d3.scaleLinear()
        .domain([0, 170000])
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
          .curve(d3.curveCatmullRom.alpha(0.3));

        disasterContainer
          .append("path")
            .attr("d", areaGenerator(disaster.bins))
            .attr("fill", (d) => color(disaster.id));

      });

// --------------------------------------
//  Lables 
// --------------------------------------
 
    innerChart0
        .append("g")
        .attr("class", "text")
        .selectAll("text")
        .data(disaster)
        .join("text")
        .text((d) => (d.count) + " " +  (d.id)+ "s" )
        .attr("x", (d, i) => 10 + i * 173)
        .attr("y", -10)
        .attr("fill", (d) => color(d.id));

});