const radToDec = 180 / Math.PI;

const scaleAngle = d3.scaleSequential(d3.interpolateBlues).domain([90, 0])

const makeDemo = () => {

	const data = generateGraph(25);
	const size = getViewSize();
	const container = prepareContainer(size);
	
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

const highlightRelativeAngles = (links) => {
	return (link) => {
		const baseAngle = calcAngle(link);
		links.style("stroke", d => scaleAngle(getRelativeAngle(d, baseAngle)));
	}
}

const unifyLinks = (links) => {
	return () => {
		links
			.transition()
				.duration(300)
			.style("stroke", "black");
	}
}


calcAngle = (d) => {
	const x = d.source.x - d.target.x;
	const y = d.source.y - d.target.y;
	return Math.atan2(y, x) * radToDec;
}

const getRelativeAngle = (d, baseAngle) => {
	const current = calcAngle(d);
	const dist = Math.abs(current - baseAngle);
	return (dist > 180) ? (dist - 180) : dist;
}

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
						.attr("y2", d => d.target.y);

	links
		.on("mouseover", highlightRelativeAngles(links))
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