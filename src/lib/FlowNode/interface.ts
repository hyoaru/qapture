import type { Edge, Node } from "@xyflow/react";

type CreateLinkResult = {
  node: Node;
  edge: Edge;
};

export interface IFlowNode {
  toNode(): Node;
  createLink(): CreateLinkResult;
  getClosest(params: { nodes: Node[] }): Node;
  sortByDistance(params: { nodes: Node[] }): Node[];
  sortByDistance(params: { nodes: Node[] }): Node[];
}
