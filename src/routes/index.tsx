import TextNode from "@/components/TextNode";
import { createFileRoute } from "@tanstack/react-router";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nanoid } from "nanoid";
import { useCallback, useState } from "react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

const initialNodes: Node[] = [
  {
    id: nanoid(),
    type: "textNode",
    position: { x: 0, y: 0 },
    data: { label: "Node 1" },
  },
  // { id: "n2", position: { x: 0, y: 100 }, data: { label: "Node 2" } },
];
// const initialEdges: Edge[] = [
//   { id: "n1-n2", source: "n1", target: "n2", animated: true },
// ];
//
const nodeTypes = { textNode: TextNode };

function RouteComponent() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);

  const onNodesChange: OnNodesChange = useCallback((changes) => {
    setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot));
  }, []);

  const onEdgesChange: OnEdgesChange = useCallback((changes) => {
    setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot));
  }, []);

  const onConnect: OnConnect = useCallback((params) => {
    setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot));
  }, []);

  return (
    <>
      <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow
          nodes={nodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
            },
          }))}
          edges={edges}
          nodeTypes={nodeTypes}
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
