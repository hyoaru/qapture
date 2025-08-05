import { createFileRoute } from "@tanstack/react-router";

import { useState, useCallback, type KeyboardEventHandler } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type OnSelectionChangeFunc,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nanoid } from "nanoid";
import TextNode from "@/components/TextNode";
import { layoutGraph } from "@/lib/layout";

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

  const onSelectionChange: OnSelectionChangeFunc = useCallback((changes) => {
    console.log(changes);
  }, []);

  const onTabDown = useCallback(
    (sourceNodeId: string) => {
      setNodes((prevNodes) => {
        const sourceNode = prevNodes.find((n) => n.id === sourceNodeId);
        if (!sourceNode) return prevNodes;

        const newNodeId = nanoid();
        const newNode = {
          id: newNodeId,
          type: "textNode",
          position: { x: 0, y: 0 }, // dummy, will be updated
          data: { label: "" },
        };

        const newNodes = [...prevNodes, newNode];
        const newEdges = [
          ...edges,
          {
            id: `${sourceNodeId}-${newNodeId}`,
            source: sourceNodeId,
            sourceHandle: "handle-right-source",
            target: newNodeId,
            targetHandle: "handle-left-target",
          },
        ];

        layoutGraph(newNodes, newEdges).then(({ nodes: layoutedNodes }) => {
          setNodes(layoutedNodes);
        });

        setEdges(newEdges);
        return newNodes;
      });
    },
    [edges],
  );

  return (
    <>
      <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow
          nodes={nodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              onTabDown: () => onTabDown(node.id),
            },
          }))}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onSelectionChange={onSelectionChange}
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
