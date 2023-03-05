import { Node, NodeProps } from 'reaflow';
import './App.css';

const prepareNode = (node: NodeProps) => {
    const nodeProps = node.properties;
    switch (nodeProps.data.type) {
        case 'service':
        return (
            <Node>
                <foreignObject height={node.height} width={node.width} x={0} y={0}>
                <div style={{ padding: 5, textAlign: 'center', display: 'block' }}>
                    <h3 style={{ color: 'white', margin: '6px' }}>{nodeProps.data.label}</h3>
                    <img src={nodeProps.data.url} alt="A Function App" width="50" height="50" />
                    <p style={{ color: 'white', margin: 0  }}>123 abc def</p>
                </div>
                </foreignObject>
            </Node>
        )
        case 'container':
        return (
            <Node style={{fill: '#1b1d3c'}}>
                <foreignObject height={node.height} width={node.width} x={0} y={0}>
                <div style={{ padding: 5, textAlign: 'center', display: 'block'  }}>
                    <h3 style={{ color: 'white', margin: 5 }}>{nodeProps.data.label}</h3>
                    <img src={nodeProps.data.url} alt="A Function App" width="50" height="50" />
                    <p style={{ color: 'white', margin: 0  }}>123 abc def</p>
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