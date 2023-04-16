import { Canvas, NodeProps, CanvasRef, NodeData, EdgeData, EdgeProps } from 'reaflow';
import PrepareNode from './nodes'
import PrepareEdge from './edges'
import { getNodeData, getEdgeData } from './data'
import './App.css';
import { useCallback, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { backgroundColors } from 'dracula-ui';

function App() {

  const [nodeData, edgeData] = loadCanvasData();
  const [nodes, setNodes] = useState(nodeData);
  const [edges, setEdges] = useState(edgeData);

  function handleNodeUpdate (nodes: NodeData[], edges: EdgeData[]) {
    setNodes(nodes);
    setEdges(edges);

  }

  // TODO: Look at this for canvas re-sizing: https://github.com/reaviz/reaflow/issues/111
  // TODO: Also see: https://github.com/reaviz/reaflow/issues/190
  const canvasRef = useRef<CanvasRef>(null);
  const [paneWidth, setPaneWidth] = useState(2000);
  const [paneHeight, setPaneHeight] = useState(4000)

  const calculatePaneWidthAndHeight = useCallback(() => {
      let newHeight = 0;
      let newWidth = 0;
      canvasRef?.current?.layout?.children?.forEach((node) => {
        if (node.y + node.height > newHeight) newHeight = node.y + node.height;
        if (node.x + node.width > newWidth) newWidth = node.x + node.width;
      });
      setPaneHeight(newHeight);
      setPaneWidth(newWidth);
  },[]);


  return (
    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, background: 'black' }}>
      <TransformWrapper wheel={{ step: 0.2 }} minScale={0.2} maxScale={8} limitToBounds={false} >
        <TransformComponent wrapperStyle={{ backgroundColor: 'black' }} >
          <div style={{ background: 'black' }}>
            <Canvas
              ref={canvasRef}
              maxHeight={10000}
              maxWidth={4000}
              layoutOptions={{
                'elk.hierarchyHandling': 'INCLUDE_CHILDREN',        // required to enable edges from/to nested nodes
                'elk.nodeLabels.placement': 'INSIDE V_TOP H_RIGHT'
              }}
              direction='RIGHT'
              nodes={nodes}
              edges={edges}
              fit={true}
              node={(node: NodeProps) => PrepareNode(node, nodes, edges, handleNodeUpdate )}
              edge={(edge: EdgeProps) => PrepareEdge(edge)}
              onLayoutChange={() => {
                calculatePaneWidthAndHeight()
              }}
            />
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}
export default App;


export const loadCanvasData = () => {

  const nodeData = getNodeData();
  const edgeData = getEdgeData(); 

  const nodeIsNonEmptyContainer = (node: NodeData) => {
    let hasChildNodes = false
    if (node.data.type == "container") {
      hasChildNodes = nodeData.findIndex(n =>  n.parent === node.id) > 0
      return hasChildNodes
    }

    return false
  }
    
  // remove unconnected items
  const edgeIdsFrom = edgeData.map(e => e.from)
  const edgeIdsTo = edgeData.map(e => e.to)
  const edgeIds = [...new Set([...edgeIdsFrom, ...edgeIdsTo])]
  const nodesFiltered = nodeData
    .filter(n => edgeIds.includes(n.id) || n.data.type === "container" || n.parent != null)
    .filter(n => n.data.type == "service" || (n.data.type === "container" && nodeIsNonEmptyContainer(n) ) )

  // remove edges that don't have valid targets
  const edgesFiltered = edgeData
    .filter(e => nodesFiltered.findIndex(n => n.id === e.to) > 0)
    .filter(e => nodesFiltered.findIndex(n => n.id === e.from) > 0)

  return [nodesFiltered, edgesFiltered]
}