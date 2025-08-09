import TextNodeHandles from "@/components/TextNodeHandles";
import { Input } from "@/components/ui/input";
import { useNodeKeyboardControls } from "@/hooks/useNodeKeyboardControls";
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
  const nodeKeyboardControls = useNodeKeyboardControls({ node, inputRef });

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
          nodeKeyboardControls.onEscapeDown();
          break;
        case "Space":
          event.preventDefault();
          nodeKeyboardControls.onSpaceDown();
          break;
        case "Enter":
          event.preventDefault();
          if (event.shiftKey) {
            await nodeKeyboardControls.onShiftEnterDown();
          } else {
            await nodeKeyboardControls.onEnterDown();
          }
          break;
        case "Tab":
          event.preventDefault();
          if (event.shiftKey) {
            await nodeKeyboardControls.onShiftTabDown();
          } else {
            await nodeKeyboardControls.onTabDown();
          }
          break;
      }
    },
    [props, nodeKeyboardControls],
  );

  return (
    <div onKeyDown={onKeyDown} className="bg-background text-foregrounda">
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
