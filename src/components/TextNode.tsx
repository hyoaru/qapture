import TextNodeHandles from "@/components/TextNodeHandles";
import { Input } from "@/components/ui/input";
import { useNodeControls } from "@/hooks/useNodeControls";
import { cn } from "@/lib/utils";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import {
  useCallback,
  useEffect,
  useRef,
  type KeyboardEventHandler,
} from "react";

export default function TextNode(props: NodeProps<Node>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const node = useReactFlow().getNode(props.id);
  const nodeControls = useNodeControls({ node, inputRef });

  useEffect(() => {
    if (props.selected && inputRef.current) {
      inputRef.current?.focus();
    }
  }, [props.selected, node]);

  const onKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback(
    async (event) => {
      if (!props.selected) return;

      switch (event.code) {
        case "Escape":
          event.preventDefault();
          nodeControls.input.disableEditing();
          break;
        case "Space":
          event.preventDefault();
          nodeControls.input.enableEditing();
          break;
        case "Tab":
          event.preventDefault();
          await nodeControls.addNode.right();
          break;
        case "ArrowLeft":
          event.preventDefault();
          nodeControls.navigate.toLeftNode();
          break;
        case "ArrowRight":
          event.preventDefault();
          nodeControls.navigate.toRightNode();
          break;
      }
    },
    [props, nodeControls],
  );

  return (
    <div
      onClick={() => {
        console.log(props);
      }}
      onKeyDown={onKeyDown}
      className="bg-background text-foregrounda"
    >
      <Input
        id={"test-input"}
        ref={inputRef}
        readOnly
        className={cn("field-sizing-content min-w-20 text-center ")}
      />

      <TextNodeHandles nodeId={props.id} />
    </div>
  );
}
