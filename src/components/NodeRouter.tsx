import { Node, NodeData, NodeProps, EdgeData, removeNode } from 'reaflow';
import { MouseEventHandler } from 'react';
import '../App.css';
import { store } from '../store';
// import { connect, ConnectedProps } from 'react-redux';
import { useAppDispatch } from '../hooks'
import { setVisibleNodes, setHiddenNodes, setVisibleEdges, setHiddenEdges } from '../features/diagramSlice'

// const connector = connect(mapState, mapDispatch)

// type PropsFromRedux = ConnectedProps<typeof connector>

/*
interface Props extends PropsFromRedux {
  node: NodeProps
}
*/

type Props = {
  nodeProps: NodeProps
}

const NodeRouter = (node: NodeProps) => {
// const NodeRouter: React.FunctionComponent<Props> = (props: Props) => {

  // const nodeProps = props.nodeProps;
  const nodeProps = node;
  
  const nodeType = nodeProps?.properties?.data?.type;

  const dispatch = useAppDispatch()

  const onNodeClick = (event: React.MouseEvent<SVGGElement, MouseEvent>) => {
    console.log(`node clicked (${nodeType})`, 'node:', nodeProps.id);

    // set the selected node style on previous rect element
    const rectangle = event.currentTarget.previousElementSibling;

    if (nodeProps.className === 'node-selected') {
      nodeProps.className = '';
      rectangle?.classList.remove('node-selected');
    } else {
      nodeProps.className = 'node-selected';
      rectangle?.classList.add('node-selected');
    }

    FilterOnSelectedService(nodeProps.id);
  
  };


  function onButtonClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    throw new Error('Function not implemented.');
  }
  
  const onNodeEnter = (event: React.MouseEvent<SVGGElement, MouseEvent>, node: NodeData) => {
      console.log('onNodeEnter', event.target);
  
      // @ts-ignore
      // const isNode = event.target?.classList?.contains('node-svg-rect');
      // if (isNode) {
      //   // console.log('Entering node')
      // }
    };

    const onNodeLeave = (event: React.MouseEvent<SVGGElement, MouseEvent>, node: NodeData) => {
      console.log('onNodeLeave', event.target);
      // console.log('containerRef?.current', containerRef?.current)
  
      // // @ts-ignore
      // const isChildrenOfNodeContainer = event.target?.closest('.node-container');
      // // @ts-ignore
      // const isChildrenOfNodeRect = event.target?.closest('.node-svg-rect');
      // const isNode = isChildrenOfNodeContainer || isChildrenOfNodeRect;
      //
      // if (isNode) {
      //   console.log('Hovering node')
      // }
  };

  const getParentNodes: any = (node: NodeData, nodeData: NodeData[]) => {
    const parentNodes = nodeData.filter(parentNode => {
        if (parentNode.id === node.parent) {
            return true;
        }
        return false;
    });

    if (parentNodes.length === 0) {
        return [];
    }

    return [...parentNodes, ...getParentNodes(parentNodes[0], nodeData)];
  }


  const getNodesFromEdges: any = (edges: EdgeData[], nodeData: NodeData[]) => {

    const connectedNodes = edges.map(edge => {
        const connectedNode = nodeData.filter(node => {
            if (node.id === edge.from || node.id === edge.to) {
                return true;
            }
            return false;
        });
        return connectedNode;
    }).flat();

    return connectedNodes;

  }
  
  const FilterOnSelectedService = (selectedNodeId: string) => {
    const nodeData = store.getState().diagram.value.visibleNodes;
    const edgeData = store.getState().diagram.value.visibleEdges;
    // handleNodeUpdate(results.nodes, results.edges);

    const connectedEdges = edgeData.filter(edge => edge.to === selectedNodeId || edge.from === selectedNodeId);

    // return all nodes that are part of the connected edges
    const connectedNodes = nodeData.filter(node => {
        if (node.id === selectedNodeId) {
            return true;
        }
        if (connectedEdges.some(edge => edge.from === node.id || edge.to === node.id)) {
            return true;
        }
        return false;
    });

    const parentNodes = getParentNodes(nodeProps.properties, nodeData);

    let parentEdges: EdgeData<any>[] = []

    if (parentNodes) {
      parentEdges = edgeData.filter(edge => {
        if (parentNodes.some((parentNode: { id: string | undefined; }) => parentNode.id === edge.from || parentNode.id === edge.to)) {
          return true;
        }
        return false;
      });
    }

    const nodesFromParentEdges = getNodesFromEdges(parentEdges, nodeData);

    const displayNodes = [...parentNodes, ...connectedNodes, ...nodesFromParentEdges].filter((node, index, self) => self.findIndex(n => n.id === node.id) === index)
    const displayEdges = [...connectedEdges, ...parentEdges]

    // get nodes that are not in the displayNodes array
    const hiddenNodes = nodeData.filter(node => !displayNodes.some(n => n.id === node.id));
    const hiddenEdges = edgeData.filter(edge => !displayEdges.some(e => e.id === edge.id));

    dispatch(setVisibleNodes(displayNodes));
    dispatch(setVisibleEdges(displayEdges));
    dispatch(setHiddenNodes(hiddenNodes));
    dispatch(setHiddenEdges(hiddenEdges));
    
    
    /*
    setVisibleNodes(displayNodes);
    setVisibleEdges(displayEdges);
    setHiddenNodes(hiddenNodes);
    setHiddenEdges(hiddenEdges);
    */
  }
    
    switch (nodeType) {
        case 'service':
          return (
            <Node>
              <foreignObject
                id={`node-foreignObject-${nodeProps.id}`}
                height={nodeProps.height}
                width={nodeProps.width} x={0} y={0}
                // Use the same onClick/onMouseEnter/onMouseLeave handlers as the one used by the Node component, to yield the same behavior whether clicking on the <rect> or on the <foreignObject> element
                onClick={onNodeClick as MouseEventHandler}
                onMouseEnter={onNodeEnter as MouseEventHandler}
                onMouseLeave={onNodeLeave as MouseEventHandler}
              >
                <div style={{ padding: 5, textAlign: 'center', display: 'block' }}>
                    <h5 style={{ color: 'white', margin: '6px' }}>{nodeProps.properties.data.label}</h5>
                    <img src={nodeProps.properties.data.url} alt="A Function App" width="40" height="40" />
                    <p style={{ color: 'white', margin: 0  }}>{nodeProps.properties.data.info}</p>
                </div>
              </foreignObject>
            </Node>
        )
      
      case 'container':
        return (
            <Node className='node-container' >
                <foreignObject id={`node-foreignObject-${nodeProps.id}`} height={nodeProps.height} width={nodeProps.width} x={0} y={0} className='node-container'>
                <div style={{ padding: 5, textAlign: 'center', display: 'block'  }}>
                    <h5 style={{ color: 'white', margin: 5 }}>{nodeProps.properties.data.label}</h5>
                    <img src={nodeProps.properties.data.url} alt="A Function App" width="40" height="40" />
                        <p style={{ color: 'white', margin: 0 }}>{nodeProps.properties.data.info}</p>
                </div>
                </foreignObject>
            </Node>
      )
      
      case 'summary':
        return (
          <Node >
            <foreignObject        
              id={`node-foreignObject-${nodeProps.id}`}
              height={nodeProps.height}
              width={nodeProps.width} x={0} y={0}
              // Use the same onClick/onMouseEnter/onMouseLeave handlers as the one used by the Node component, to yield the same behavior whether clicking on the <rect> or on the <foreignObject> element
              onClick={onNodeClick as MouseEventHandler}
              onMouseEnter={onNodeEnter as MouseEventHandler}
              onMouseLeave={onNodeLeave as MouseEventHandler}
            >
              <div style={{ padding: 5, textAlign: 'center', display: 'block' }}>          
                <h5 style={{ color: 'white', margin: '6px' }}>{nodeProps.properties.data.label}</h5>          
                <img src={nodeProps.properties.data.url} alt="A Function App" width="40" height="40" />
                <p style={{ color: 'white', margin: 0 }}>Click to expand</p>      
              </div>
            </foreignObject>
          </Node>
        )
         
      default:  
        return ( <Node /> )
  }
  
};

// export default connect(null, null)(PrepareNode);
// export default connect(null, { setVisibleEdges, setHiddenEdges, setVisibleNodes, setHiddenNodes })(PrepareNode);
export default NodeRouter;