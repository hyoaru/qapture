import { FlowNode } from "@/lib/FlowNode";
import {
  getConnectedEdges,
  useReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import { useCallback } from "react";

type CreateLinkParams = {
  sourceNode: Node;
};

type CreateLinkResult = {
  addedNode: Node;
  addedEdge: Edge;
  updatedNodes: Node[];
  updatedEdges: Edge[];
};

type CommitParams = {
  nodes: Node[];
  edges: Edge[];
};

type DeleteNodeResult = {
  parentNode: Node | null;
  removedNode: Node;
  removedEdges: Edge[];
  updatedNodes: Node[];
  updatedEdges: Edge[];
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

  const removeNodeAndLinks = useCallback(
    (node: Node): DeleteNodeResult => {
      const existingEdges = reactFlow.getEdges();
      const connectedEdges = getConnectedEdges([node], existingEdges);
      const connectedNodeIds = connectedEdges.map((e: Edge) => e.target);
      const connectedEdgesIds = connectedEdges.map((e: Edge) => e.id);

      const parentEdge = connectedEdges.find((e) => e.target == node.id);
      const parentNode = parentEdge
        ? (reactFlow.getNode(parentEdge.source) ?? null)
        : null;

      const updatedNodes = reactFlow
        .getNodes()
        .filter((n: Node) => !connectedNodeIds.includes(n.id));

      const updatedEdges = reactFlow
        .getEdges()
        .filter((e: Edge) => !connectedEdgesIds.includes(e.id));

      return {
        parentNode: parentNode,
        removedNode: node,
        removedEdges: connectedEdges,
        updatedNodes: updatedNodes,
        updatedEdges: updatedEdges,
      };
    },
    [reactFlow],
  );

  const createLinkedNode = useCallback(
    (params: CreateLinkParams): CreateLinkResult => {
      const node = new FlowNode(params.sourceNode);
      const link = node.createLink();

      const updatedNodes = reactFlow
        .getNodes()
        .map((n: Node) => ({ ...n, selected: false }))
        .concat(link.node as Node & { selected: boolean });

      const updatedEdges = reactFlow.getEdges().concat(link.edge);

      return {
        addedNode: link.node,
        addedEdge: link.edge,
        updatedNodes: updatedNodes,
        updatedEdges: updatedEdges,
      };
    },
    [reactFlow],
  );

  return {
    node: {
      createLink: createLinkedNode,
      remove: removeNodeAndLinks,
    },
    commit,
  };
};
