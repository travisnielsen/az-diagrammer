import { css } from '@emotion/react';
import { Node, NodeData, NodeProps } from 'reaflow';
import { MouseEventHandler } from 'react';
import './App.css';
import React from 'react';

const prepareNode = (node: NodeProps) => {

    const nodeProps = node.properties;

    const onNodeClick = (event: React.MouseEvent<SVGGElement, MouseEvent>) => {
        console.log(`node clicked (${nodeProps.data.type})`, 'node:', node);
        // setSelectedNodes([node.id]);
    };
    
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
                    css={css`
                        position: relative;
                        &.is-selected {
                            border: 2px dashed;
                          }
                          // Highlights the node when it's the last created node
                          &.is-recently-created {
                            box-shadow: 0px 0px 10px 0px blue;
                          }
                          // Disabling pointer-events on top-level containers, for events to be forwarded to the underlying <rect>
                          // Allows using events specific to the Reaflow <Node> component (onClick, onEnter, onLeave, etc.)
                          pointer-events: none;
                          .node,
                          .node-header {
                            pointer-events: none;
                          }
                          .node-action,
                          .node-content {
                            pointer-events: auto;
                          }
                          .node {
                            margin: 15px;
                            // XXX Elements within a <foreignObject> that are using the CSS "position" attribute won't be shown properly, 
                            //  unless they're wrapped into a container using a "fixed" position.
                            //  Solves the display of React Select element.
                            // See https://github.com/chakra-ui/chakra-ui/issues/3288#issuecomment-776316200
                            position: fixed;
                            
                            // Take full size of its parent, minus the margins (left/right)
                            width: calc(100% - 30px); // Depends on above "margin" value
                            height: calc(100% - 30px); // Depends on above "margin" value
                          }
                          .is-unreachable-warning {
                            pointer-events: auto;
                            color: orange;
                            float: left;
                            cursor: help;
                          }
                          // Applied to all textarea for all nodes
                          .textarea {
                            margin-top: 15px;
                            background-color: #eaeaea;
                          }
                    `}
                
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
        return (
            <Node style={{fill: '#1b1d3c'}}>
                <foreignObject id={`node-foreignObject-${node.id}`} height={node.height} width={node.width} x={0} y={0}>
                <div style={{ padding: 5, textAlign: 'center', display: 'block'  }}>
                    <h5 style={{ color: 'white', margin: 5 }}>{nodeProps.data.label}</h5>
                    <img src={nodeProps.data.url} alt="A Function App" width="40" height="40" />
                        <p style={{ color: 'white', margin: 0 }}>{nodeProps.data.info}</p>
                </div>
                </foreignObject>
            </Node>
        )
        default:
        return (
            <Node />
        )
    }
};

export default prepareNode;