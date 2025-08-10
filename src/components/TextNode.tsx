import TextNodeHandles from "@/components/TextNodeHandles";
import { Input } from "@/components/ui/input";
import { useNodeControls } from "@/hooks/useNodeControls";
import { cn } from "@/lib/utils";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEventHandler,
} from "react";

export default function TextNode(props: NodeProps<Node>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const node = useReactFlow().getNode(props.id);
  const nodeControls = useNodeControls({ node, inputRef });
  const [isEditing, setIsEditing] = useState(false);

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
        case "Backspace":
          event.preventDefault();
          nodeControls.deleteNode();
          break;
        case "Space":
          if (isEditing) return;
          setIsEditing(true);
          event.preventDefault();
          nodeControls.input.enableEditing();
          break;
        case "Tab":
          event.preventDefault();
          await nodeControls.addNode();
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
    },
    [props, nodeControls, isEditing],
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
        onBlur={() => {
          if (inputRef.current) {
            inputRef.current.readOnly = true;
            setIsEditing(false);
          }
        }}
        className={cn("field-sizing-content min-w-20 text-center ")}
      />

      <TextNodeHandles nodeId={props.id} />
    </div>
  );
}
