import type { INodeLayoutStrategy } from "./interface";

import dagre from "dagre";

export class DagreNodeLayoutStrategy implements INodeLayoutStrategy {
  run({ nodes, edges }: Parameters<INodeLayoutStrategy["run"]>[0]) {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({
      rankdir: "LR",
      ranksep: 100,
      nodesep: 50,
    });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, {
        width: node.measured?.width ?? 180,
        height: node.measured?.height ?? 80,
      });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const positionedNodes = nodes.map((node) => {
      const dagreNode = dagreGraph.node(node.id);

      return {
        ...node,
        position: {
          x: dagreNode.x - dagreNode.width / 2,
          y: dagreNode.y - dagreNode.height / 2,
        },
        positionAbsolute: {
          x: dagreNode.x - dagreNode.width / 2,
          y: dagreNode.y - dagreNode.height / 2,
        },
      };
    });

    return { nodes: positionedNodes, edges };
  }
}
