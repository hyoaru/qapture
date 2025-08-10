import { FlowNode } from "@/lib/FlowNode";
import { useReactFlow, type Edge, type Node } from "@xyflow/react";
import { useCallback } from "react";

type CreateLinkParams = {
  sourceNode: Node;
};

type CreateLinkResult = {
  newNode: Node;
  newEdge: Edge;
  updatedNodes: Node[];
  updatedEdges: Edge[];
};

type CommitParams = {
  nodes: Node[];
  edges: Edge[];
};

export const useGraphMutation = () => {
  const reactFlow = useReactFlow();

  const commit = useCallback(
    (params: CommitParams) => {
      reactFlow.setNodes(params.nodes);
      reactFlow.setEdges(params.edges);
    },
    [reactFlow],
  );

  const createLink = useCallback(
    (params: CreateLinkParams): CreateLinkResult => {
      const node = new FlowNode(params.sourceNode);
      const link = node.createLink();

      const updatedNodes = reactFlow
        .getNodes()
        .map((n: Node) => ({ ...n, selected: false }))
        .concat(link.node as Node & { selected: boolean });

      const updatedEdges = reactFlow.getEdges().concat(link.edge);

      return {
        newNode: link.node,
        newEdge: link.edge,
        updatedNodes: updatedNodes,
        updatedEdges: updatedEdges,
      };
    },
    [reactFlow],
  );

  return { createLink, commit };
};
