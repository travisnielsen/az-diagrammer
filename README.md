# Azure Diagrammer: Interactive visualization for complex workloads

Azure Diagrammer is an application that generates a network topology of resources deployed in a given Azure Subscription. It consists of three parts:

1. A PowerShell script for exporting resource information
2. An Azure Storage account for hosting exported JSON files
3. A web application for displaying the resources

Check out the [demo site](https://azdiagram.nielski.com/), which shows a sample deployment based on the current main branch.

## Exporting Source Data

The [export script](/scripts/export.ps1) is used to write Azure resources to JSON files, which are used by the application to draw the environment. The prerequisites for using this script to export data are as follows:

* Read access to the subscription as well as subscriptions that contain related networking resources. Example: a hub VNET that is peered to the workload VNET.
* [PowerShell 7.4](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell?view=powershell-7.4) or higher
* [Azure PowerShell modules](https://learn.microsoft.com/en-us/powershell/azure/install-azure-powershell?view=azps-11.2.0)

Navigate to the *scripts* directly and open [democonfig.json](/scripts/democonfig.json). Copy the JSON data and paste it in a new file called `config.json`. Update the *tenantId*, *subscriptionName*, and *subscriptionId* fields. Next, run the script using the following command:

```powershell
./export.ps1 config.json
```

Data will be saved in a new folder in the *data* directory with the name of the subscription provided in the file.

## Hosting Source Data - Azure

coming soon...

## Hosting Source Data - local

For testing or development purposes, you may chose to host exported data locally. The following tools are necessary for this:

* [Azurite](https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azurite?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&bc=%2Fazure%2Fstorage%2Fblobs%2Fbreadcrumb%2Ftoc.json&tabs=visual-studio-code%2Cblob-storage) - This is an Azure Storage emulator that runs on Windows, Linux, and MacOS.

* [Azure Storage Explorer](https://azure.microsoft.com/en-us/products/storage/storage-explorer/) - Necessary to configure the local storage and manage files

Once Azurite is running, a few initial storage configuration steps are required:

Open Azure Storage Explorer and create a CORS policy that allows `http://localhost:3000` on the *Blob Containers* object as shown here:

![Alt text](/media/create-cors.png)

Next right-click *Blob Containers* and create a new container and give it a name. Once completed, right click the container and create a new *Shared Access Signature* as shown below:

![Alt text](/media/create-sas.png)

On the next screen, copy and save the values for *URL* and *SAS token*. This will be needed for the application configuration.

## Configuring and Viewing Diagrams

Azure Diagrammer can be hosted locally or as a static web site. For local enviroments, the application can be started with the following commands:

```bash
npm install     # for first time use
npm run dev     # start the Vite dev server
```

To configure a diagram, use the *Diagrams* dropdown menu, click *Add*, and fill in the information.

For locally-hosted Storage Accounts, the connection string for the storage account should be in the following format:

```bash
AccountName=devstoreaccount1;DefaultEndpointsProtocol=http;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;SharedAccessSignature=[SAS_Token]
```

...where [SAS_TOKEN] is in the value of the token created earlier during the local account setup (see above). Example: `sv=2022-11-02&st=2024-01-20T19%3A29%3A07Z&se=2034-01-21T19%3A29%...`

For Azure-hosted Storage Accounts, the connection string should be in the following format:

```bash
AccountName=[YOUR_ACCOUNT_NAME];DefaultEndpointsProtocol=https;BlobEndpoint=https://[YOUR_ACCOUNT_NAME]:443/[YOUR_CONTAINER_NAME];
```

Be sure to specify the container and folder name for your environment.
