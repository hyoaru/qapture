import type { INodeLayoutStrategy } from "./interface";

import dagre from "dagre";

export class DagreNodeLayoutStrategy implements INodeLayoutStrategy {
  run({ nodes, edges }: Parameters<INodeLayoutStrategy["run"]>[0]) {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: "LR" });

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
      const { x, y } = dagreGraph.node(node.id);
      return {
        ...node,
        position: { x, y },
        positionAbsolute: { x, y },
      };
    });

    return { nodes: positionedNodes, edges };
  }
}
