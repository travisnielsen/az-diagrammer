import { AzureBase } from "./AzureBase";

 export interface AppService extends AzureBase {
    ResourceId: string;
    Id: string;
    Identity?: null;
    Kind: string;
    Location: string;
    ManagedBy?: null;
    ResourceName: string;
    Name: string;
    ExtensionResourceName?: null;
    ParentResource?: null;
    Plan?: null;
    Properties: Properties;
    ResourceGroupName: string;
    Type: string;
    ResourceType: string;
    ExtensionResourceType?: null;
    TagsTable: string;
    SubscriptionId: string;
    CreatedTime?: null;
    ChangedTime?: null;
    ETag?: null;
  }
   interface Properties {
    name: string;
    state: string;
    hostNames?: (string)[] | null;
    webSpace: string;
    selfLink: string;
    repositorySiteName: string;
    owner?: null;
    usageState: string;
    enabled: boolean;
    adminEnabled: boolean;
    afdEnabled: boolean;
    enabledHostNames?: (string)[] | null;
    siteProperties: SiteProperties;
    availabilityState: string;
    sslCertificates?: null;
    csrs?: (null)[] | null;
    cers?: null;
    siteMode?: null;
    hostNameSslStates?: (HostNameSslStatesEntity)[] | null;
    computeMode?: null;
    serverFarm?: null;
    serverFarmId: string;
    reserved: boolean;
    isXenon: boolean;
    hyperV: boolean;
    lastModifiedTimeUtc: string;
    storageRecoveryDefaultState: string;
    contentAvailabilityState: string;
    runtimeAvailabilityState: string;
    dnsConfiguration: DnsConfiguration;
    vnetRouteAllEnabled: boolean;
    containerAllocationSubnet?: null;
    useContainerLocalhostBindings?: null;
    vnetImagePullEnabled: boolean;
    vnetContentShareEnabled: boolean;
    siteConfig: SiteConfig;
    daprConfig?: null;
    deploymentId: string;
    slotName?: null;
    trafficManagerHostNames?: null;
    sku: string;
    scmSiteAlsoStopped: boolean;
    targetSwapSlot?: null;
    hostingEnvironment?: null;
    hostingEnvironmentProfile?: null;
    clientAffinityEnabled: boolean;
    clientCertEnabled: boolean;
    clientCertMode: string;
    clientCertExclusionPaths?: null;
    hostNamesDisabled: boolean;
    ipMode: string;
    vnetBackupRestoreEnabled: boolean;
    domainVerificationIdentifiers?: null;
    customDomainVerificationId: string;
    kind: string;
    managedEnvironmentId?: null;
    inboundIpAddress: string;
    possibleInboundIpAddresses: string;
    ftpUsername: string;
    ftpsHostName: string;
    outboundIpAddresses: string;
    possibleOutboundIpAddresses: string;
    containerSize: number;
    dailyMemoryTimeQuota: number;
    suspendedTill?: null;
    siteDisabledReason: number;
    functionExecutionUnitsCache?: null;
    maxNumberOfWorkers?: null;
    homeStamp: string;
    cloningInfo?: null;
    hostingEnvironmentId?: null;
    tags: Tags;
    resourceGroup: string;
    defaultHostName: string;
    slotSwapStatus?: null;
    httpsOnly: boolean;
    endToEndEncryptionEnabled: boolean;
    functionsRuntimeAdminIsolationEnabled: boolean;
    redundancyMode: string;
    inProgressOperationId?: null;
    geoDistributions?: null;
    privateEndpointConnections?: (PrivateEndpointConnectionsEntity)[] | null;
    publicNetworkAccess?: null;
    buildVersion?: null;
    targetBuildVersion?: null;
    migrationState?: null;
    eligibleLogCategories: string;
    inFlightFeatures?: (null)[] | null;
    storageAccountRequired: boolean;
    virtualNetworkSubnetId: string;
    keyVaultReferenceIdentity: string;
    defaultHostNameScope: string;
    privateLinkIdentifiers: string;
    sshEnabled?: null;
  }
   interface SiteProperties {
    metadata?: null;
    properties?: (PropertiesEntity)[] | null;
    appSettings?: null;
  }
   interface PropertiesEntity {
    name: string;
    value?: string | null;
  }
   interface HostNameSslStatesEntity {
    name: string;
    sslState: string;
    ipBasedSslResult?: null;
    virtualIP?: null;
    virtualIPv6?: null;
    thumbprint?: null;
    certificateResourceId?: null;
    toUpdate?: null;
    toUpdateIpBasedSsl?: null;
    ipBasedSslState: string;
    hostType: string;
  }
   interface DnsConfiguration {
  }
   interface SiteConfig {
    numberOfWorkers: number;
    defaultDocuments?: null;
    netFrameworkVersion?: null;
    phpVersion?: null;
    pythonVersion?: null;
    nodeVersion?: null;
    powerShellVersion?: null;
    linuxFxVersion: string;
    windowsFxVersion?: null;
    windowsConfiguredStacks?: null;
    requestTracingEnabled?: null;
    remoteDebuggingEnabled?: null;
    remoteDebuggingVersion?: null;
    httpLoggingEnabled?: null;
    azureMonitorLogCategories?: null;
    acrUseManagedIdentityCreds: boolean;
    acrUserManagedIdentityID?: null;
    logsDirectorySizeLimit?: null;
    detailedErrorLoggingEnabled?: null;
    publishingUsername?: null;
    publishingPassword?: null;
    appSettings?: null;
    metadata?: null;
    connectionStrings?: null;
    machineKey?: null;
    handlerMappings?: null;
    documentRoot?: null;
    scmType?: null;
    use32BitWorkerProcess?: null;
    webSocketsEnabled?: null;
    alwaysOn: boolean;
    javaVersion?: null;
    javaContainer?: null;
    javaContainerVersion?: null;
    appCommandLine?: null;
    managedPipelineMode?: null;
    virtualApplications?: null;
    winAuthAdminState?: null;
    winAuthTenantState?: null;
    customAppPoolIdentityAdminState?: null;
    customAppPoolIdentityTenantState?: null;
    runtimeADUser?: null;
    runtimeADUserPassword?: null;
    loadBalancing?: null;
    routingRules?: null;
    experiments?: null;
    limits?: null;
    autoHealEnabled?: null;
    autoHealRules?: null;
    tracingOptions?: null;
    vnetName?: null;
    vnetRouteAllEnabled?: null;
    vnetPrivatePortsCount?: null;
    publicNetworkAccess?: null;
    cors?: null;
    push?: null;
    apiDefinition?: null;
    apiManagementConfig?: null;
    autoSwapSlotName?: null;
    localMySqlEnabled?: null;
    managedServiceIdentityId?: null;
    xManagedServiceIdentityId?: null;
    keyVaultReferenceIdentity?: null;
    ipSecurityRestrictions?: null;
    ipSecurityRestrictionsDefaultAction?: null;
    scmIpSecurityRestrictions?: null;
    scmIpSecurityRestrictionsDefaultAction?: null;
    scmIpSecurityRestrictionsUseMain?: null;
    http20Enabled: boolean;
    minTlsVersion?: null;
    minTlsCipherSuite?: null;
    supportedTlsCipherSuites?: null;
    scmMinTlsVersion?: null;
    ftpsState?: null;
    preWarmedInstanceCount?: null;
    functionAppScaleLimit: number;
    elasticWebAppScaleLimit?: null;
    healthCheckPath?: null;
    fileChangeAuditEnabled?: null;
    functionsRuntimeScaleMonitoringEnabled?: null;
    websiteTimeZone?: null;
    minimumElasticInstanceCount: number;
    azureStorageAccounts?: null;
    http20ProxyFlag?: null;
    sitePort?: null;
    antivirusScanEnabled?: null;
    storageType?: null;
    sitePrivateLinkHostEnabled?: null;
  }
   interface Tags {
    project: string;
    component: string;
  }
   interface PrivateEndpointConnectionsEntity {
    id: string;
    name: string;
    type: string;
    location: string;
    properties: Properties1;
  }
   interface Properties1 {
    provisioningState: string;
    privateEndpoint: PrivateEndpoint;
    groupIds?: null;
    privateLinkServiceConnectionState: PrivateLinkServiceConnectionState;
    ipAddresses?: (string)[] | null;
  }
   interface PrivateEndpoint {
    id: string;
  }
   interface PrivateLinkServiceConnectionState {
    status: string;
    description: string;
    actionsRequired: string;
  }
  