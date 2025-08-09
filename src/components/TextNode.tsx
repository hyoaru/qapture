import TextNodeHandles from "@/components/TextNodeHandles";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { type NodeProps } from "@xyflow/react";
import { useCallback, useRef, type KeyboardEventHandler } from "react";

type TextNodeProps = NodeProps & {
  data: {
    onEnterDown: () => void;
    onShiftEnterDown: () => void;
    onTabDown: () => void;
    onShiftTabDown: () => void;
    onSpaceDown: (inputRef: React.RefObject<HTMLInputElement | null>) => void;
    onEscapeDown: (inputRef: React.RefObject<HTMLInputElement | null>) => void;
  };
};

export default function TextNode(props: TextNodeProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const onKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (!props.selected) return;

      switch (event.code) {
        case "Escape":
          event.preventDefault();
          props.data.onEscapeDown(inputRef);
          break;
        case "Space":
          event.preventDefault();
          props.data.onSpaceDown(inputRef);
          break;
        case "Enter":
          event.preventDefault();
          if (event.shiftKey) {
            props.data.onShiftEnterDown();
          } else {
            props.data.onEnterDown();
          }
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
    [props],
  );

  return (
    <div onKeyDown={onKeyDown} className="bg-background text-foreground">
      <Input
        ref={inputRef}
        tabIndex={-1}
        readOnly
        className={cn(
          "field-sizing-content min-w-20 text-center focus-visible:ring-0 focus-visible:outline-none",
        )}
      />

      <TextNodeHandles nodeId={props.id} />
    </div>
  );
}
