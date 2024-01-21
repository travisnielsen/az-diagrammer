import { TokenCredential, AccessToken } from "@azure/identity";

export class AccessTokenCredential implements TokenCredential {

    token: string;

    constructor(accessToken: string) {
        this.token = accessToken;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getToken(_scopes: string | string[]): Promise<AccessToken | null> {
        return { token: this.token, expiresOnTimestamp: 0 };
    }
}