import {
  getConnectedEdges,
  useReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import { nanoid } from "nanoid";
import { useCallback } from "react";

type UseNodeControlsParams = {
  node?: Node;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

export const useNodeControls = (params: UseNodeControlsParams) => {
  const defaultOffset = 200;
  const reactFlow = useReactFlow();

  const createLinkedNode = useCallback(
    ({
      sourceNode,
      sourceEdgeSide,
      targetEdgeSide,
      xOffset = 0,
      yOffset = 0,
    }: {
      sourceNode: Node;
      sourceEdgeSide: string;
      targetEdgeSide: string;
      xOffset?: number;
      yOffset?: number;
    }) => {
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
        id: `${sourceNode.id}-${newNode.id}`,
        animated: true,
        source: sourceNode.id,
        target: newNode.id,
        sourceHandle: `${sourceNode.id}-handle-source-${sourceEdgeSide}`,
        targetHandle: `${newNode.id}-handle-target-${targetEdgeSide}`,
      };

      return { node: newNode, edge: newEdge };
    },
    [],
  );

  const addNode = useCallback(
    (newNode: Node) => {
      reactFlow.setNodes((prevNodes) => [
        ...prevNodes.map((n) => ({ ...n, selected: false })),
        newNode,
      ]);
    },
    [reactFlow],
  );

  const addEdge = useCallback(
    (newEdge: Edge) => {
      reactFlow.setEdges((prevEdges) => [...prevEdges, newEdge]);
    },
    [reactFlow],
  );

  const applyChanges = useCallback(
    async ({ newNode, newEdge }: { newNode: Node; newEdge: Edge }) => {
      addNode(newNode);
      addEdge(newEdge);

      await reactFlow.setCenter(newNode.position.x, newNode.position.y, {
        zoom: 1,
        duration: 100,
        interpolate: "smooth",
      });
    },
    [addNode, addEdge, reactFlow],
  );

  const enableInputEditing = useCallback(() => {
    if (params.inputRef.current) {
      params.inputRef.current.readOnly = false;
    }
  }, [params.inputRef]);

  const disableInputEditing = useCallback(() => {
    if (params.inputRef.current) {
      params.inputRef.current.readOnly = true;
      params.inputRef.current.blur();
    }
  }, [params.inputRef]);

  const addNodeAbove = useCallback(async () => {
    if (!params.node) return;

    const link = createLinkedNode({
      sourceNode: params.node,
      sourceEdgeSide: "top",
      targetEdgeSide: "bottom",
      yOffset: -defaultOffset,
    });

    await applyChanges({ newNode: link.node, newEdge: link.edge });
  }, [params.node, createLinkedNode, applyChanges]);

  const addNodeBelow = useCallback(async () => {
    if (!params.node) return;

    const link = createLinkedNode({
      sourceNode: params.node,
      sourceEdgeSide: "bottom",
      targetEdgeSide: "top",
      yOffset: defaultOffset,
    });

    await applyChanges({ newNode: link.node, newEdge: link.edge });
  }, [params.node, createLinkedNode, applyChanges]);

  const addNodeLeft = useCallback(async () => {
    if (!params.node) return;

    const link = createLinkedNode({
      sourceNode: params.node,
      sourceEdgeSide: "left",
      targetEdgeSide: "right",
      xOffset: -defaultOffset,
    });

    await applyChanges({ newNode: link.node, newEdge: link.edge });
  }, [params.node, createLinkedNode, applyChanges]);

  const addNodeRight = useCallback(async () => {
    if (!params.node) return;

    const link = createLinkedNode({
      sourceNode: params.node,
      sourceEdgeSide: "right",
      targetEdgeSide: "left",
      xOffset: defaultOffset,
    });

    await applyChanges({ newNode: link.node, newEdge: link.edge });
  }, [params.node, createLinkedNode, applyChanges]);

  const navigateToAboveNode = useCallback(async () => {
    if (!params.node) return;

    console.log(params.node);

    const connectedEdges = getConnectedEdges(
      [params.node],
      reactFlow.getEdges(),
    );

    const connectedEdgesAbove = connectedEdges.filter((connectedEdge) =>
      connectedEdge.sourceHandle!.endsWith("handle-source-top"),
    );

    if (connectedEdgesAbove.length === 0) return;

    const connectedNodesAbove = connectedEdgesAbove.map(
      (connectedEdge) => reactFlow.getNode(connectedEdge.target)!,
    );

    const closestNodeAbove = connectedNodesAbove.reduce(
      (closestNode, currentNode) => {
        const dxCurrent = currentNode.position.x - params.node!.position.x;
        const dyCurrent = currentNode.position.y - params.node!.position.y;
        const currentDistance = Math.sqrt(dxCurrent ** 2 + dyCurrent ** 2);

        const dxClosest = closestNode.position.x - params.node!.position.x;
        const dyClosest = closestNode.position.y - params.node!.position.y;
        const closestDistance = Math.sqrt(dxClosest ** 2 + dyClosest ** 2);

        return currentDistance < closestDistance ? currentNode : closestNode;
      },
      connectedNodesAbove[0],
    );

    reactFlow.setNodes((nodes) =>
      nodes.map((n) => ({ ...n, selected: n.id === closestNodeAbove.id })),
    );

    await reactFlow.setCenter(
      closestNodeAbove.position.x,
      closestNodeAbove.position.y,
      {
        zoom: 1,
        duration: 100,
        interpolate: "smooth",
      },
    );

    console.log(`closest node: ${JSON.stringify(closestNodeAbove)}`);
  }, [params.node, reactFlow]);

  return {
    addNodeAbove,
    addNodeBelow,
    addNodeLeft,
    addNodeRight,
    disableInputEditing,
    enableInputEditing,
    navigateToAboveNode,
  };
};
