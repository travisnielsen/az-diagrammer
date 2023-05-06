import { Canvas, NodeProps, CanvasRef, NodeData, EdgeData, EdgeProps, ElkRoot } from 'reaflow';
import PrepareNode from './Nodes'
import PrepareEdge from './Edges'
import { getNodeData, getEdgeData } from '../data'
import { useEffect, useRef } from 'react';
import { setVisibleNodes, setHiddenNodes, setVisibleEdges, setHiddenEdges } from '../features/diagramSlice'
import { setPaneHeight, setPaneWidth } from '../features/canvasSlice';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useAppSelector, useAppDispatch } from '../hooks'
import '../App.css'

let selectedNodeId = '';

const Diagram: React.FC = () => {
  const canvasRef = useRef<CanvasRef>(null);

  const [paneWidth, paneHeight] = useAppSelector((state: any) => [state.canvas.value.paneWidth, state.canvas.value.paneHeight])
  
  const dispatch = useAppDispatch()

  useEffect(() => {
    const [initialNodeData, initialEdgeData] = loadCanvasData();
    dispatch(setVisibleNodes(initialNodeData))
    dispatch(setVisibleEdges(initialEdgeData))
  }, [dispatch])

  const [nodes, edges] = useAppSelector((state) => [state.diagram.value.nodes, state.diagram.value.edges])
  // const edges = useAppSelector((state) => state.diagram.value.edges)

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
            node={(nodeProps: NodeProps) => PrepareNode(nodeProps, handleNodeUpdate)}
            edge={(edgeProps: EdgeProps) => PrepareEdge(edgeProps, handleNodeUpdate)}
            onLayoutChange={(layout) => { handleLayoutChange(layout) }}
          />
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}
export default Diagram;


export const loadCanvasData = () => {

  const nodeData = getNodeData();
  const edgeData = getEdgeData(); 

  const nodeIsNonEmptyContainer = (node: NodeData) => {
    const filteredServices = ["routetable", "nsg"]
    let hasChildNodes = false
    if (node.data.type === "container") {
      hasChildNodes = nodeData.findIndex(n => n.parent === node.id ) > 0
      
      if (hasChildNodes && node.data.servicename === "subnet") {
        const childNodes = nodeData.filter(n => n.parent === node.id && !filteredServices.includes(n.data.servicename))
        if (childNodes.length === 0) hasChildNodes = false
      }
    }

    return hasChildNodes
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
  
  // if there are > 3 items of the same type within a container, replace them with a substitute node
  
  const containerIds = nodesFiltered.filter(n => n.data.type === "container" && n.data.servicename !== "vnet").map(n => n.id)
  containerIds.forEach(id => {
    const childNodes = nodesFiltered.filter(n => n.parent === id)
    const childNodeServiceNames = [...new Set(childNodes.map(n => n.data.servicename))]
    childNodeServiceNames.forEach(servicename => {
      const nodesOfType = childNodes.filter(n => n.data.servicename === servicename)
      if (nodesOfType.length > 3) {
        const node = nodesOfType[0]
        const newNode = {
          id: `${node.id}-${node.data.servicename}`,
          parent: node.parent,
          height: 110,
          width: 250,
          data: {
            type: "summary",
            category: "summary",
            serviceName: node.data.servicename,
            label: `${nodesOfType.length} ${node.data.servicename}s`,
            url: node.data.url,
            isSubstitute: true
          }
        }
        nodesFiltered.push(newNode)
   
        // create edges from nodesOfType to newNode
        // exampple: collapsed PaaS intem with vnet service endpoint from subnets
        nodesOfType.forEach(n => {
          const edgesToCreate = edgesFiltered.filter(e => e.to === n.id)
          edgesToCreate.forEach(e => {
              const newEdge = {
                id: `${e.id}-summary`,
                from: e.from,
                to: newNode.id,
                data: {
                  type: "summary"
                }
            }
            const existingEdge = edgesFiltered.find(ef => ef.from === newEdge.from && ef.to === newEdge.to)
            if (!existingEdge)            
              edgesFiltered.push(newEdge)
          })
        })

        nodesOfType.forEach(n => {
          const edgesToCreate = edgesFiltered.filter(e => e.from === n.id)
          edgesToCreate.forEach(e => {
            const newEdge = {
              id: `${e.id}-summary`,
              from: newNode.id,
              to: e.to,
              data: {
                type: "summary"
              }
            }
            // only push new edge if edgesFiltered does not contain an edge with the same values for from and to
            const existingEdge = edgesFiltered.find(ef => ef.from === newEdge.from && ef.to === newEdge.to)
            if (!existingEdge)
              edgesFiltered.push(newEdge)
          })
        })

        // remove edges from nodesOfType
        nodesOfType.forEach(n => {
          const edgesToRemove = edgesFiltered.filter(e => e.from === n.id || e.to === n.id)
          edgesToRemove.forEach(e => {
            const index = edgesFiltered.findIndex(ef => ef.id === e.id)
            edgesFiltered.splice(index, 1)
          })
        })
        
        // remove nodesOfType from nodesFiltered
        nodesOfType.forEach(n => {
          const index = nodesFiltered.findIndex(nf => nf.id === n.id)
          nodesFiltered.splice(index, 1)
        })

      }
    })
  })

  return [nodesFiltered, edgesFiltered]
}
