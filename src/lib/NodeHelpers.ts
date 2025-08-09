import type { Edge, Node } from "@xyflow/react";
import { nanoid } from "nanoid";

type CreateLinkedNodeParams = {
  sourceNode: Node;
  sourceEdgeSide: string;
  targetEdgeSide: string;
  xOffset?: number;
  yOffset?: number;
};

type GetClosestNodeEuclidean = {
  node: Node;
  nodes: Node[];
};

export class NodeHelpers {
  static createLinkedNode({
    sourceNode,
    sourceEdgeSide,
    targetEdgeSide,
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

    const newEdges: Edge[] = [
      {
        id: `${sourceNode.id}-${newNode.id}-${nanoid()}`,
        animated: true,
        source: sourceNode.id,
        target: newNode.id,
        sourceHandle: `${sourceNode.id}-handle-source-${sourceEdgeSide}`,
        targetHandle: `${newNode.id}-handle-target-${targetEdgeSide}`,
      },
      {
        id: `${sourceNode.id}-${newNode.id}-${nanoid()}`,
        animated: true,
        source: newNode.id,
        target: sourceNode.id,
        targetHandle: `${sourceNode.id}-handle-target-${sourceEdgeSide}`,
        sourceHandle: `${newNode.id}-handle-source-${targetEdgeSide}`,
      },
    ];

    return { node: newNode, edges: newEdges };
  }

  static getClosestNodeEuclidean({ node, nodes }: GetClosestNodeEuclidean) {
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
}
