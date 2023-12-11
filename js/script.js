// --------------------------------------
//  Margin and canvas
// --------------------------------------

  const margin = {top: 50, right: 100, bottom: 20, left: 150};
  const width = 900;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Append the SVG container
  const svg = d3.select("#chart")
    .append("svg")
      .attr("viewBox", `0, 0, ${width}, ${height}`);

  // Append the group for the inner chart
  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

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

//for the stacked bar chart
let y = d3.scaleBand()
    .domain(["Wildfire", "Drought", "Tropical Cyclone", "Severe Storm", "Flooding", "Winter Storm"])
    .rangeRound([innerHeight, 0]);

// --------------------------------------
//  Sankey
// --------------------------------------
  
const sankey = d3.sankey()
  .nodeSort((a, b) => a.id - b.id)
  .nodeAlign(d3.sankeyLeft) //as we only have two node groups it doesn't impact much
  .nodeId((d) => d.id)
  .linkSort(null)
  .nodeWidth(15) //
  .nodePadding(30) //space between each node
  .extent([
    [0, 0],
    [innerWidth, innerHeight]
  ]);

// Checking sankey generator applied to data
console.log((sankey(data_final)));

// --------------------------------------
//  Data drawing 
// --------------------------------------

//Nodes = rects
innerChart
    .selectAll("rect")
    .data((sankey(data_final)).nodes)
    .join("rect")
    .attr("width", (d) => d.y1 - d.y0)
    .attr("x", (d) => (d.x0 < innerWidth / 2 ? d.x0 : d.x0))
    .attr("fill", (d) => (d.x0 < innerWidth / 2 ? color(d.name) : "black"))
    .attr("opacity", (d) => (d.x0 < innerWidth / 2 ? 1 : 0))
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
    .attr("fill", (d) => (d.x0 < innerWidth / 2 ? color(d.name) : "white"))
    .attr("height", (d) => d.y1 - d.y0)
    .attr("opacity", (d) => (d.x0 < innerWidth / 2 ? 1 : 0))
    .attr("width", (d) => (d.x0 < innerWidth / 2 ? d.x1 - d.x0 + 30 : 15))
    .attr("y", (d) => d.y0)
    .transition()
    .delay(500)
    .duration(1500)
    .attr("opacity", (d) => (d.x0 < innerWidth / 2 ? 1 : 1));

//Nodes = text 
innerChart
    .selectAll("text")
    .data((sankey(data_final)).nodes)
    .join("text")
    .attr("x", (d) => (d.x0 > innerWidth / 2 ? d.x1 + 10 : d.x0 - 10))
    .attr("y",  (d) => (d.x0 < innerWidth / 2 ? (y(d.name) + 50) : ((d.y1 + d.y0) / 2)))
    .attr("fill", "white")
    .attr("dy", "0.4em")
    .attr("text-anchor", (d) => (d.x0 < innerWidth / 2 ? "end" : "start"))
    .attr("font-size", (d) => (d.x0 > innerWidth / 2 ? 0 : 13))
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
    .attr("font-size", (d) => (d.x0 > innerWidth / 2 ? 13 : 13));

//Links = path 
innerChart
    .selectAll("path")
    .data((sankey(data_final)).links)
    .join("path")
    .attr("class", (d) => `${d.id}`)
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke", (d) => color(d.source.name))
    .attr("fill", "none")
    .attr("stroke-opacity", 1)
    .attr("stroke-width", 0)
    .transition()
    .delay((d) => 7000 + d.source.id * 1500)
    .duration(1000)
    .attr("stroke-opacity", 1)
    .attr("stroke-width", (d) => Math.max(1, d.width));

});