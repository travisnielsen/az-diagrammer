import { NodeData, EdgeData } from 'reaflow';

export type DiagramDataset = {
    nodes: NodeData[],
    hiddenNodes: NodeData[],
    edges: EdgeData[],
    hiddenEdges: EdgeData[]
}