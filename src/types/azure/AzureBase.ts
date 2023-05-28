
export type AzureBase = {
    Tags: { [key: string]: string; }
    Sku?: {
        Name: string;
        Tier?: string;
        Size?: string;
        Family?: string;
        Model?: string;
        Capacity?: number;
    }
}