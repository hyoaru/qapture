import { Handle, Position } from "@xyflow/react";

type TextNodeHandlesProps = {
  nodeId: string;
};

export default function TextNodeHandles(props: TextNodeHandlesProps) {
  return (
    <>
      <Handle
        type="source"
        position={Position.Right}
        id={`${props.nodeId}-handle-source-right`}
      />
      <Handle
        type="target"
        position={Position.Left}
        id={`${props.nodeId}-handle-target-left`}
      />
    </>
  );
}
