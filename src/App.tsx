import { Canvas, Node, NodeData, NodeProps, EdgeData } from 'reaflow';
import prepareNode from './nodes'
import loadData from './data'
import './App.css';

function App() {

  const testData = loadData();

  const nodes: NodeData[] = [
    {
      id: 'funcapp1',
      height: 150,
      width: 150,
      data: {
        type: 'service',
        label: 'Function App',
        url: 'images/Compute/function.svg'
      }
    },
    {
      id: 'storage1',
      height: 150,
      width: 150,
      data: {
        type: 'service',
        label: 'Storage Account',
        url: 'https://github.com/travisnielsen/Azure-PlantUML/raw/themesupport/dist/Storage/AzureBlobStorage.png'
      }
    },
    {
      id: 'vnet-1',
      height: 400,
      width: 400,
      layoutOptions: {
        'portConstraints': 'FREE',
        'elk.padding': '[top=150,left=25,bottom=25,right=25]',
        'elk.direction': 'RIGHT'
      },
      data: {
        type: 'container',
        label: 'VNET 1',
        url: 'https://github.com/travisnielsen/Azure-PlantUML/raw/themesupport/dist/Networking/AzureVirtualNetwork.png'
      }
    },
    {
      id: 'subnet-1',
      parent: 'vnet-1',
      height: 200,
      width: 150,
      layoutOptions: {
        'portConstraints': 'FREE',
        'elk.padding': '[top=150,left=25,bottom=25,right=25]',
        'elk.direction': 'RIGHT'
      },
      data: {
        type: 'container',
        label: 'Subnet 1',
        url: 'https://github.com/travisnielsen/Azure-PlantUML/raw/themesupport/dist/Networking/AzureSubnet.png'
      }
    },
    {
      id: 'subnet-2',
      parent: 'vnet-1',
      height: 200,
      width: 150,
      layoutOptions: {
        'portConstraints': 'FREE',
        'elk.padding': '[top=150,left=25,bottom=25,right=25]',
        'algorithm': 'layered'
      },
      data: {
        type: 'container',
        label: 'Subnet 2',
        url: 'https://github.com/travisnielsen/Azure-PlantUML/raw/themesupport/dist/Networking/AzureSubnet.png'
      }
    },
    {
      id: 'vm1',
      parent: 'subnet-1',
      height: 150,
      width: 150,
      data: {
        type: 'service',
        label: 'VM 1',
        url: 'https://github.com/travisnielsen/Azure-PlantUML/raw/themesupport/dist/Compute/AzureVirtualMachine.png'
      }
    },
    {
      id: 'vm2',
      parent: 'subnet-1',
      height: 150,
      width: 150,
      data: {
        type: 'service',
        label: 'VM 2',
        url: 'https://github.com/travisnielsen/Azure-PlantUML/raw/themesupport/dist/Compute/AzureVirtualMachine.png'
      }
    }
  ]
  
  const edges: EdgeData[] = [
    {
      id: 'funcapp1-storage1',
      from: 'funcapp1',
      to: 'storage1',
      text: 'reads data from'
    },
    {
      id: 'subnet1-to-funcapp1',
      from: 'subnet-1',
      to: 'funcapp1',
      text: 'service endpoint'
    },
    {
      id: 'vm2-to-storage1',
      from: 'vm2',
      to: 'storage1',
      text: 'access files'
    }
  ]

  return (
    <div style={{
      position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, background: 'black' }}>
      <Canvas
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