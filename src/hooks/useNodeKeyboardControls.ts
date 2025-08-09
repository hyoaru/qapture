import { useReactFlow, type Edge, type Node } from "@xyflow/react";
import { nanoid } from "nanoid";
import { useCallback } from "react";

type UseNodeKeyboardControlsParams = {
  node?: Node;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

export const useNodeKeyboardControls = ({
  node,
  inputRef,
}: UseNodeKeyboardControlsParams) => {
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

  const onSpaceDown = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.readOnly = false;
    }
  }, [inputRef]);

  const onEscapeDown = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.readOnly = true;
      inputRef.current.blur();
    }
  }, [inputRef]);

  const onShiftEnterDown = useCallback(async () => {
    if (!node) return;

    const link = createLinkedNode({
      sourceNode: node,
      sourceEdgeSide: "top",
      targetEdgeSide: "bottom",
      yOffset: -defaultOffset,
    });

    await applyChanges({ newNode: link.node, newEdge: link.edge });
  }, [node, createLinkedNode, applyChanges]);

  const onEnterDown = useCallback(async () => {
    if (!node) return;

    const link = createLinkedNode({
      sourceNode: node,
      sourceEdgeSide: "bottom",
      targetEdgeSide: "top",
      yOffset: defaultOffset,
    });

    await applyChanges({ newNode: link.node, newEdge: link.edge });
  }, [node, createLinkedNode, applyChanges]);

  const onShiftTabDown = useCallback(async () => {
    if (!node) return;

    const link = createLinkedNode({
      sourceNode: node,
      sourceEdgeSide: "left",
      targetEdgeSide: "right",
      xOffset: -defaultOffset,
    });

    await applyChanges({ newNode: link.node, newEdge: link.edge });
  }, [node, createLinkedNode, applyChanges]);

  const onTabDown = useCallback(async () => {
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
    onShiftEnterDown,
    onEnterDown,
    onShiftTabDown,
    onTabDown,
    onEscapeDown,
    onSpaceDown,
  };
};
