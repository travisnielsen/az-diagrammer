import { NodeData } from 'reaflow';
import { LayoutZone } from './LayoutZone';

export interface DiagramNode extends NodeData {

    data: {
        type: string;
        category: string;
        layoutZone: LayoutZone;
        region: string;
        serviceName: string;
        cloudId: string;
        label: string;
        info: string;
        icon: string;
        vnetIntegrationLink?: string;
        privateIpAddress: string;
        publicIpAddresses?: string[];
        userDefinedRoutes?: object[];
        networkRules?: object[];
    }
}