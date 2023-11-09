// --------------------------------------
//  Margin and canvas
// --------------------------------------

const margin = { top: 20, right: 100, bottom: 60, left: 60 };

const width = 900 - margin.left - margin.right;
const height = 700 - margin.top - margin.bottom;

let svg = d3.select("#graph")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// --------------------------------------
//  Data loading
// --------------------------------------

const data = d3.csv("./data/sankey_data.csv", d3.autoType)    
  .then(function(data){ 

    let links = [];

    data.sort((b, a) => a["Decade"] - b["Decade"]);

    data.map((row, i) => {
      links.push({
        source: row["Decade"],
        target: row["Disaster"],
        value: row["sum_costs"],
        id: i
      });
    });

    const nodes = Array.from(
      new Set(links.flatMap((l) => [l.source, l.target])),
      (name, id) => ({ name, id })
    );

    links.map((d) => {
      d.source = nodes.find((e) => e.name === d.source).id;
      d.target = nodes.find((e) => e.name === d.target).id;
    });
    
    let data_final = {nodes:nodes, links:links};
    // console.log(data_final);

// --------------------------------------
//  Format
// --------------------------------------    

let format = d3.format(".02s");

// --------------------------------------
//  Scales
// --------------------------------------

let color = d3.scaleOrdinal()
  .domain([
    "Tropical Cyclone",
    "Drought",
    "Wildfire",
    "Flooding",
    "Winter Storm",
    "Severe Storm"
  ])
  .range(["#A3AB78", "#BDE038", "#9FC131", "#005C53", "#042940", "#f20666"]);

// --------------------------------------
//  Sankey
// --------------------------------------
  const sankey = d3.sankey()
  .nodeSort((a, b) => a.id - b.id)
  .nodeAlign(d3.sankeyCenter)
  .nodeId((d) => d.id)
  .linkSort(null)
  .nodeWidth(15)
  .nodePadding(3)
  .extent([
    [margin.left, margin.top],
    [width - margin.right, height - margin.bottom]
  ]);


// Checking sankey applied to data
console.log((sankey(data_final)));

// --------------------------------------
//  Data drawing 
// --------------------------------------
  
svg
.append("g")
.selectAll("rect")
.data((sankey(data_final)).nodes)
.join("rect")
.attr("x", (d) => (d.x0 > width / 2 ? d.x0 : d.x0 + 10))
.attr("y", (d) => d.y0)
.attr("height", (d) => d.y1 - d.y0)
.attr("width", (d) => (d.x0 > width / 2 ? d.x1 - d.x0 + 30 : 5))
.attr("fill", (d) => (d.x0 > width / 2 ? color(d.name) : "black"))
.attr("opacity", (d) => (d.x0 > width / 2 ? 1 : 1))
.on("mouseover", (e, d) => {
  d3.selectAll("path").style("opacity", (p) =>
    p.source.name === d.name || p.target.name === d.name ? "1" : "0.07"
  );
})
.on("mouseout", (e, d) => {
  d3.selectAll("path").style("opacity", 1);
});

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
    .attr("stroke", (d) => color(d.target.name))
    .attr("stroke-opacity", 1)
    .attr("stroke-width", 0)
    .transition()
    .delay((d) => 1000 + d.target.index * 1500)
    .duration(1000)
    .attr("stroke-opacity", 1)
    .attr("stroke-width", (d) => Math.max(1, d.width));

  const node = svg
    .append("g")
    .selectAll("text")
    .data((sankey(data_final)).nodes)
    .join("text")
    .attr("x", (d) => (d.x0 < width / 2 ? d.x1 - 10 : d.x0 + 50))
    .attr("y", (d) => (d.y1 + d.y0) / 2)
    .attr("fill", (d) => (d.x0 > width / 2 ? color(d.name) : "black"))
    .attr("dy", "0.4em")
    .attr("text-anchor", (d) => (d.x0 < width / 2 ? "end" : "start"))
    .attr("font-size", (d) => (d.x0 < width / 2 ? 15 : 15))
    .attr("font-weight", (d) => (d.x0 < width / 2 ? 300 : 500))
    .text((d) => d.name + "s")
    .append("tspan")
    .attr("fill-opacity", (d) => (d.x0 < width / 2 ? 0.5 : 1))
    .attr("font-weight", 400)
    .text((d) => `  | ${format(d.value)}`);

});








