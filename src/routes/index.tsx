import TextNode from "@/components/TextNode";
import { useNodeKeyboardControls } from "@/hooks/useNodeKeyboardControls";
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

export const Route = createFileRoute("/")({ component: RouteComponent });

const initialNodes: Node[] = [
  { id: nanoid(), type: "text", position: { x: 0, y: 0 }, data: {} },
];

function RouteComponent() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);
  const nodeKeyboardControls = useNodeKeyboardControls({ setEdges, setNodes });

  const onNodesChange: OnNodesChange = useCallback((changes) => {
    setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot));
  }, []);

  const onEdgesChange: OnEdgesChange = useCallback((changes) => {
    setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot));
  }, []);

  const onConnect: OnConnect = useCallback((params) => {
    setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot));
  }, []);

  const renderedNodes = nodes.map((node) => ({
    ...node,
    data: {
      onEscapeDown: nodeKeyboardControls.onEscapeDown,
      onSpaceDown: nodeKeyboardControls.onSpaceDown,
      onShiftTabDown: () => nodeKeyboardControls.onShiftTabDown(node),
      onTabDown: () => nodeKeyboardControls.onTabDown(node),
      onShiftEnterDown: () => nodeKeyboardControls.onShiftEnterDown(node),
      onEnterDown: () => nodeKeyboardControls.onEnterDown(node),
    },
  }));

  return (
    <>
      <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow
          nodes={renderedNodes}
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
