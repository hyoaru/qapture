import type { Node } from "@xyflow/react";
import type { IFlowNode } from "./interface";
import { GraphFactory } from "../GraphFactory";

export class FlowNode implements IFlowNode {
  node: Node;

  constructor(node: Node) {
    this.node = node;
  }
  toNode(): Node {
    throw new Error("Method not implemented.");
  }
  getClosest(params: { nodes: Node[] }): Node {
    throw new Error("Method not implemented.");
  }
  sortByDistance(params: { nodes: Node[] }): Node[] {
    throw new Error("Method not implemented.");
  }

  createLink(): ReturnType<IFlowNode["createLink"]> {
    const linkedNode = GraphFactory.createNode({ selected: true });
    const linkedEdge = GraphFactory.createEdge({
      source: this.node,
      target: linkedNode,
    });

    return { node: linkedNode, edge: linkedEdge };
  }
}
