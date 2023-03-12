import { Canvas, NodeProps } from 'reaflow';
import prepareNode from './nodes'
import { nodeData, edgeData } from './data'
import './App.css';

function App() {

  const nodes = nodeData();
  const edges = edgeData();

  return (
    <div style={{
      position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, background: 'black' }}>
      <Canvas
        maxHeight={ 8000 }
        layoutOptions={{
          'elk.hierarchyHandling': 'INCLUDE_CHILDREN',        // required to enable edges from/to nested nodes
          'elk.nodeLabels.placement': 'INSIDE V_TOP H_RIGHT'
        }}
        direction='RIGHT'
        nodes={nodes}
        edges={edges}
        node={(node: NodeProps) => prepareNode(node)}
      />
    </div>
  )
}

export default App;