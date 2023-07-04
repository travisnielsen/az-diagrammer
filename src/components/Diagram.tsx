import { Canvas, NodeProps, CanvasRef, NodeData, EdgeData, EdgeProps, ElkRoot, useSelection, SelectionResult, CanvasPosition } from 'reaflow';
import Nodes from './Nodes'
import PrepareEdge from './Edges'
import { useEffect, useRef, useState } from 'react';
import { setVisibleNodes, setVisibleEdges } from '../features/diagramSlice'
import { setPaneHeight, setPaneWidth } from '../features/canvasSlice';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { useAppSelector, useAppDispatch } from '../hooks'
import '../App.css'

let selectedNodeId = '';

const Diagram: React.FC = () => {
  const canvasRef = useRef<CanvasRef>(null);
  const transformComponentRef = useRef<ReactZoomPanPinchRef| null>(null);
  const dispatch = useAppDispatch()
  const [paneWidth, paneHeight] = useAppSelector((state: any) => [state.canvas.value.paneWidth, state.canvas.value.paneHeight])
  const [nodes, edges] = useAppSelector((state) => [state.diagram.value.visibleNodes, state.diagram.value.visibleEdges])
  const [hiddenNodes, hiddenEdges] = useAppSelector((state) => [state.diagram.value.hiddenNodes, state.diagram.value.hiddenEdges])
  const containerWidth = canvasRef.current?.containerWidth;
  const [cursorXY, setCursorXY] = useState<[number, number]>([0, 0]);

  /**
   * 
   * @param nodes The visible nodes to be shown
   * @param edges The visible edges to be shown
   * @param nodeId sets the visible and hidden nodes when called. Inovkes a method to center on the selected node.
   */
  function handleNodeUpdate(nodes: NodeData[], edges: EdgeData[], nodeId: string) {
    selectedNodeId = nodeId;
    dispatch(setVisibleNodes(nodes))
    dispatch(setVisibleEdges(edges))
    centerOnSelectedNode(nodeId);
  }

  const selections: SelectionResult = useSelection({
    nodes,
    edges,
    selections: [''],
    onSelection: s => {
      console.log('onSelection', s);
    }

  });

  // TOTO: This needs research.  It's not working as expected.
  function centerOnSelectedNode(nodeId: string) {

    const canvasWidth = canvasRef?.current?.canvasWidth;
    const canvasHeight = canvasRef?.current?.canvasHeight;

    if (canvasWidth && canvasHeight) {

      // TODO: Canvas item may be a child of a child.
      const canvasItem = canvasRef.current?.layout.children?.find((item) => item.id === nodeId);

      if (canvasItem) {

        const { x, y, width, height } = canvasItem;
        const canvasCenterX = canvasWidth / 2;
        const canvasCenterY = canvasHeight / 2;
        const canvasItemCenterX = x + (width / 2);
        const canvasItemCenterY = y + (height / 2);
  
        if (canvasRef?.current?.setScrollXY) {
          canvasRef?.current?.setScrollXY([x, y]);
        }

      }

    }
  }

  const onCanvasClick = (event: React.MouseEvent<SVGGElement, MouseEvent>): void => {
    console.log('onCanvasClick', event);
    setCursorXY([event?.clientX, event?.clientY]);
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

    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    // keep a minimum pane size
    // if (newHeight < screenHeight) newHeight = screenHeight;
    if (newWidth < screenWidth) newWidth = screenWidth;

    // const canvasContainerWidth = canvasRef.current?.containerRef?.current?.parentNode?.parentNode?.parentNode?.?.toString();

    /*
    const parentDiv: HTMLDivElement = canvasRef.current?.containerRef?.current?.parentNode as HTMLDivElement;
    let transformCss = parentDiv.style.cssText;

    if (transformCss != "transform: translate(0px, 0px) scale(1);") {
      parentDiv.style.cssText = "transform: translate(0px, 0px) scale(1);";
    }

    if (canvasRef?.current?.setScrollXY) {
      
      // canvasRef?.current?.setScrollXY([1000, 500]);
    }
    */

    dispatch(setPaneHeight(newHeight));
    dispatch(setPaneWidth(newWidth));
    
    if (canvasRef?.current?.positionCanvas) {
      canvasRef?.current?.positionCanvas(CanvasPosition.CENTER);
    }
    
  }

  var onTransformed = (panPinchRef: ReactZoomPanPinchRef, transformState: { scale: number, positionX: number, positionY: number }) => {
    // This is a hack to prevent the diagram from being dragged too far up. However, I'm unable to get the actual diagram height.
    let canvasHeight = canvasRef.current?.canvasHeight || 0;

    if (canvasHeight != 0 && canvasHeight < window.screen.height) {
      if (transformState.positionY < 0) {
        console.log('onTransformed', transformState);
        panPinchRef.instance.transformState = { positionX: transformState.positionX, positionY: 125, scale: .5, previousScale: transformState.scale };
        panPinchRef.instance.applyTransformation();
      }
    }
  }

  return (
    <div className='canvas-container'>
      <TransformWrapper wheel={{ step: 0.2 }} minScale={0.2} maxScale={8} limitToBounds={false} centerOnInit={true} minPositionY={200} onTransformed={onTransformed} ref={transformComponentRef} >
        <TransformComponent wrapperStyle={{ backgroundColor: 'black', margin: 'auto', minHeight: '1000px' }} wrapperClass={'canvas-wrapper'} >
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
            defaultPosition={CanvasPosition.TOP}
            onCanvasClick={onCanvasClick}
            // selections={selections}
          />
        </TransformComponent>
      </TransformWrapper>
      <div
        style={{ position: 'absolute', bottom: 10, left: 20, zIndex: 999 }}
      >
        X: {cursorXY?.[0]} | Y: {cursorXY?.[1]}
      </div>
    </div>
  )
}
export default Diagram;
