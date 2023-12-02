import { NodeData, EdgeData } from 'reaflow';
import { demoNodesVisible } from './demoNodesVisible';
import { demoNodesHidden } from './demoNodesHidden';
import { demoEdgesHidden } from './demoEdgesHidden';
import { demoEdgesVisible } from './demoEdgesVisible';


export class DemoData {
    NodesVislbe: NodeData[] = demoNodesVisible;
    NodesHidden: NodeData[] = demoNodesHidden;
    EdgesVisible: EdgeData[] = demoEdgesVisible;
    EdgesHidden: EdgeData[] = demoEdgesHidden;
}