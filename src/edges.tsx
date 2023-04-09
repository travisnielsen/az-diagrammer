import { Console } from 'console';
import { write } from 'fs';
import { Edge, EdgeData, EdgeProps } from 'reaflow';

const prepareEdge = (edge: any) => {

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
        default:
            return (
                <Edge {...edgeProps} />
            )
    }

}

export default prepareEdge;