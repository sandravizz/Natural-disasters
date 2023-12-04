// --------------------------------------
//  Margin and canvas
// --------------------------------------

const margin = { top: 50, right: 110, bottom: 20, left: 90 };

const width = 1400; 
const height = 600;
const innerwidth = 1400 - margin.left - margin.right; 
const innterheight = 600 - margin.top - margin.bottom;

let svg = d3.select("#graph")
              .append("svg")
              .attr("width", width)
              .attr("height", height)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// --------------------------------------
//  Data loading
// --------------------------------------

const data = d3.csv("./data/sankey_data.csv", d3.autoType)    
  .then(function(data){ 

    //Empty array
    let links = [];

    //Sorting data by decade so the time is in order
    data.sort((b, a) => a["Decade"] - b["Decade"]);

    //Pushing the data into the array, making it an object, changing variable names and add index i
    data.map((d, i) => {
      links.push({
        source: d["Disaster"], 
        target: d["Decade"],
        value: d["sum_costs"],
        id: i
      });
    });

    console.log(links);

    //Creating the array, which stores the nodes based on the information from the links array
    //Changing names to "name", "id"
    const nodes = Array.from(
      new Set(links.flatMap((d) => [d.source, d.target])),
      (name, id) => ({ name, id })
    );

    console.log(nodes);

    //We want to change the string names to ids in the links, that are inline with the nodes.
    links.map((d) => {
      d.source = nodes.find((e) => e.name === d.source).id;
      d.target = nodes.find((e) => e.name === d.target).id;
    });

    console.log(links);
    
    //Finally we create on object including the links and nodes array of objects
    let data_final = {nodes:nodes, links:links};

    console.log(data_final);

// --------------------------------------
//  Scales
// --------------------------------------

let color = d3.scaleOrdinal()
    .domain(["Tropical Cyclone", "Drought", "Wildfire", "Flooding", "Winter Storm", "Severe Storm"])
    .range(["#ccff99", "#cccc99", "#B0CCA3", "#99FFD7", "#99FFB4", "#A8A87E"]);

//for the Source Stack Bar chart
let y = d3.scaleBand()
   .domain(["Wildfire", "Drought", "Tropical Cyclone", "Severe Storm", "Flooding", "Winter Storm"])
   .rangeRound([innterheight, 0]);

// --------------------------------------
//  Sankey
// --------------------------------------
  
const sankey = d3.sankey()
  .nodeSort((a, b) => a.id - b.id)
  .nodeAlign(d3.sankeyLeft)
  .nodeId((d) => d.id)
  .linkSort(null)
  .nodeWidth(20)
  .nodePadding(30)
  .extent([
    [margin.left, margin.top],
    [innerwidth, innterheight]
  ]);

// Checking sankey applied to data
console.log((sankey(data_final)));

// --------------------------------------
//  Data drawing 
// --------------------------------------

//Nodes = rects
svg
.append("g")
.selectAll("rect")
.data((sankey(data_final)).nodes)
.join("rect")
.attr("width", (d) => d.y1 - d.y0)
.attr("x", (d) => (d.x0 < width / 2 ? d.x0 : d.x0))
.attr("fill", (d) => (d.x0 < width / 2 ? color(d.name) : "black"))
.attr("opacity", (d) => (d.x0 < width / 2 ? 1 : 0))
.attr("y", (d) => y(d.name))
.attr("height", y.bandwidth())
.on("mouseover", (e, d) => {
  d3.selectAll("path").style("opacity", (p) =>
    p.source.name === d.name || p.target.name === d.name ? "1" : "0.07"
  );
})
.on("mouseout", (e, d) => {
  d3.selectAll("path").style("opacity", 1);
})
.transition()
.delay(3000)
.duration(1500)
.attr("fill", (d) => (d.x0 < width / 2 ? color(d.name) : "white"))
.attr("height", (d) => d.y1 - d.y0)
.attr("opacity", (d) => (d.x0 < width / 2 ? 1 : 0))
.attr("width", (d) => (d.x0 < width / 2 ? d.x1 - d.x0 + 30 : 15))
.attr("y", (d) => d.y0)
.transition()
.delay(500)
.duration(1500)
.attr("opacity", (d) => (d.x0 < width / 2 ? 1 : 1));

//Links = path 
const link = svg
    .append("g")
    .attr("fill", "none")
    .selectAll("g")
    .data((sankey(data_final)).links)
    .join("g");

  link
    .append("path")
    .attr("class", (d) => `trajectory_${d.id}`)
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke", (d) => color(d.source.name))
    .attr("stroke-opacity", 1)
    .attr("stroke-width", 0)
    .transition()
    .delay((d) => 7000 + d.source.id * 1500)
    .duration(1000)
    .attr("stroke-opacity", 1)
    .attr("stroke-width", (d) => Math.max(1, d.width));

const node = svg
    .append("g")
    .selectAll("text")
    .data((sankey(data_final)).nodes)
    .join("text")
    .attr("x", (d) => (d.x0 > width / 2 ? d.x1 + 10 : d.x0 - 10))
    .attr("y",  (d) => (d.x0 < width / 2 ? (y(d.name) + 50) : ((d.y1 + d.y0) / 2)))
    .attr("fill", "white")
    .attr("dy", "0.4em")
    .attr("text-anchor", (d) => (d.x0 < width / 2 ? "end" : "start"))
    .attr("font-size", (d) => (d.x0 > width / 2 ? 0 : 13))
    .attr("font-weight", 200)
    .text((d) => d.name + "s")
    .transition()
    .delay(3000)
    .duration(1500)
    .attr("y", (d) => (d.y1 + d.y0) / 2)
    .transition()
    .delay(500)
    .duration(1500)
    .attr("y", (d) => (d.y1 + d.y0) / 2)
    .attr("font-size", (d) => (d.x0 > width / 2 ? 13 : 13));

});