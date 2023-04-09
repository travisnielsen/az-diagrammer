import { Canvas, NodeProps, CanvasRef, NodeData, EdgeProps } from 'reaflow';
import prepareNode from './nodes'
import prepareEdge from './edges'
import { nodeData, edgeData } from './data'
import './App.css';
import { useCallback, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { notStrictEqual } from 'assert';
import { backgroundColors } from 'dracula-ui';

function App() {

  const nodes = nodeData();
  const edges = edgeData(); 

  const nodeIsNonEmptyContainer = (node: NodeData) => {
    let hasChildNodes = false
    if (node.data.type == "container") {
      hasChildNodes = nodes.findIndex(n =>  n.parent === node.id) > 0
      return hasChildNodes
    }

    return false
  }
    
  // remove unconnected items
  const edgeIdsFrom = edges.map(e => e.from)
  const edgeIdsTo = edges.map(e => e.to)
  const edgeIds = [...new Set([...edgeIdsFrom, ...edgeIdsTo])]
  const nodesFiltered = nodes
    .filter(n => edgeIds.includes(n.id) || n.data.type === "container" || n.parent != null)
    .filter(n => n.data.type == "service" || (n.data.type === "container" && nodeIsNonEmptyContainer(n) ) )

  // remove edges that don't have valid targets
  const edgesFiltered = edges
    .filter(e => nodesFiltered.findIndex(n => n.id === e.to) > 0)
    .filter(e => nodesFiltered.findIndex(n => n.id === e.from) > 0)

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
      <TransformWrapper wheel={{ step: 0.2 }} minScale={0.5} maxScale={8} limitToBounds={false} >
        <TransformComponent wrapperStyle={{ backgroundColor: 'black' }} >
          <div style={{ background: 'black' }}>
            <Canvas
              maxHeight={6000}
              maxWidth={4000}
              layoutOptions={{
                'elk.hierarchyHandling': 'INCLUDE_CHILDREN',        // required to enable edges from/to nested nodes
                'elk.nodeLabels.placement': 'INSIDE V_TOP H_RIGHT'
              }}
              direction='RIGHT'
              nodes={nodesFiltered}
              edges={edgesFiltered}
              fit={true}
              node={(node: NodeProps) => prepareNode(node)}
              edge={(edge: EdgeProps) => prepareEdge(edge)}
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