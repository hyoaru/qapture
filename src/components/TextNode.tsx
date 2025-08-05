import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import {
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEventHandler,
} from "react";

type TextNodeProps = {
  data: NodeProps & {
    onTabDown: () => void;
    onShiftTabDown: () => void;
    onEnterDown: () => void;
    onShiftEnterDown: () => void;
  };
};

export default function TextNode(props: TextNodeProps) {
  const [isSelected, setIsSelected] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    console.log(evt.target.value);
  }, []);

  const onContainerClick = useCallback(() => {
    setIsSelected(true);
  }, []);

  const onSpaceDown = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.readOnly = false;
      inputRef.current.focus();
    }
  }, []);

  const onEscapeDown = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.readOnly = true;
      setIsSelected(false);
    }
  }, []);

  const onKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (!isSelected) return;

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
            props.data.onShiftTabDown();
          } else {
            props.data.onTabDown();
          }
          break;
      }
    },
    [isSelected, onSpaceDown, onEscapeDown, props.data],
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
        onChange={onChange}
        tabIndex={-1}
        readOnly
      />

      <TextNodeHandles />
    </div>
  );
}

function TextNodeHandles() {
  return (
    <>
      <Handle type="source" position={Position.Top} id="handle-top-source" />
      <Handle type="target" position={Position.Top} id="handle-top-target" />

      <Handle
        type="source"
        position={Position.Bottom}
        id="handle-bottom-source"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="handle-bottom-target"
      />

      <Handle type="source" position={Position.Left} id="handle-left-source" />
      <Handle type="target" position={Position.Left} id="handle-left-target" />

      <Handle
        type="source"
        position={Position.Right}
        id="handle-right-source"
      />
      <Handle
        type="target"
        position={Position.Right}
        id="handle-right-target"
      />
    </>
  );
}
