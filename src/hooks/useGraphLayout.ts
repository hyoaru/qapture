import { NodeLayoutEngine } from "@/lib/NodeLayoutEngine";
import { type Edge, type Node } from "@xyflow/react";
import { useCallback } from "react";

type LayoutNodesParams = {
  nodes: Node[];
  edges: Edge[];
};

type LayoutNodesResult = {
  nodes: Node[];
  edges: Edge[];
};

export const useGraphLayout = () => {
  const run = useCallback((params: LayoutNodesParams): LayoutNodesResult => {
    const engine = new NodeLayoutEngine();

    const result = engine.run({
      nodes: params.nodes,
      edges: params.edges,
    });

    return result;
  }, []);

  return {
    run,
  };
};
