import { NodeData, Edge, EdgeProps } from 'reaflow';
import { store } from '../store';

const PrepareEdge = (edge: EdgeProps, handleNodeUpdate: Function ) => {

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
    const FilterNodesByEdge = () => {

        const nodeData = store.getState().diagram.value.visibleNodes;
        const edgeData = store.getState().diagram.value.visibleEdges;
        
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
        const results = FilterNodesByEdge();
        handleNodeUpdate(results.nodes, results.edges, results.selectedNodeId);
    };
    
    const onEdgeEnter = (event: React.MouseEvent<SVGGElement, MouseEvent>) => {
        console.log(`edge entered (${edge.id}) from ${edge.source} to ${edge.target}`);
      };

    // @ts-ignore
    if (edge.data?.type === undefined) {
        return (
            <Edge {...edge} onClick={onEdgeClick} />
        )
    }

    // @ts-ignore
    switch (edge.data?.type) {
        case 'vnetintegration':
            return (
                <Edge {...edge} style={{ stroke: 'blue' }} className='edge' onClick={onEdgeClick} />
            )
        case 'vnetpeering':
            return (
                <Edge {...edge} className={edge.className } onClick={onEdgeClick} />
            )           
        case 'dns':
            return (
                <Edge {...edge} className={edge.className } onClick={onEdgeClick} />
            ) 
        default:
            return (
                <Edge {...edge} onClick={onEdgeClick} onEnter={onEdgeEnter} />
            )
    }

}

export default PrepareEdge;