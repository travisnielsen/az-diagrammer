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
              id: `${e.id}-suummary`,
              from: e.from,
              to: newNode.id,
              data: {
                type: "summary"
              }
            }
            edgesFiltered.push(newEdge)
          })
        })

        nodesOfType.forEach(n => {
          const edgesToCreate = edgesFiltered.filter(e => e.from === n.id)
          edgesToCreate.forEach(e => {
            const newEdge = {
              id: `${e.id}-suummary`,
              from: newNode.id,
              to: e.to,
              data: {
                type: "summary"
              }
            }
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