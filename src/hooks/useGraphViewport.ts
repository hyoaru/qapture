import { useReactFlow, type Node } from "@xyflow/react";
import { useCallback } from "react";

export const useGraphViewport = () => {
  const reactFlow = useReactFlow();

  const centerToNode = useCallback(
    async (node: Node) => {
      await reactFlow.setCenter(node.position.x, node.position.y, {
        zoom: 1,
        duration: 100,
        interpolate: "smooth",
      });
    },
    [reactFlow],
  );

  return {
    centerToNode,
  };
};
