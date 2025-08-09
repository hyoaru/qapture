import { NodeHelpers } from "@/lib/NodeHelpers";
import {
  getConnectedEdges,
  useReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import { useCallback } from "react";

type UseNodeControlsParams = {
  node?: Node;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

type Direction = "top" | "bottom" | "left" | "right";

type DirectionalNodeCreationConfig = {
  sourceEdgeSide: string;
  targetEdgeSide: string;
  xOffset: number;
  yOffset: number;
};

const nodeCreationDirectionConfig: Record<
  Direction,
  DirectionalNodeCreationConfig
> = {
  top: {
    sourceEdgeSide: "top",
    targetEdgeSide: "bottom",
    xOffset: 0,
    yOffset: -200,
  },
  bottom: {
    sourceEdgeSide: "bottom",
    targetEdgeSide: "top",
    xOffset: 0,
    yOffset: 200,
  },
  left: {
    sourceEdgeSide: "left",
    targetEdgeSide: "right",
    xOffset: -200,
    yOffset: 0,
  },
  right: {
    sourceEdgeSide: "right",
    targetEdgeSide: "left",
    xOffset: 200,
    yOffset: 0,
  },
};

export const useNodeControls = (params: UseNodeControlsParams) => {
  const reactFlow = useReactFlow();

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

  const createNodeInDirection = useCallback(
    async (direction: Direction) => {
      if (!params.node) return;

      const config = nodeCreationDirectionConfig[direction];

      const link = NodeHelpers.createLinkedNode({
        sourceNode: params.node,
        ...config,
      });

      await insertNodeWithEdges({ newNode: link.node, newEdges: link.edges });
    },
    [params.node, insertNodeWithEdges],
  );

  const navigateToClosestNodeInDirection = useCallback(
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

      const closestNode = NodeHelpers.getClosestNodeEuclidean({
        node: params.node,
        nodes: connectedNodes,
      });

      reactFlow.setNodes((nodes) =>
        nodes.map((n) => ({ ...n, selected: n.id === closestNode.id })),
      );

      await centerViewToNode(closestNode);
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
      above: () => createNodeInDirection("top"),
      below: () => createNodeInDirection("bottom"),
      left: () => createNodeInDirection("left"),
      right: () => createNodeInDirection("right"),
    },
    navigate: {
      toAboveNode: () => navigateToClosestNodeInDirection("top"),
      toBelowNode: () => navigateToClosestNodeInDirection("bottom"),
      toLeftNode: () => navigateToClosestNodeInDirection("left"),
      toRightNode: () => navigateToClosestNodeInDirection("right"),
    },
  };
};
