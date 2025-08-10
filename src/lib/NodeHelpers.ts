import type { Edge, Node } from "@xyflow/react";
import { nanoid } from "nanoid";

type CreateLinkedNodeParams = {
  sourceNode: Node;
  xOffset?: number;
  yOffset?: number;
};

type GetClosestNodeEuclideanParams = {
  node: Node;
  nodes: Node[];
};

type SortClosestNodeEuclideanParams = {
  node: Node;
  nodes: Node[];
};

export class NodeHelpers {
  static createLinkedNode({
    sourceNode,
    xOffset = 0,
    yOffset = 0,
  }: CreateLinkedNodeParams) {
    const newNode: Node = {
      id: nanoid(),
      type: "text",
      position: {
        x: sourceNode.position.x + xOffset,
        y: sourceNode.position.y + yOffset,
      },
      data: {},
      selected: true,
    };

    const newEdge: Edge = {
      id: `${sourceNode.id}-${newNode.id}-${nanoid()}`,
      animated: true,
      source: sourceNode.id,
      target: newNode.id,
      sourceHandle: `${sourceNode.id}-handle-source-right`,
      targetHandle: `${newNode.id}-handle-target-left`,
    };

    return { node: newNode, edge: newEdge };
  }

  static getClosestNodeEuclidean({
    node,
    nodes,
  }: GetClosestNodeEuclideanParams): Node {
    return nodes.reduce((closestNode, currentNode) => {
      const dxCurrent = currentNode.position.x - node.position.x;
      const dyCurrent = currentNode.position.y - node.position.y;
      const currentDistance = Math.sqrt(dxCurrent ** 2 + dyCurrent ** 2);

      const dxClosest = closestNode.position.x - node.position.x;
      const dyClosest = closestNode.position.y - node.position.y;
      const closestDistance = Math.sqrt(dxClosest ** 2 + dyClosest ** 2);

      return currentDistance < closestDistance ? currentNode : closestNode;
    }, nodes[0]);
  }

  static sortNodesByDistanceEuclidean({
    node,
    nodes,
  }: SortClosestNodeEuclideanParams): Node[] {
    return [...nodes].sort((a, b) => {
      const dxA = a.position.x - node.position.x;
      const dyA = a.position.y - node.position.y;
      const distA = Math.sqrt(dxA ** 2 + dyA ** 2);

      const dxB = b.position.x - node.position.x;
      const dyB = b.position.y - node.position.y;
      const distB = Math.sqrt(dxB ** 2 + dyB ** 2);

      return distA - distB;
    });
  }
}
