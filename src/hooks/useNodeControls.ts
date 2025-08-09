import { useReactFlow, type Edge, type Node } from "@xyflow/react";
import { nanoid } from "nanoid";
import { useCallback } from "react";

type UseNodeControlsParams = {
  node?: Node;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

export const useNodeControls = ({ node, inputRef }: UseNodeControlsParams) => {
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
    if (inputRef.current) {
      inputRef.current.readOnly = false;
    }
  }, [inputRef]);

  const disableInputEditing = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.readOnly = true;
      inputRef.current.blur();
    }
  }, [inputRef]);

  const addNodeAbove = useCallback(async () => {
    if (!node) return;

    const link = createLinkedNode({
      sourceNode: node,
      sourceEdgeSide: "top",
      targetEdgeSide: "bottom",
      yOffset: -defaultOffset,
    });

    await applyChanges({ newNode: link.node, newEdge: link.edge });
  }, [node, createLinkedNode, applyChanges]);

  const addNodeBelow = useCallback(async () => {
    if (!node) return;

    const link = createLinkedNode({
      sourceNode: node,
      sourceEdgeSide: "bottom",
      targetEdgeSide: "top",
      yOffset: defaultOffset,
    });

    await applyChanges({ newNode: link.node, newEdge: link.edge });
  }, [node, createLinkedNode, applyChanges]);

  const addNodeLeft = useCallback(async () => {
    if (!node) return;

    const link = createLinkedNode({
      sourceNode: node,
      sourceEdgeSide: "left",
      targetEdgeSide: "right",
      xOffset: -defaultOffset,
    });

    await applyChanges({ newNode: link.node, newEdge: link.edge });
  }, [node, createLinkedNode, applyChanges]);

  const addNodeRight = useCallback(async () => {
    if (!node) return;

    const link = createLinkedNode({
      sourceNode: node,
      sourceEdgeSide: "right",
      targetEdgeSide: "left",
      xOffset: defaultOffset,
    });

    await applyChanges({ newNode: link.node, newEdge: link.edge });
  }, [node, createLinkedNode, applyChanges]);

  return {
    addNodeAbove: addNodeAbove,
    addNodeBelow: addNodeBelow,
    addNodeLeft: addNodeLeft,
    addNodeRight: addNodeRight,
    disableInputEditing: disableInputEditing,
    enableInputEditing: enableInputEditing,
  };
};
