// --------------------------------------
//  Margin and canvas
// --------------------------------------

var margin = { top: 100, right: 60, bottom: 60, left: 60 };
var width = 900 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;


var svg = d3.select("#graph")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// --------------------------------------
//  Data loading
// --------------------------------------

const data = d3.json("./exercise_fixed.json")    
  .then(function(data){ 

console.log(data);

// --------------------------------------
//  Tooltip
// --------------------------------------

const tooltip = d3.tip()
    .attr("class", "tip")
    .html(
      (event, d) => `
      <div>
        <b>Type</b> ${d.properties} // create a for each function
      </div>`
    );

svg.call(tooltip); 

// --------------------------------------
//  Scales
// --------------------------------------

let c = d3.scaleOrdinal()
        .domain(["account",  "address", "person", "transaction"])
        .range(["#06d6a0", "#662e9b", "#f20666", "#9EF211"]);

// --------------------------------------
//  Drag function for nodes
// --------------------------------------

function drag (simulation) {
  
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  
  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}

// --------------------------------------
//  Force layout
// --------------------------------------

const simulation = d3.forceSimulation(data.nodes)
	.force('charge', d3.forceManyBody()
                     .strength(-50))
	.force('center', d3.forceCenter(width / 2, height / 2))
	.force('link', d3.forceLink(data.links)
                   .id((d) => d.id))
	.on('tick', ticked);

function updateLinks() {
	d3.select('svg')
		.selectAll('line')
		.data(data.links)
		.join('line')
    .attr("class", "line")
		.attr('x1', d => d.source.x)
		.attr('y1', d => d.source.y)
		.attr('x2', d => d.target.x)
		.attr('y2', d => d.target.y);
}

function updateNodes() {
	d3.select('svg')
		.selectAll('circle')
		.data(data.nodes)
		.join('circle')
		.attr('r', 10)
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr("fill", d => c(d.type))
    .on("mouseover", tooltip.show)
    .on("mouseout", tooltip.hide)
    .call(drag(simulation));
}

function ticked() {
	updateLinks()
	updateNodes()
}

});