import type { Edge, Node } from "@xyflow/react";

type LayoutResult = {
  nodes: Node[];
  edges: Edge[];
};

type RunParams = {
  nodes: Node[];
  edges: Edge[];
};

export interface INodeLayoutStrategy {
  run(params: RunParams): LayoutResult;
}
