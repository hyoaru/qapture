import type { Node } from "@xyflow/react";
import { useCallback } from "react";
import { useGraphLayout } from "./useGraphLayout";
import { useGraphMutation } from "./useGraphMutation";
import { useGraphQuery } from "./useGraphQuery";
import { useGraphViewport } from "./useGraphViewport";

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

    const linkResult = graphMutation.node.createLink({ sourceNode });

    const layoutResult = graphLayout.run({
      nodes: linkResult.updatedNodes,
      edges: linkResult.updatedEdges,
    });

    graphMutation.commit({
      nodes: layoutResult.nodes,
      edges: layoutResult.edges,
    });

    const layoutUpdatedNode = graphQuery.node.findByIdFromList({
      id: linkResult.addedNode.id,
      nodes: layoutResult.nodes,
    });

    await graphViewport.centerToNode(layoutUpdatedNode);
    graphViewport.selectNode(layoutUpdatedNode);
  }, [graphLayout, graphMutation, graphViewport, graphQuery, hookParams.node]);

  const deleteNodeAndLinks = useCallback(async () => {
    const sourceNode = hookParams.node;

    if (!sourceNode) return;
    const removeResult = graphMutation.node.remove(sourceNode);

    const layoutResult = graphLayout.run({
      nodes: removeResult.updatedNodes,
      edges: removeResult.updatedEdges,
    });

    graphMutation.commit({
      nodes: layoutResult.nodes,
      edges: layoutResult.edges,
    });
    console.log(removeResult.parentNode);

    if (!removeResult.parentNode) return;

    const layoutUpdatedNode = graphQuery.node.findByIdFromList({
      id: removeResult.parentNode.id,
      nodes: layoutResult.nodes,
    });

    await graphViewport.centerToNode(layoutUpdatedNode);
    graphViewport.selectNode(layoutUpdatedNode);
  }, [graphLayout, graphMutation, graphViewport, graphQuery, hookParams.node]);

  return {
    node: {
      add: addLink,
      delete: deleteNodeAndLinks,
    },
  };
};
