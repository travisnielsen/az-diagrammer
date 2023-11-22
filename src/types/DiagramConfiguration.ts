
export type DiagramConfiguration = {
    id: string,
    name: string,
    subscriptionId: string,
    excludeTags: string,
    connectionString: string,
    containerName: string,
    folderName: string,
    selected: boolean
}

export type Tags = {
    [key: string]: string
}