# Azure Diagrammer: Interactive visualization for complex workloads

Azure Diagrammer is an application that generates a network topology of resources deployed in a given Azure Subscription. It consists of three parts:

1. A PowerShell script for exporting resource information
2. Azure Storage for hosting exported JSON files
3. A client-side React JS based web application that generates an interactive diagram

Options exist for hosting Azure Storage and the web application both remotely and locally. Check out the [demo site](https://azdiagram.nielski.com/), which shows a sample deployment based on the current main branch.

## Diagram Source Data

### Exporting

The [export script](/scripts/export.ps1) connects to a specified Azure Subscription and writes resource definitions to JSON files, which are used by the application to draw the environment. The prerequisites for running this script are as follows:

* Read access to the subscription as well as subscriptions that contain related networking resources. Example: a hub VNET that is peered to the workload VNET.
* [PowerShell 7.4](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell?view=powershell-7.4) or higher
* [Azure PowerShell modules](https://learn.microsoft.com/en-us/powershell/azure/install-azure-powershell?view=azps-11.2.0)

Navigate to the *scripts* directly and open [democonfig.json](/scripts/democonfig.json). Copy the JSON data and paste it in a new file called `config.json`. Update the *tenantId*, *subscriptionName*, and *subscriptionId* fields. Next, run the script using the following command:

```powershell
./export.ps1 config.json
```

Data will be saved in a new folder in the *data* directory with the name of the subscription provided in the configuration file.

### Data Hosting - Azure

Azure Diagrammer supports hosting exported JSON files in an Azure Storage account. Files should be uploaded to a folder hosted under a blob storage container.

![Alt text](/media//files-azure.png)

In the above example, the files are placed in a folder named *contoso* which is under a container named *azure-diagrammer*.

#### Configure CORS

Because this application runs in the browser and makes API calls (local or remote) to the Azure Storage API, a CORS policy must be configured on your storage account. Create Origin records based on your needs. If you plan on running Azure Diagrammer locally, be sure to specify `http://localhost:3000`. If you will be using the [demo site](https://azdiagram.nielski.com/) or hosting the web application remotely (any URL other than *localhost*), be sure to add an entry for that as well. The following example addresses both the local and remote options:

![Alt text](/media/cors-azure.png)

#### Configure Access (Shared Access Signature)

If you plan to secure access to source files via Shared Access Signatures, generate one on your Storage Account. The following settings are suggested:

| Setting | Value |
| ------- | ----- |
| Allowed services | Blob |
| Allowed resource types | Service, Container, Object |
| Allowed permissions | Read, List |
| Start and expiry date/time | *per requirements* |
| Allowed protocols | HTTPS only |

#### Configure Access (Entra ID RBAC)

Access can also be granted via Entra ID authorization. If using this model, assign the relevant users and/or groups the **Storage Blob Data Reader** role in the *Access Control (IAM)* section of the Storage Account.

> [!NOTE]
> User identity-based authorization requires an App Registration in your Entra ID tenant with the `user_impersonation` API permission to Azure Storage. Documentation for this is coming soon.

### Data Hosting - local

For testing or development purposes, you may chose to host exported data locally. The following tools are necessary for this:

* [Azurite](https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azurite?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&bc=%2Fazure%2Fstorage%2Fblobs%2Fbreadcrumb%2Ftoc.json&tabs=visual-studio-code%2Cblob-storage) - This is an Azure Storage emulator that runs on Windows, Linux, and MacOS.
* [Azure Storage Explorer](https://azure.microsoft.com/en-us/products/storage/storage-explorer/) - Used to configure the local storage and manage files

Once Azurite is running, a few initial storage configuration steps are required:

Open Azure Storage Explorer and create a CORS policy that allows `http://localhost:3000` on the *Blob Containers* object as shown here:

![Alt text](/media/core-azurite.png)

The only supported way to authenticate to a local Azurite environment is via Shared Access Signature. Create one in Storage Explorer by right-clicking *Blob Containers* and creating a new container. Once completed, right click the container and create a new *Shared Access Signature* as shown below:

![Alt text](/media/create-sas.png)

On the next screen, copy and save the values for *URL* and *SAS token*. This will be needed for the application configuration.

## Application Hosting

Azure Diagrammer can be hosted locally or remotely as a static web site.

### Application Hosting - remote

Any static web site can be used for hosting purposes. For Azure Static Sites, refer to the [GitHub Actions configuration](/.github/workflows/azure-static-web-apps-jolly-pond-05d459110.yml) and [Azure Static Sites](staticwebapp.config.json) configuration files provided in this repo as a reference.

### Application Hosting - local

For local environments, the application can be started with the following commands:

```bash
npm install     # for first time use
npm run dev     # start the Vite dev server
```

## Application Configuration

To configure a diagram, use the *Connection* dropdown menu, click *Add*, and fill in the information. Be sure to specify the container and folder name for your environment. The value for the *Connection String* field will depend on the type of authorization required for the storage account.

### Connection String - Shared Access Signature

If your Storage Account is configured with a Shared Access Signature, the connection string for the storage account should be in the following format:

```bash
# Local (Azurite)
BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;SharedAccessSignature=[SAS_Token]

# Remote (Azure)
BlobEndpoint=https://[NAME].blob.core.windows.net/;SharedAccessSignature=[SAS_Token]

```

...where `[SAS_TOKEN]` is in the value of the token created earlier (see above). Example: `sv=2022-11-02&st=2024-01-20T19%3A29%3A07Z&se=2034-01-21T19%3A29%...`

### Connection String - User Identity

For Azure-hosted Storage Accounts, the connection string should be the URL of the Storage Account blob endpoint:

```bash
https://[name].blob.core.windows.net/
```
