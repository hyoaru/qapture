import { CirclePlus, ExternalLink, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";

export const CanvasControlBar = () => {
  return (
    <>
      <div className="flex w-full items-center justify-between">
        <Button
          size={"icon"}
          variant={"secondary"}
          className="pointer-events-auto"
        >
          <Menu />
        </Button>
        <div className="pointer-events-auto flex items-center gap-1 px-2">
          <Button variant={"secondary"}>
            <CirclePlus /> Add root node
          </Button>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <Button variant={"default"} className="pointer-events-auto">
            <ExternalLink />
            Share
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </>
  );
};
