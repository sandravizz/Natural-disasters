// --------------------------------------
//  Margin and canvas
// --------------------------------------

const margin = { top: 100, right: 60, bottom: 60, left: 60 };

const width = 900 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

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

function sankey1(){

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
  
return ({ nodes, links }) =>
  sankey({
    nodes: nodes.map((d) => Object.assign({}, d)),
    links: links.map((d) => Object.assign({}, d))
  });

};

// Checking sankey applied to data
console.log(sankey1(data_final));
  





});








