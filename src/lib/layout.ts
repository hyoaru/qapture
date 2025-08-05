import type { Edge, Node } from "@xyflow/react";
import ELK from "elkjs/lib/elk.bundled.js";

const elk = new ELK();

export async function layoutGraph(
  nodes: Node[],
  edges: Edge[],
  options: { direction?: "RIGHT" | "DOWN" } = {},
): Promise<{ nodes: Node[]; edges: Edge[] }> {
  const graph = {
    id: "root",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.direction": options.direction ?? "RIGHT",
      "elk.layered.spacing.nodeNodeBetweenLayers": "50",
      "elk.spacing.nodeNode": "30",
    },
    children: nodes.map((node) => ({
      id: node.id,
      width: node.width || 150,
      height: node.height || 40,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  const layouted = await elk.layout(graph);

  const nodeMap = new Map(layouted.children?.map((n) => [n.id, n]) ?? []);

  const layoutedNodes = nodes.map((node) => {
    const layoutNode = nodeMap.get(node.id);
    return {
      ...node,
      position: {
        x: layoutNode?.x ?? 0,
        y: layoutNode?.y ?? 0,
      },
    };
  });

  return {
    nodes: layoutedNodes,
    edges,
  };
}
