import { Node, NodeData, NodeProps, Edge, EdgeData, EdgeProps } from 'reaflow';

const PrepareEdge = (edge: EdgeProps, nodeData: NodeData[], edgeData: EdgeData[], handleNodeUpdate: Function ) => {

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


    // returns updated nodeData and edgeData
    const filterNodesByEdge = () => {

        let selectedNodeId = '';
        
        const connectedNodes = nodeData.filter(node => {
            if (node.id === edge.target) {
                selectedNodeId = node.id;
                return true;
            }
            if (node.id === edge.source) {
                return true;
            }

            return false;
        });

        const connectedNodesWithParents = connectedNodes.map(node => {
            const parentNodes = getParentNodes(node, nodeData);
            return [...parentNodes, node];
        }).flat();

        // return new edgedata that contains only the edge
        const filteredEdgeData = edgeData.filter(edgeData => {
            if (edgeData.id === edge.id) {
                return true;
            }
            return false;
        });

        // get child nodes from filteredNodeData
        const childNodes = connectedNodes.map(node => {
            const children = nodeData.filter(childNode => {
                if (childNode.parent === node.id) {
                    return true;
                }
                return false;
            });
            return children;
        }).flat();

        return { nodes: [...childNodes, ...connectedNodesWithParents], edges: filteredEdgeData, selectedNodeId: selectedNodeId };
    }

    const onEdgeClick = (event: React.MouseEvent<SVGGElement, MouseEvent>) => {
        console.log(`edge clicked (${edge.id})`);
        const results = filterNodesByEdge();
        handleNodeUpdate(results.nodes, results.edges, results.selectedNodeId);
    };
    
    const onEdgeEnter = (event: React.MouseEvent<SVGGElement, MouseEvent>) => {
        console.log(`edge entered (${edge.id})`);
      };

    if (edge.properties?.data === undefined) {
        return (
            <Edge {...edge} onClick={onEdgeClick} />
        )
    }

    switch (edge.properties?.data.type) {
        case 'vnetintegration':
            return (
                <Edge {...edge} style={{ stroke: 'blue' }} className='edge' onClick={onEdgeClick} />
            )
        case 'vnet-peering':
            return (
                <Edge {...edge} style={{ stroke: 'purple' }} className='edge' onClick={onEdgeClick} />
            )         
        default:
            return (
                <Edge {...edge} onClick={onEdgeClick} />
            )
    }

}

export default PrepareEdge;