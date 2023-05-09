import { Canvas, NodeProps, CanvasRef, NodeData, EdgeData, EdgeProps, ElkRoot } from 'reaflow';
import Nodes from './Nodes'
import PrepareEdge from './Edges'
import { getNodeData, getEdgeData } from '../data/data'
import { useEffect, useRef } from 'react';
import { setVisibleNodes, setHiddenNodes, setVisibleEdges, setHiddenEdges } from '../features/diagramSlice'
import { setPaneHeight, setPaneWidth } from '../features/canvasSlice';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useAppSelector, useAppDispatch } from '../hooks'
import '../App.css'

let selectedNodeId = '';

const Diagram: React.FC = () => {
  const canvasRef = useRef<CanvasRef>(null);
  const dispatch = useAppDispatch()
  const [paneWidth, paneHeight] = useAppSelector((state: any) => [state.canvas.value.paneWidth, state.canvas.value.paneHeight])
  const [nodes, edges] = useAppSelector((state) => [state.diagram.value.visibleNodes, state.diagram.value.visibleEdges])

  function handleNodeUpdate(nodes: NodeData[], edges: EdgeData[], nodeId: string) {
    selectedNodeId = nodeId;
    dispatch(setVisibleNodes(nodes))
    dispatch(setVisibleEdges(edges))
    centerOnSelectedNode(nodeId);
  }

  // TOTO: This needs research.  It's not working as expected.
  function centerOnSelectedNode(nodeId: string) {

    const canvasWidth = canvasRef?.current?.canvasWidth;
    const canvasHeight = canvasRef?.current?.canvasHeight;

    if (canvasWidth && canvasHeight) {

      const canvasItem = canvasRef.current?.layout.children?.find((item) => item.id === nodeId);
      const { x, y, width, height } = canvasItem;
      const canvasCenterX = canvasWidth / 2;
      const canvasCenterY = canvasHeight / 2;
      const canvasItemCenterX = x + (width / 2);
      const canvasItemCenterY = y + (height / 2);
      // const offsetX = canvasCenterX - canvasItemCenterX;
      // const offsetY = canvasCenterY - canvasItemCenterY;

      if (canvasRef?.current?.setScrollXY) {
        canvasRef?.current?.setScrollXY([x, y]);
      }

    }
  }
  
  // TODO: Look at this for canvas re-sizing: https://github.com/reaviz/reaflow/issues/111
  // TODO: Also see: https://github.com/reaviz/reaflow/issues/190
  // TODO: https://github.com/reaviz/reaflow/issues/190
  // TODO: For centering on node: https://github.com/reaviz/reaflow/issues/64
  function handleLayoutChange(layout: ElkRoot) {

    let newHeight = 0;
    let newWidth = 0;
    layout.children?.forEach((node) => {
      if (node.y + node.height > newHeight) newHeight = node.y + node.height;
      if (node.x + node.width > newWidth) newWidth = node.x + node.width;
    });

    // keep a minimum pane size
    if (newHeight < 1000) newHeight = 2000;
    if (newWidth < 1000) newWidth = 2000;

    dispatch(setPaneHeight(newHeight / 2))
    dispatch(setPaneWidth(newWidth / 1.5))
  }

  return (
    <div className='canvas-container'>
      <TransformWrapper wheel={{ step: 0.2 }} minScale={0.2} maxScale={8} limitToBounds={false} centerOnInit={true} >
        <TransformComponent wrapperStyle={{ backgroundColor: 'black', margin: 'auto' }} wrapperClass={'canvas-wrapper'} >
          <Canvas
            className='canvas-test'
            ref={canvasRef}            
            maxHeight={paneHeight}
            maxWidth={paneWidth}
            // height={paneHeight}
            // width={paneWidth}
            layoutOptions={{
              'elk.hierarchyHandling': 'INCLUDE_CHILDREN',        // required to enable edges from/to nested nodes
              'elk.nodeLabels.placement': 'INSIDE V_TOP H_RIGHT'
            }}
            direction='RIGHT'
            nodes={nodes}
            edges={edges}
            fit={true}
            node={(nodeProps: NodeProps) => Nodes(nodeProps, dispatch)}
            // only renders nodes without parents!!
            // node={ (node: NodeProps) => ( <Nodes nodeProps={node} />  ) }
            edge={(edgeProps: EdgeProps) => PrepareEdge(edgeProps, handleNodeUpdate)}
            onLayoutChange={(layout) => { handleLayoutChange(layout) }}
          />
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}
export default Diagram;
