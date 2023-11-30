import { AzureBase } from "./AzureBase";

export interface DnsForwardingRulesetRule extends AzureBase {
    DomainName: string;
    Etag: string;
    Id: string;
    Metadata?: object | null;
    Name: string;
    ProvisioningState?: object | null;
    State?: object | null;
    SystemDataCreatedAt: string;
    SystemDataCreatedBy?: null;
    SystemDataCreatedByType?: object | null;
    SystemDataLastModifiedAt: string;
    SystemDataLastModifiedBy?: null;
    SystemDataLastModifiedByType?: object | null;
    TargetDnsServer: (TargetDnsServerEntity)[];
    Type: string;
  }

  interface TargetDnsServerEntity {
    IPAddress: string;
    Port: number;
  }
  