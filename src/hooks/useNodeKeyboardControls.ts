import { useReactFlow, type Edge, type Node } from "@xyflow/react";
import { nanoid } from "nanoid";
import { useCallback } from "react";

type UseNodeKeyboardControlsParams = {
  node: Node;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

export const useNodeKeyboardControls = (
  params: UseNodeKeyboardControlsParams,
) => {
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
      const newNode = {
        id: nanoid(),
        type: "text",
        position: {
          x: sourceNode.position.x + xOffset,
          y: sourceNode.position.y + yOffset,
        },
        data: {},
        selected: true,
      };

      const newEdge = {
        id: `${sourceNode.id}-${newNode.id}`,
        animated: true,
        source: sourceNode.id,
        target: newNode.id,
        sourceHandle: `${sourceNode.id}-handle-source-${sourceEdgeSide}`,
        targetHandle: `${newNode.id}-handle-target-${targetEdgeSide}`,
      };

      return {
        node: newNode,
        edge: newEdge,
      };
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
    if (params.inputRef.current) {
      params.inputRef.current.readOnly = false;
      params.inputRef.current.focus();
    }
  }, [params.inputRef]);

  const onEscapeDown = useCallback(() => {
    if (params.inputRef.current) {
      params.inputRef.current.readOnly = true;
    }
  }, [params.inputRef]);

  const onShiftEnterDown = useCallback(async () => {
    const link = createLinkedNode({
      sourceNode: params.node,
      sourceEdgeSide: "top",
      targetEdgeSide: "bottom",
      yOffset: -defaultOffset,
    });

    await applyChanges({ newNode: link.node, newEdge: link.edge });
  }, [applyChanges, createLinkedNode, params.node]);

  const onEnterDown = useCallback(async () => {
    const link = createLinkedNode({
      sourceNode: params.node,
      sourceEdgeSide: "bottom",
      targetEdgeSide: "top",
      yOffset: defaultOffset,
    });

    await applyChanges({ newNode: link.node, newEdge: link.edge });
  }, [applyChanges, createLinkedNode, params.node]);

  const onShiftTabDown = useCallback(async () => {
    const link = createLinkedNode({
      sourceNode: params.node,
      sourceEdgeSide: "left",
      targetEdgeSide: "right",
      xOffset: -defaultOffset,
    });

    await applyChanges({ newNode: link.node, newEdge: link.edge });
  }, [applyChanges, createLinkedNode, params.node]);

  const onTabDown = useCallback(async () => {
    const link = createLinkedNode({
      sourceNode: params.node,
      sourceEdgeSide: "right",
      targetEdgeSide: "left",
      xOffset: defaultOffset,
    });

    await applyChanges({ newNode: link.node, newEdge: link.edge });
  }, [applyChanges, createLinkedNode, params.node]);

  return {
    onShiftEnterDown,
    onEnterDown,
    onShiftTabDown,
    onTabDown,
    onEscapeDown,
    onSpaceDown,
  };
};
