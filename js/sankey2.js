// --------------------------------------
//  Margin and canvas
// --------------------------------------

const margin2 = {top: 5, right: 90, bottom: 30, left: 100};
const width2 = 1000;
const height2 = 400;
const innerWidth2 = width2 - margin2.left - margin2.right;
const innerHeight2 = height2 - margin2.top - margin2.bottom;

const svg2 = d3.select("#chart2")
  .append("svg")
    .attr("viewBox", `0, 0, ${width2}, ${height2}`);

const innerChart2 = svg2
  .append("g")
    .attr("transform", `translate(${margin2.left}, ${margin2.top})`);

// --------------------------------------
//  Data loading
// --------------------------------------

const data2 = d3.csv("./data/sankey_data2.csv", d3.autoType) 
  .then(function(data2){ 

    let links = [];

    data2.sort((a,b) => a["Year"] - b["Year"]);

    data2.map((d, i) => {
      links.push({
        source: d["Disaster"], 
        target: d["Year"],
        value: d["sum_costs"],
        id: i
      });
    });

    // console.log(links);

    const nodes = Array.from(
      new Set(links.flatMap((d) => [d.source, d.target])),
      (name, id) => ({ name, id})
    );

    // console.log(nodes);

    links.map((d) => {
      d.source = nodes.find((e) => e.name === d.source).id;
      d.target = nodes.find((e) => e.name === d.target).id;
    });

    // console.log(links);
    
    let data_final2 = {nodes, links};

    console.log(data_final2);

// --------------------------------------
//  Formating 
// --------------------------------------

    format = d3.format(".03s")

// --------------------------------------
//  Scales
// --------------------------------------

  let color = d3.scaleOrdinal()
      .domain(["Cyclones", "Droughts", "Wildfires", "Floodings", "Winters", "Storms"])
      .range(["#ccff99", "#cccc99", "#B0CCA3", "#99FFD7", "#99FFB4", "#A8A87E"]);

// --------------------------------------
//  Sankey
// --------------------------------------
  
    const sankey2 = d3.sankey()
      .nodeSort((a, b) => a.id - b.id)
      .nodeAlign(d3.sankeyLeft) //as we only have two node groups it doesn't impact much
      .nodeId((d) => d.id)
      .linkSort(null)
      .nodeWidth(25) //
      .nodePadding(18) //space between each node
      .extent([
        [0, 0],
        [innerWidth2, innerHeight2]
      ]);

  // console.log(sankey2(data_final2));

// --------------------------------------
//  Data drawing 
// --------------------------------------

    //Nodes = rects
    innerChart2
        .selectAll("rect")
        .data((sankey2(data_final2)).nodes)
        .join("rect")
        .attr("height", (d) => d.y1 - d.y0)
        .attr("width", (d) => (d.x0 < innerWidth2 / 2 ? d.x1 - d.x0 + 30 : 20))
        .attr("y", (d) => d.y0)
        .attr("x", (d) => d.x0)
        .attr("fill", (d) => (d.x0 < innerWidth2 / 2 ? color(d.name) : "white"))
        .on("mouseover", (e, d) => {
          d3.selectAll(".sankey_path").style("opacity", (p) =>
            p.source.name === d.name || p.target.name === d.name ? "1" : "0.1"
          );
        })
        .on("mouseout", (e, d) => {
          d3.selectAll(".sankey_path").style("opacity", 0.85);
        });

    //Nodes = text 
    innerChart2
        .selectAll("text")
        .data((sankey2(data_final2)).nodes)
        .join("text")
        .attr("class", "text")
        .text((d) => (d.name))
        .attr("x", (d) => (d.x0 > innerWidth2 / 2 ? d.x1 + 10 : d.x0 - 10))
        .attr("y", (d) => (d.y1 + d.y0) / 2)
        .attr("fill", "white")
        .attr("dy", "0.4em")
        .attr("text-anchor", (d) => (d.x0 < innerWidth2 / 2 ? "end" : "start"));

    //Links = path 
    innerChart2
        .selectAll(".sankey_path")
        .data((sankey2(data_final2)).links)
        .join("path")
        .attr("class", "sankey_path")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke", (d) => color(d.source.name))
        .attr("fill", "none")
        .attr("opacity", (d) => (d.source.name === "Cyclones" ? 1 : 0.1))
        .attr("stroke-width", (d) => Math.max(0, d.width));

});