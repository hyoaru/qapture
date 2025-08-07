import { Handle, Position } from "@xyflow/react";

type TextNodeHandlesProps = {
  nodeId: string;
};

export default function TextNodeHandles(props: TextNodeHandlesProps) {
  return (
    <>
      <Handle
        type="source"
        position={Position.Top}
        id={`${props.nodeId}-handle-source-top`}
      />
      <Handle
        type="target"
        position={Position.Top}
        id={`${props.nodeId}-handle-target-top`}
      />

      <Handle
        type="source"
        position={Position.Bottom}
        id={`${props.nodeId}-handle-source-bottom`}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id={`${props.nodeId}-handle-target-bottom`}
      />

      <Handle
        type="source"
        position={Position.Left}
        id={`${props.nodeId}-handle-source-left`}
      />
      <Handle
        type="target"
        position={Position.Left}
        id={`${props.nodeId}-handle-target-left`}
      />

      <Handle
        type="source"
        position={Position.Right}
        id={`${props.nodeId}-handle-source-right`}
      />
      <Handle
        type="target"
        position={Position.Right}
        id={`${props.nodeId}-handle-target-right`}
      />
    </>
  );
}
