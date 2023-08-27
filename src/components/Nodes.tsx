import { Node, NodeData, NodeProps } from 'reaflow';
import { MouseEventHandler } from 'react';
import '../App.css';
import { filterOnSelectedNode, expandCollapseContainer } from '../features/diagramSlice'

const Nodes = (node: NodeProps, dispatch: any ) => {

  const nodeProps = node;
  const nodeType = nodeProps?.properties?.data?.type;

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

    if (nodeType === 'container') {
      dispatch(expandCollapseContainer(nodeProps.id));
    }
    else {
      dispatch(filterOnSelectedNode(nodeProps.id));
    }

    
  
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
              <foreignObject id={`node-foreignObject-${nodeProps.id}`}
                height={nodeProps.height}
                width={nodeProps.width} x={0} y={0}
                className='node-container'
                onClick={onNodeClick as MouseEventHandler}
              >
                  <div className='node-container-wrapper'>
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
      
      case 'layout':
        return (
          <Node >
            <foreignObject        
              id={`node-foreignObject-${nodeProps.id}`}
              height={nodeProps.height}
              width={nodeProps.width} x={0} y={0}
            >
              <div style={{ padding: 5, textAlign: 'center', display: 'block' }}>          
                <h5 style={{ color: 'white', margin: '6px' }}>{nodeProps.properties.data.label}</h5>              
              </div>
            </foreignObject>
          </Node>
        )     
      
         
      default:  
        return ( <Node /> )
  }
  
};

export default Nodes;