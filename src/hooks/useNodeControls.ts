import { NodeHelpers } from "@/lib/NodeHelpers";
import {
  getConnectedEdges,
  useReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import { useCallback, useRef } from "react";

type UseNodeControlsParams = {
  node?: Node;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

type Direction = "top" | "bottom" | "left" | "right";

export const useNodeControls = (params: UseNodeControlsParams) => {
  const reactFlow = useReactFlow();
  const directionalIndexRef = useRef<{ [key in Direction]?: number }>({});

  const centerViewToNode = useCallback(
    async (node: Node) => {
      await reactFlow.setCenter(node.position.x, node.position.y, {
        zoom: 1,
        duration: 100,
        interpolate: "smooth",
      });
    },
    [reactFlow],
  );

  const insertNodeWithEdges = useCallback(
    async ({ newNode, newEdges }: { newNode: Node; newEdges: Edge[] }) => {
      reactFlow.setNodes((prevNodes) => [
        ...prevNodes.map((n) => ({ ...n, selected: false })),
        newNode,
      ]);
      reactFlow.setEdges((prevEdges) => [...prevEdges, ...newEdges]);
      await centerViewToNode(newNode);
    },
    [centerViewToNode, reactFlow],
  );

  const createNodeAbove = useCallback(async () => {
    if (!params.node) return;

    const link = NodeHelpers.createLinkedNode({
      sourceNode: params.node,
      sourceEdgeSide: "top",
      targetEdgeSide: "bottom",
      xOffset: (params.node.measured!.width! - 80) / 2,
      yOffset: -200,
    });

    await insertNodeWithEdges({ newNode: link.node, newEdges: link.edges });
  }, [params.node, insertNodeWithEdges]);

  const createNodeBelow = useCallback(async () => {
    if (!params.node) return;

    const link = NodeHelpers.createLinkedNode({
      sourceNode: params.node,
      sourceEdgeSide: "bottom",
      targetEdgeSide: "top",
      xOffset: (params.node.measured!.width! - 80) / 2,
      yOffset: 200,
    });

    await insertNodeWithEdges({ newNode: link.node, newEdges: link.edges });
  }, [params.node, insertNodeWithEdges]);

  const createNodeRight = useCallback(async () => {
    if (!params.node) return;

    const link = NodeHelpers.createLinkedNode({
      sourceNode: params.node,
      sourceEdgeSide: "right",
      targetEdgeSide: "left",
      xOffset: params.node.measured!.width! + 200,
      yOffset: 0,
    });

    await insertNodeWithEdges({ newNode: link.node, newEdges: link.edges });
  }, [params.node, insertNodeWithEdges]);

  const createNodeLeft = useCallback(async () => {
    if (!params.node) return;

    const link = NodeHelpers.createLinkedNode({
      sourceNode: params.node,
      sourceEdgeSide: "left",
      targetEdgeSide: "right",
      xOffset: -(params.node.measured!.width! + 200),
      yOffset: 0,
    });

    await insertNodeWithEdges({ newNode: link.node, newEdges: link.edges });
  }, [params.node, insertNodeWithEdges]);

  const cycleThroughNodesInDirection = useCallback(
    async (direction: Direction) => {
      if (!params.node) return;

      const connectedEdges = getConnectedEdges(
        [params.node],
        reactFlow.getEdges(),
      );

      const matchingEdges = connectedEdges.filter(
        (edge) =>
          edge.target !== params.node!.id &&
          edge.sourceHandle?.endsWith(`handle-source-${direction}`),
      );

      if (matchingEdges.length === 0) return;

      const connectedNodes = matchingEdges
        .map((edge) => reactFlow.getNode(edge.target))
        .filter((n): n is Node => !!n);

      if (connectedNodes.length > 1) {
        const sortedNodesByDistance = NodeHelpers.sortNodesByDistanceEuclidean({
          node: params.node,
          nodes: connectedNodes,
        });

        const currentIndex = directionalIndexRef.current[direction] ?? -1;
        const nextIndex = (currentIndex + 1) % sortedNodesByDistance.length;

        directionalIndexRef.current[direction] = nextIndex;
        const nextNode = sortedNodesByDistance[nextIndex];

        reactFlow.setNodes((nodes) =>
          nodes.map((n) => ({ ...n, selected: n.id === nextNode.id })),
        );

        await centerViewToNode(nextNode);
      } else {
        directionalIndexRef.current[direction] = undefined;
        const singleNode = connectedNodes[0];

        reactFlow.setNodes((nodes) =>
          nodes.map((n) => ({ ...n, selected: n.id === singleNode.id })),
        );

        await centerViewToNode(singleNode);
      }
    },
    [params.node, reactFlow, centerViewToNode],
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

  return {
    input: {
      enableEditing: enableInputEditing,
      disableEditing: disableInputEditing,
    },
    addNode: {
      above: createNodeAbove,
      below: createNodeBelow,
      left: createNodeLeft,
      right: createNodeRight,
    },
    navigate: {
      toAboveNode: () => cycleThroughNodesInDirection("top"),
      toBelowNode: () => cycleThroughNodesInDirection("bottom"),
      toLeftNode: () => cycleThroughNodesInDirection("left"),
      toRightNode: () => cycleThroughNodesInDirection("right"),
    },
  };
};
