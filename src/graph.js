export const distances = (graph, start, visited = {[start]: 0}, depth = 1) => {
	const next = graph[start];
	const nextDepth = depth + 1;

	next &&
		next
			.filter(node => {
				if (node in visited) return false;
				visited[node] = depth;
				return true;
			})
			.forEach(node => {
				distances(graph, node, visited, nextDepth);
			});

	return visited;
};

export const buildGraph = links =>
	links.reduce(
		(graph, {cards: [from, to]}) =>
			Object.assign(graph, {
				[from._id]: (graph[from._id] || []).concat(to._id)
			}),
		{}
	);
