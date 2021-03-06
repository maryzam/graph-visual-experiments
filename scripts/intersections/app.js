const radToDec = 180 / Math.PI;

const scaleAngle = d3.scaleSequential(d3.interpolateBlues).domain([90, 0])

const makeDemo = () => {

	const nodeCount = Math.floor(30 + Math.random() * 20);

	const data = generateGraph(nodeCount);
	const size = getViewSize();
	const container = prepareContainer(size);
	
	runSimulation(data);
	renderGraph(container, data);
};

const getViewSize = () => {
	const container = d3.select("#root").node();
	return container.getBoundingClientRect();
}

const prepareContainer = (size) => {

	const container = d3
				.select("#root")
					.append("svg")
						.attr("width", size.width)
						.attr("height", size.height)
					.append("g")
						.attr("transform", `translate(${ size.width / 2}, ${ size.height / 2 })`);

	return container;
};

const unifyLinks = (links) => {
	return () => {
		links
			.transition()
				.duration(300)
			.style("stroke", "black");
	}
}


const highlightIntersections = (links) => {
	return (currentLink) => {
		links
			.style("stroke", d => isIntersect(d, currentLink) ? "tomato" : "black")
			.style("opacity", d => isIntersect(d, currentLink) ? 1 : 0.3);
	};
}

const renderGraph = (container, data) => {
	
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
						.attr("y2", d => d.target.y);

	links
		.on("mouseover", highlightIntersections(links))
		.on("mouseout", unifyLinks(links));

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
		.attr("r", 2);
};

const runSimulation = (data) => {

	const simulation = d3.forceSimulation(data.nodes)
						      	.force("link", d3.forceLink(data.links).id(d => d.id).distance(100))
						      	.force("charge", d3.forceManyBody())
						      	.force("x", d3.forceX())
						     	.force("y", d3.forceY());

	for (let i = 0; i < 200; i++) {
		simulation.tick();
	}
};

makeDemo();