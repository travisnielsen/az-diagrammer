import { css } from '@emotion/react';
import { Node, NodeData, NodeProps, EdgeData, removeNode } from 'reaflow';
import { MouseEventHandler } from 'react';
import './App.css';
import React from 'react';

const PrepareNode = (node: NodeProps, nodeData: NodeData[], edgeData: EdgeData[], handleNodeUpdate: Function ) => {

  const nodeProps = node.properties;

  const onNodeClick = (event: React.MouseEvent<SVGGElement, MouseEvent>) => {
    console.log(`node clicked (${nodeProps.data.type})`, 'node:', node);
    const results = removeNode(nodeData, edgeData, node.properties.id);
    handleNodeUpdate(results.nodes, results.edges);

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
    
    switch (nodeProps.data.type) {
        case 'service':
          return (
              <Node>
                  <foreignObject
                      id={`node-foreignObject-${node.id}`}
                      height={node.height}
                      width={node.width} x={0} y={0}
                      // Use the same onClick/onMouseEnter/onMouseLeave handlers as the one used by the Node component, to yield the same behavior whether clicking on the <rect> or on the <foreignObject> element
                      onClick={onNodeClick as MouseEventHandler}
                      onMouseEnter={onNodeEnter as MouseEventHandler}
                      onMouseLeave={onNodeLeave as MouseEventHandler}
                  >
                      <div style={{ padding: 5, textAlign: 'center', display: 'block' }}>
                          <h5 style={{ color: 'white', margin: '6px' }}>{nodeProps.data.label}</h5>
                          <img src={nodeProps.data.url} alt="A Function App" width="40" height="40" />
                          <p style={{ color: 'white', margin: 0  }}>{nodeProps.data.info}</p>
                      </div>
                  </foreignObject>
              </Node>
        )
      
      case 'container':
        const containerColor = nodeProps.data.servicename === 'subnet1' ? '#000000' : '#1b1d3c';
        return (
            <Node className='node-container' >
                <foreignObject id={`node-foreignObject-${node.id}`} height={node.height} width={node.width} x={0} y={0}>
                <div style={{ padding: 5, textAlign: 'center', display: 'block'  }}>
                    <h5 style={{ color: 'white', margin: 5 }}>{nodeProps.data.label}</h5>
                    <img src={nodeProps.data.url} alt="A Function App" width="40" height="40" />
                        <p style={{ color: 'white', margin: 0 }}>{nodeProps.data.info}</p>
                </div>
                </foreignObject>
            </Node>
      )
      
      case 'summary':
        return (
          <Node>
            <foreignObject        
              id={`node-foreignObject-${node.id}`}
              height={node.height}
              width={node.width} x={0} y={0}
              // Use the same onClick/onMouseEnter/onMouseLeave handlers as the one used by the Node component, to yield the same behavior whether clicking on the <rect> or on the <foreignObject> element
              onClick={onNodeClick as MouseEventHandler}
              onMouseEnter={onNodeEnter as MouseEventHandler}
              onMouseLeave={onNodeLeave as MouseEventHandler}
            >
              <div style={{ padding: 5, textAlign: 'center', display: 'block' }}>          
                <h5 style={{ color: 'white', margin: '6px' }}>{nodeProps.data.label}</h5>          
                <img src={nodeProps.data.url} alt="A Function App" width="40" height="40" />
                <p style={{ color: 'white', margin: 0 }}>Click to expand</p>      
              </div>
            </foreignObject>
          </Node>
        )
         
      default:  
        return ( <Node /> )
    }
};

export default PrepareNode;