
export class Edge<T> {
	constructor(
		public node: string,
		public weight: T
	) {}
	toString(): string {
		return `(${this.node}, ${this.weight})`;
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
	getEdgesFromPath(nodes: string[]): Edge<T>[] {
        const edges: Edge<T>[] = [];

        for (const node of nodes) {
            const nodeEdges = this.getEdgesFromNode(node);
            edges.push(...nodeEdges);
        }

        return edges;
    }
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
				if (!visited.has(neighbor.node)) {
					visited.add(neighbor.node);
					predecessor.set(neighbor.node, currentVertex);
					queue.push(neighbor.node);
				}
			}
		}

		// If no path found
		return null;
	}

	printGraph(): void {
        for (let [node, edges] of this.adj) {
            const edgeDetails = edges.map(edge => `${edge.node} (weight: ${edge.weight})`).join(', ');
            console.log(`${node} -> ${edgeDetails}`);
        }
    }
}
