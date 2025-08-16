import { CirclePlus, ExternalLink, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useGraphControls } from "@/hooks/useGraphControls";

export const ControlBar = () => {
  const graphControls = useGraphControls();

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
          <Button
            onClick={graphControls.node.addRoot}
            className="cursor-pointer"
            variant={"secondary"}
          >
            <CirclePlus /> Add node
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
