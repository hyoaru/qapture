import TextNode from "@/components/TextNode";
import { createFileRoute } from "@tanstack/react-router";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Node,
  type OnConnect,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nanoid } from "nanoid";
import { useCallback } from "react";

export const Route = createFileRoute("/")({ component: RouteComponent });

const initialNodes: Node[] = [
  { id: nanoid(), type: "text", position: { x: 0, y: 0 }, data: {} },
];

function RouteComponent() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect: OnConnect = useCallback(
    (params) => {
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot));
    },
    [setEdges],
  );

  return (
    <>
      <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={{ text: TextNode }}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={10} size={0.8} />
        </ReactFlow>
      </div>
    </>
  );
}
