import { type Edge, type Node } from "@xyflow/react";
import { nanoid } from "nanoid";
import { useCallback } from "react";

type UseNodeKeyboardControlsParams = {
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
};

export const useNodeKeyboardControls = ({
  setEdges,
  setNodes,
}: UseNodeKeyboardControlsParams) => {
  const defaultOffset = 200;

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
    (node: Node & { selected: boolean }) => {
      setNodes((prevNodes) =>
        prevNodes.map((n) => ({ ...n, selected: false })).concat(node),
      );
    },
    [setNodes],
  );

  const addEdge = useCallback(
    (edge: Edge) => {
      setEdges((prevEdges) => [...prevEdges, edge]);
    },
    [setEdges],
  );

  const onSpaceDown = useCallback(
    (inputRef: React.RefObject<HTMLInputElement | null>) => {
      if (inputRef.current) {
        inputRef.current.readOnly = false;
        inputRef.current.focus();
      }
    },
    [],
  );

  const onEscapeDown = useCallback(
    (inputRef: React.RefObject<HTMLInputElement | null>) => {
      if (inputRef.current) {
        inputRef.current.readOnly = true;
      }
    },
    [],
  );

  const onShiftEnterDown = useCallback(
    (sourceNode: Node) => {
      const link = createLinkedNode({
        sourceNode: sourceNode,
        sourceEdgeSide: "top",
        targetEdgeSide: "bottom",
        yOffset: -defaultOffset,
      });

      addEdge(link.edge);
      addNode(link.node);
    },
    [addEdge, addNode, createLinkedNode],
  );

  const onEnterDown = useCallback(
    (sourceNode: Node) => {
      const link = createLinkedNode({
        sourceNode: sourceNode,
        sourceEdgeSide: "bottom",
        targetEdgeSide: "top",
        yOffset: defaultOffset,
      });

      addEdge(link.edge);
      addNode(link.node);
    },
    [addEdge, addNode, createLinkedNode],
  );

  const onShiftTabDown = useCallback(
    (sourceNode: Node) => {
      const link = createLinkedNode({
        sourceNode: sourceNode,
        sourceEdgeSide: "left",
        targetEdgeSide: "right",
        xOffset: -defaultOffset,
      });

      addEdge(link.edge);
      addNode(link.node);
    },
    [addEdge, addNode, createLinkedNode],
  );

  const onTabDown = useCallback(
    (sourceNode: Node) => {
      const link = createLinkedNode({
        sourceNode: sourceNode,
        sourceEdgeSide: "right",
        targetEdgeSide: "left",
        xOffset: defaultOffset,
      });

      addEdge(link.edge);
      addNode(link.node);
    },
    [addEdge, addNode, createLinkedNode],
  );

  return {
    onShiftEnterDown,
    onEnterDown,
    onShiftTabDown,
    onTabDown,
    onEscapeDown,
    onSpaceDown,
  };
};
