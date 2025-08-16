import TextNodeHandles from "@/components/TextNodeHandles";
import { Input } from "@/components/ui/input";
import { useGraphControls } from "@/hooks/useGraphControls";
import { useNodeControls } from "@/hooks/useNodeControlsLegacy";
import { cn } from "@/lib/utils";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { CircleOff } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEventHandler } from "react";

export default function TextNode(props: NodeProps<Node>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const node = useReactFlow().getNode(props.id);
  const nodeControls = useNodeControls({ node, inputRef });
  const graphControls = useGraphControls();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (props.selected && inputRef.current) {
      inputRef.current?.focus();
    }
  }, [props.selected, node]);

  if (!node)
    return (
      <div className="relative h-full w-full">
        <div className="pointer-events-none absolute flex h-full w-full items-center justify-center text-sm text-red-400">
          <CircleOff className="h-[1em] w-[1em]" />
        </div>

        <Input
          readOnly
          className="dark:bg-foreground/90 dark:text-background field-sizing-content min-w-20 bg-red-50 text-center"
        />
      </div>
    );

  const onKeyDown: KeyboardEventHandler<HTMLDivElement> = async (event) => {
    if (!props.selected) return;

    switch (event.code) {
      case "Escape":
        event.preventDefault();
        nodeControls.input.disableEditing();
        break;
      case "Backspace":
        if (isEditing) return;
        event.preventDefault();
        await graphControls.node.delete(node);
        break;
      case "Space":
        if (isEditing) return;
        setIsEditing(true);
        event.preventDefault();
        nodeControls.input.enableEditing();
        break;
      case "Tab":
        event.preventDefault();
        await graphControls.node.add(node);
        break;
      case "ArrowLeft":
        if (isEditing) return;
        event.preventDefault();
        nodeControls.navigate.toLeftNode();
        break;
      case "ArrowRight":
        if (isEditing) return;
        event.preventDefault();
        nodeControls.navigate.toRightNode();
        break;
    }
  };

  return (
    <div onClick={() => console.log(props)} onKeyDown={onKeyDown}>
      <Input
        id={"test-input"}
        ref={inputRef}
        readOnly
        onBlur={() => {
          if (inputRef.current) {
            inputRef.current.readOnly = true;
            setIsEditing(false);
          }
        }}
        className={cn(
          "bg-secondary dark:bg-foreground/90 dark:text-background field-sizing-content min-w-20 text-center",
        )}
      />

      <TextNodeHandles nodeId={props.id} />
    </div>
  );
}
