triples = []


data = {
  nodes: [
    {name: "China"},
    {name: "Country"},
    {name: "Asia"},
    {name: "Continent"},
    {name: "President"},
    {name: "Xi Xinping"},
    {name: "Europe"},
  ],
  links: [
    {source: 0, target: 1, label: "is a"},
    {source: 0, target: 2, label: "is within"},
    {source: 2, target: 3, label: "is a"},
    {source: 0, target: 4, label: "has a"},
    {source: 5, target: 0, label: "presidentOf"},
    {source: 5, target: 4, label: "is a"},
    {source: 6, target: 3, label: "is a"},
    {source: 6, target: 2, label: "borders"},
    {source: 6, target: 0, label: "trades with"},
  ]
}

svgDims = d3.select("#networkContainer").node()
console.log(svgDims)
height = svgDims.getBoundingClientRect().height
width = svgDims.getBoundingClientRect().width


const createSimulation = (nodes, links) => {

  var simulation = d3.forceSimulation(nodes)
  	.force('charge', d3.forceManyBody().strength(-1500))
  	.force('center', d3.forceCenter(width / 2, height / 2))
  	.force('link', d3.forceLink().links(links))
  	.on('tick', ticked);

  function updateLinks() {
  	var u = d3.select('.links')
  		.selectAll('line')
  		.data(links)
  		.join('line')
  		.attr('x1', function(d) {
  			return d.source.x
  		})
  		.attr('y1', function(d) {
  			return d.source.y
  		})
  		.attr('x2', function(d) {
  			return d.target.x
  		})
  		.attr('y2', function(d) {
  			return d.target.y
  		});

    var a = d3.select('.link-labels')
      .selectAll('text')
      .data(links)
      .join('text')
      .attr('class', 'link-text')
      .attr('x', function(d) {
  			return (d.source.x +d.target.x)/2
  		})
  		.attr('y', function(d) {
  			return (d.source.y +d.target.y)/2
  		})
      .text(function (d){
        return d.label
      })

  }

  function updateNodes() {
  	u = d3.select('.nodes')
  		.selectAll('text')
  		.data(nodes)
  		.join('text')
      .attr('class', 'node-text')
  		.text(function(d) {
  			return d.name
  		})
  		.attr('x', function(d) {
  			return d.x
  		})
  		.attr('y', function(d) {
  			return d.y
  		})
  		.attr('dy', function(d) {
  			return 5
  		})
      .call(drag(simulation));
  }

  function ticked() {
  	updateLinks()
  	updateNodes()
  }

  drag = simulation => {

    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
  }

}

createSimulation(data.nodes, data.links)

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

d3.select("#submit").on('click', function() {
  console.log("submitting")
  var subject = d3.select("#subject").node().value
  var predicate = d3.select("#predicate").node().value
  var object = d3.select("#object").node().value

  triples.push({subject, object, predicate})

  all_subjects = triples.map(d => {return d.subject})
  all_objects = triples.map(d => {return d.object})

  // new nodes
  node_names = all_subjects.concat(all_objects).filter(onlyUnique)

  new_nodes = node_names.map(node => {return {name: node}})

  new_links = triples.map(connection => {
    return {
      source: node_names.indexOf(connection.subject),
      target: node_names.indexOf(connection.object),
      label: connection.predicate,
    }})

  console.log(new_nodes)
  console.log(new_links)

  createSimulation(new_nodes, new_links)

  // need to get the graph to update correctly when new data is added
  // check that data is in the right format
  // Then see if d3 is being weird

  //console.log(new_nodes)
  //console.log(new_links)


  //new links


})
