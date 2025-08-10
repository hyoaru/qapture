import type { Node } from "@xyflow/react";
import { useCallback } from "react";

type FindNodeByIdFromListParams = {
  id: string;
  nodes: Node[];
};
export const useGraphQuery = () => {
  const findNodeByIdFromList = useCallback(
    (params: FindNodeByIdFromListParams) => {
      const node = params.nodes.find((n) => n.id == params.id);
      if (!node) throw new Error(`Node with id "${params.id}" not found`);
      return node;
    },
    [],
  );

  return {
    node: {
      findByIdFromList: findNodeByIdFromList,
    },
  };
};
