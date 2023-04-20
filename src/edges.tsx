import { Console } from 'console';
import { write } from 'fs';
import { Edge, EdgeData, EdgeProps } from 'reaflow';

const PrepareEdge = (edge: any) => {

    const edgeProps = edge.properties

    if (edge.data === undefined) {
        return (
            <Edge {...edgeProps} />
        )
    }

    switch (edge.data.type) {
        case 'vnetintegration':
            return (
                <Edge {...edgeProps} style={{ stroke: 'blue' }} className='edge' />
            )
        case 'vnet-peering':
            return (
                <Edge {...edgeProps} style={{ stroke: 'purple' }} className='edge' />
            )         
        default:
            return (
                <Edge {...edgeProps} />
            )
    }

}

export default PrepareEdge;