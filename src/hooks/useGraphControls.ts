import { useCallback } from "react";
import type { Node } from "@xyflow/react";
import { useGraphQuery } from "./useGraphQuery";
import { useGraphLayout } from "./useGraphLayout";
import { useGraphMutation } from "./useGraphMutation";
import { useGraphViewport } from "./useGraphViewport";

export const useGraphControls = () => {
  const graphViewport = useGraphViewport();
  const graphMutation = useGraphMutation();
  const graphLayout = useGraphLayout();
  const graphQuery = useGraphQuery();

  const addRootNode = useCallback(async () => {
    const createResult = graphMutation.node.createRoot();

    const layoutResult = graphLayout.run({
      nodes: createResult.updatedNodes,
      edges: createResult.updatedEdges,
    });

    graphMutation.commit({
      nodes: layoutResult.nodes,
      edges: layoutResult.edges,
    });

    const layoutUpdatedNode = graphQuery.node.findByIdFromList({
      id: createResult.addedNode.id,
      nodes: layoutResult.nodes,
    });

    await graphViewport.centerToNode(layoutUpdatedNode);
    graphViewport.selectNode(layoutUpdatedNode);
  }, [graphLayout, graphMutation, graphViewport, graphQuery]);

  const addLink = useCallback(
    async (node: Node) => {
      const sourceNode = node;
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
    },
    [graphLayout, graphMutation, graphViewport, graphQuery],
  );

  const deleteNodeAndLinks = useCallback(
    async (node: Node) => {
      const sourceNode = node;

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

      if (!removeResult.parentNode) return;

      const layoutUpdatedNode = graphQuery.node.findByIdFromList({
        id: removeResult.parentNode.id,
        nodes: layoutResult.nodes,
      });

      await graphViewport.centerToNode(layoutUpdatedNode);
      graphViewport.selectNode(layoutUpdatedNode);
    },
    [graphLayout, graphMutation, graphViewport, graphQuery],
  );

  return {
    node: {
      add: addLink,
      delete: deleteNodeAndLinks,
      addRoot: addRootNode,
    },
  };
};
