const width = 900;
const height = 500;

const makeDemo = () => {

	const data = generateGraph(25);
	const container = prepareContainer();
	
	renderGraph(container, data);
};

const generateGraph = (nodesCount, probability = 0.1) => {
	const nodes = d3.range(nodesCount).map(d => ({ id: d}));
	const links = [];
	for (let source = 0; source < nodesCount; source++) {
		for (let target = 0; target < nodesCount; target++) {
			if (Math.random() < probability) {
				links.push({ source, target });
			}
		}
	}
	return { nodes, links }
};

const prepareContainer = () => {

	const container = d3
				.select("#root")
					.append("svg")
						.attr("width", width)
						.attr("height", height)
					.append("g")
						.attr("transform", `translate(${ width / 2}, ${ height / 2 })`);

	return container;
};

const renderGraph = (container, data) => {
	
	runSimulation(data);
	
	//
	const links = container
					.selectAll(".link")
					.data(data.links)
						.enter()
					.append("line")
						.attr("class", "link")
						.attr("x1", d => d.source.x)
						.attr("y1", d => d.source.y)
						.attr("x2", d => d.target.x)
						.attr("y2", d => d.target.y)
						.style("stroke", "black")
						.style("opacity", 0.3);

	//
	const nodes = container
					.selectAll(".node")
					.data(data.nodes)
						.enter()
					.append("g")
						.attr("class", "node")
						.attr("transform", d => `translate(${ d.x }, ${ d.y })`);

	nodes
		.append("circle")
		.attr("r", 2)
		.style("stroke", "none")
		.style("fill", "tomato");
	  
};

const runSimulation = (data) => {

	const simulation = d3.forceSimulation(data.nodes)
						      	.force("link", d3.forceLink(data.links).id(d => d.id).distance(50))
						      	.force("charge", d3.forceManyBody())
						      	.force("x", d3.forceX())
						     	.force("y", d3.forceY());

	for (let i = 0; i < 200; i++) {
		simulation.tick();
	}
};

makeDemo();