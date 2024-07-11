
export class Edge<T> {
	constructor(
		public to: string,
		public weight: T
	) {}
	toString(): string {
		return `(${this.to}, ${this.weight})`;
	}
}

export class WeightedGraph<T> {
	private adj = new Map<string, Edge<T>[]>();

	addNode(node: string) {
		if (!this.adj.has(node)) {
			this.adj.set(node, []);
		}
	}
	addEdge(node1: string, node2: string, weight: T) {
		if (!this.adj.has(node1)) {
			this.addNode(node1);
		}
		if (!this.adj.has(node2)) {
			this.addNode(node2);
		}
		const edge = new Edge<T>(node1, weight);
		const edge2 = new Edge<T>(node2, weight);
		this.adj.get(node1)?.push(edge2);
		this.adj.get(node2)?.push(edge);
	}
	getEdgesFromNode(node: string): Edge<T>[] {
		return this.adj.get(node) || [];
	}
	getEdgesFromPath(nodePath: string[]): Edge<T>[] {
		const edges: Edge<T>[] = [];
	
		for (let i = 0; i < nodePath.length - 1; i++) {
			const currentNode = nodePath[i];
			const nextNode = nodePath[i + 1];
			const nodeEdges = this.getEdgesFromNode(currentNode);
			const connectingEdge = nodeEdges.find(edge => edge.to === nextNode);
			if (connectingEdge) {
				edges.push(connectingEdge);
			}
		}
	
		return edges;
	}

	// so nodes contains the path from start to target, 

	bfs(startVertex: string, targetVertex: string): string[] | null {
		const queue: string[] = [startVertex];
		const visited: Set<string> = new Set();
		const predecessor: Map<string, string | null> = new Map();

		visited.add(startVertex);
		predecessor.set(startVertex, null);

		while (queue.length > 0) {
			const currentVertex = queue.shift()!;

			if (currentVertex === targetVertex) {
				// Reconstruct the path
				const path: string[] = [];
				let step = currentVertex;
				while (step !== null) {
					path.unshift(step);
					step = predecessor.get(step)!;
				}
				return path;
			}

			const neighbors = this.getEdgesFromNode(currentVertex);
			for (const neighbor of neighbors) {
				if (!visited.has(neighbor.to)) {
					visited.add(neighbor.to);
					predecessor.set(neighbor.to, currentVertex);
					queue.push(neighbor.to);
				}
			}
		}

		// If no path found
		return null;
	}

	printGraph(): void {
        for (let [node, edges] of this.adj) {
            const edgeDetails = edges.map(edge => `${edge.to} (weight: ${edge.weight})`).join(', ');
            console.log(`${node} -> ${edgeDetails}`);
        }
    }
}
