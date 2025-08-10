import { useCallback } from "react";
import { useGraphLayout } from "./useGraphLayout";
import { useGraphMutation } from "./useGraphMutation";
import { useGraphViewport } from "./useGraphViewport";
import type { Node } from "@xyflow/react";
import { useGraphQuery } from "./useGraphQuery";

type UseNodeControlsParams = {
  node?: Node;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

export const useGraphControls = (hookParams: UseNodeControlsParams) => {
  const graphViewport = useGraphViewport();
  const graphMutation = useGraphMutation();
  const graphLayout = useGraphLayout();
  const graphQuery = useGraphQuery();

  const addLink = useCallback(async () => {
    const sourceNode = hookParams.node;

    if (!sourceNode) return;
    const link = graphMutation.createLink({ sourceNode });

    const layoutResult = graphLayout.run({
      nodes: link.updatedNodes,
      edges: link.updatedEdges,
    });

    graphMutation.commit({
      nodes: layoutResult.nodes,
      edges: layoutResult.edges,
    });

    const layoutUpdatedNode = graphQuery.node.findByIdFromList({
      id: link.newNode.id,
      nodes: layoutResult.nodes,
    });

    await graphViewport.centerToNode(layoutUpdatedNode);
  }, [graphLayout, graphMutation, graphViewport, graphQuery, hookParams.node]);

  return {
    mutation: {
      addLink,
    },
  };
};
