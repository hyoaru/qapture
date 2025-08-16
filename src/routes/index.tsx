import { ControlBar } from "@/components/ControlBar";
import TextNode from "@/components/TextNode";
import { useGraphLayout } from "@/hooks/useGraphLayout";
import { useTheme } from "@/providers/theme-provider";
import { createFileRoute } from "@tanstack/react-router";
import {
  addEdge,
  Background,
  BackgroundVariant,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nanoid } from "nanoid";
import { useCallback, useRef } from "react";

export const Route = createFileRoute("/")({ component: RouteComponent });

const initialNodes: Node[] = [
  {
    id: nanoid(),
    type: "text",
    position: { x: 0, y: 0 },
    data: {},
    selected: true,
  },
];

function RouteComponent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);
  const reactFlow = useRef<ReactFlowInstance | null>(null);
  const themeContext = useTheme();
  const graphLayout = useGraphLayout();

  const onConnect = useCallback(
    (params: Connection) => {
      const updatedEdges = addEdge({ ...params, animated: true }, edges);

      const updateLayout = graphLayout.run({
        nodes: nodes,
        edges: updatedEdges,
      });

      setNodes(updateLayout.nodes);
      setEdges(updateLayout.edges);

      if (!reactFlow.current) throw new Error("Instance does not exist");

      const targetNode = updateLayout.nodes.find((n) => n.id == params.target);
      if (!targetNode) throw new Error("Target node does not exist");

      reactFlow.current.setCenter(
        targetNode.position.x,
        targetNode.position.y,
        {
          zoom: 1,
          duration: 100,
          interpolate: "smooth",
        },
      );
    },
    [setEdges, setNodes, edges, nodes, graphLayout],
  );

  return (
    <>
      <div className="relative h-[100vh] w-[100vw]">
        <ReactFlow
          onInit={(instance: ReactFlowInstance) =>
            (reactFlow.current = instance)
          }
          nodes={nodes}
          edges={edges}
          nodesDraggable={false}
          nodesConnectable={true}
          nodeTypes={{ text: TextNode }}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          proOptions={{ hideAttribution: true }}
          fitView
        >
          <div className="pointer-events-none absolute z-10 h-full w-full p-4">
            <ControlBar />
          </div>

          {themeContext.theme === "light" && (
            <Background variant={BackgroundVariant.Dots} gap={10} size={0.8} />
          )}
        </ReactFlow>
      </div>
    </>
  );
}
