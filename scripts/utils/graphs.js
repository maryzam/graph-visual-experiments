const generateGraph = (nodesCount, probability = 0.3) => {
	const nodes = d3.range(nodesCount).map(d => ({ id: d}));
	const links = [];
	for (let source = 0; source < nodesCount; source++) {
		for (let target = source + 1; target < nodesCount; target++) {
			if (Math.random() < probability) {
				links.push({ source, target });
			}
		}
	}
	return { nodes, links }
};
