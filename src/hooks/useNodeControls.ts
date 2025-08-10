import { NodeHelpers } from "@/lib/NodeHelpers";
import { NodeLayoutEngine } from "@/lib/NodeLayoutEngine";
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

export const useNodeControls = (params: UseNodeControlsParams) => {
  const reactFlow = useReactFlow();
  const cycleIndexRef = useRef<number | undefined>(undefined);

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

  const insertNodeWithEdge = useCallback(
    async ({ newNode, newEdge: newEdge }: { newNode: Node; newEdge: Edge }) => {
      const updatedNodes = [
        ...reactFlow.getNodes().map((n) => ({ ...n, selected: false })),
        newNode,
      ];
      const updatedEdges = [...reactFlow.getEdges(), newEdge];

      const layoutResult = new NodeLayoutEngine().run({
        nodes: updatedNodes,
        edges: updatedEdges,
      });

      reactFlow.setNodes(layoutResult.nodes);
      reactFlow.setEdges(layoutResult.edges);

      const updatedNewNode = layoutResult.nodes.find(
        (n) => n.id === newNode.id,
      );

      await centerViewToNode(updatedNewNode!);
    },
    [centerViewToNode, reactFlow],
  );

  const createNodeRight = useCallback(async () => {
    if (!params.node) return;

    const link = NodeHelpers.createLinkedNode({
      sourceNode: params.node,
      xOffset: params.node.measured!.width! + 200,
      yOffset: 0,
    });

    await insertNodeWithEdge({ newNode: link.node, newEdge: link.edge });
  }, [params.node, insertNodeWithEdge]);

  const navigateToLeftNode = useCallback(async () => {
    if (!params.node) return;

    const edge = reactFlow.getEdges().find((e) => e.target == params.node!.id);
    if (!edge) return;

    const leftNode = reactFlow.getNode(edge.source)!;

    reactFlow.setNodes((nodes) =>
      nodes.map((n) => ({ ...n, selected: n.id === leftNode.id })),
    );

    await centerViewToNode(leftNode);
  }, [params.node, reactFlow, centerViewToNode]);

  const cycleThroughRightNodes = useCallback(async () => {
    if (!params.node) return;

    const connectedEdges = getConnectedEdges(
      [params.node],
      reactFlow.getEdges(),
    );

    const matchingEdges = connectedEdges.filter(
      (edge) =>
        edge.target !== params.node!.id &&
        edge.sourceHandle?.endsWith(`handle-source-right`),
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

      const currentIndex = cycleIndexRef.current ?? -1;
      const nextIndex = (currentIndex + 1) % sortedNodesByDistance.length;

      cycleIndexRef.current = nextIndex;
      const nextNode = sortedNodesByDistance[nextIndex];

      reactFlow.setNodes((nodes) =>
        nodes.map((n) => ({ ...n, selected: n.id === nextNode.id })),
      );

      await centerViewToNode(nextNode);
    } else {
      cycleIndexRef.current = undefined;
      const singleNode = connectedNodes[0];

      reactFlow.setNodes((nodes) =>
        nodes.map((n) => ({ ...n, selected: n.id === singleNode.id })),
      );

      await centerViewToNode(singleNode);
    }
  }, [params.node, reactFlow, centerViewToNode]);

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
      right: createNodeRight,
    },
    navigate: {
      toLeftNode: navigateToLeftNode,
      toRightNode: cycleThroughRightNodes,
    },
  };
};
