const radToDec = 180 / Math.PI;

const scaleAngle = d3.scaleSequential(d3.interpolateBlues).domain([90, 0])

const makeDemo = () => {

	const data = generateGraph(100);
	const size = getViewSize();
	const container = prepareContainer(size);
	
	runSimulation(data);
	renderGraph(container, data);
	//renderVoronoiGrid(container, data, size);
	renderClassicGrid(container, data);
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

const hideLinks = (links) => {
	return () => {
		links
			.transition()
			.duration(200)
			.style("opacity", 0.05);
	}
};

const showRelatedLinks = (links) => {
	return (d) => {
		links
			.transition()
			.duration(200)
			.style("opacity", link => ((link.source.id == d.id) || (link.target.id == d.id) ? 0.5 : 0.05));
	}
};

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
						.attr("y2", d => d.target.y)
						.style("opacity", 0.1)
						.style("stroke-width", 2)
						.style("stroke-linecap", "round")
						.style("stroke-dasharray", "0.2, 5");
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

	nodes
		.on("mouseout", hideLinks(links))
		.on("mouseover", showRelatedLinks(links));
};

const runSimulation = (data) => {

	const simulation = d3.forceSimulation(data.nodes)
						      	.force("link", d3.forceLink(data.links).id(d => d.id).distance(150))
						      	.force("charge", d3.forceManyBody())
						      	.force("x", d3.forceX())
						     	.force("y", d3.forceY());

	for (let i = 0; i < 200; i++) {
		simulation.tick();
	}
};

const renderVoronoiGrid = (container, data, size) => {
	const voronoi = d3.voronoi()
						.x(d => d.x)
						.y(d => d.y)
						.extent([
							[-size.width / 2, -size.height / 2], 
							[size.width / 2, size.height / 2]
						]);

	const gridPolygons = voronoi.polygons(data.nodes);
	console.log(gridPolygons);

	container
		.append("g")
			.selectAll(".grid")
		.data(gridPolygons)
			.enter()
			.append("path")
			.attr("class", "grid")
			.attr("d", (d, i) => {
				if (!d) { console.log(d, i); return ""; }
				return `M ${ d.join("L") }Z`;
			})
			.style("fill", "none")
			.style("stroke", "tomato");
};

const renderClassicGrid = (container, data) => {
	const step = 5;
	const xRange = d3.extent(data.nodes, d => d.x);
	const yRange = d3.extent(data.nodes, d => d.y);
	const verticals = d3.range(Math.ceil((xRange[1] - xRange[0]) / step));
	const horizontals = d3.range(Math.ceil((yRange[1] - yRange[0]) / step));

	const grid = container
		.append("g")
		.attr("class", "axis");

	const total = verticals.length;

	grid
		.selectAll(".vertical")
		.data(verticals).enter()
		.append("line")
		.attr("class", "vertical")
		.attr("x1", d => xRange[0] + d * step).attr("y1", yRange[1])
		.attr("x2",  d => xRange[0] + d * step).attr("y2", yRange[0])
		.style("stroke", "tomato")
		.style("stroke-opacity", (d, i) => Math.min(0.5, 0.05 * Math.min(i, total - i)));

	grid
		.selectAll(".horizontal")
		.data(horizontals).enter()
		.append("line")
		.attr("class", "horizontal")
		.attr("x1", xRange[0]).attr("y1", d => yRange[0] + d * step)
		.attr("x2", xRange[1]).attr("y2", d =>  yRange[0] + d * step)
		.style("stroke", "tomato")
		.style("stroke-opacity", (d, i) => Math.min(0.05 * Math.min(i, total - i)));
}


makeDemo();