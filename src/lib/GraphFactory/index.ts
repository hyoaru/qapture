import type { Edge, Node } from "@xyflow/react";
import { nanoid } from "nanoid";

type CreateNodeParams = {
  position?: {
    x: number;
    y: number;
  };
  data?: Record<string, unknown>;
  selected?: boolean;
};

type CreateEdgeParams = {
  source: Node;
  target: Node;
};

export class GraphFactory {
  static createNode(params: Partial<CreateNodeParams> = {}): Node {
    return {
      ...params,
      id: nanoid(),
      type: "text",
      position: params.position ?? { x: 0, y: 0 },
      data: params.data ?? {},
    };
  }

  static createEdge(params: CreateEdgeParams): Edge {
    return {
      id: `${params.source.id}-${params.target.id}-${nanoid()}`,
      animated: true,
      source: params.source.id,
      target: params.target.id,
      sourceHandle: `${params.source.id}-handle-source-right`,
      targetHandle: `${params.target.id}-handle-target-left`,
    };
  }
}
