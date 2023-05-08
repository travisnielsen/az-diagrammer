import { NodeData, EdgeData } from 'reaflow';

export type DiagramDataset = {
    visibleNodes: NodeData[],
    hiddenNodes: NodeData[],
    visibleEdges: EdgeData[],
    hiddenEdges: EdgeData[]
}