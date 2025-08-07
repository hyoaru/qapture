import TextNodeHandles from "@/components/TextNodeHandles";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useReactFlow, type NodeProps } from "@xyflow/react";
import { nanoid } from "nanoid";
import { useCallback, useRef, type KeyboardEventHandler } from "react";

type TextNodeProps = NodeProps & {
  data: {
    onEnterDown: () => void;
    onShiftEnterDown: () => void;
  };
};

export default function TextNode(props: TextNodeProps) {
  const reactFlow = useReactFlow();
  const inputRef = useRef<HTMLInputElement>(null);

  const onSelect = useCallback(() => {
    reactFlow.setNodes((prevNodes) =>
      prevNodes.map((prevNode) => ({
        ...prevNode,
        selected: prevNode.id == props.id,
      })),
    );
  }, [reactFlow, props.id]);

  const onContainerClick = useCallback(() => {
    onSelect();
  }, [onSelect]);

  const onTabDown = useCallback(() => {
    const newNode = {
      id: nanoid(),
      type: "textNode",
      position: {
        x: props.positionAbsoluteX + 200,
        y: props.positionAbsoluteY,
      },
      data: {},
    };

    const newEdge = {
      id: `${props.id}-${newNode.id}`,
      source: props.id,
      target: newNode.id,
      sourceHandle: `${props.id}-handle-source-right`,
      targetHandle: `${newNode.id}-handle-target-left`,
    };

    reactFlow.setEdges((prevEdges) => [...prevEdges, newEdge]);
    reactFlow.setNodes((prevNodes) => {
      return [...prevNodes, newNode];
    });
  }, [props, reactFlow]);

  const onSpaceDown = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.readOnly = false;
      inputRef.current.focus();
    }
  }, []);

  const onEscapeDown = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.readOnly = true;
    }
  }, []);

  const onKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (!props.selected) return;

      switch (event.code) {
        case "Space":
          event.preventDefault();
          onSpaceDown();
          break;
        case "Escape":
          event.preventDefault();
          onEscapeDown();
          break;
        case "Tab":
          event.preventDefault();
          if (event.shiftKey) {
            console.log("shift tab");
          } else {
            onTabDown();
          }
          break;
      }
    },
    [props.selected, onSpaceDown, onEscapeDown, onTabDown],
  );

  return (
    <div
      onClick={onContainerClick}
      onKeyDown={onKeyDown}
      className="bg-background text-foreground"
    >
      <Input
        ref={inputRef}
        className={cn(
          "field-sizing-content min-w-20 text-center focus-visible:ring-0 focus-visible:outline-none",
        )}
        tabIndex={-1}
        readOnly
      />

      <TextNodeHandles nodeId={props.id} />
    </div>
  );
}
