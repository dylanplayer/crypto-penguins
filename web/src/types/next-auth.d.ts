// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      address: string;
      chainId: number;
      domain:string;
      id: string;
      nonce: string;
      payload: string | null;
      profileId: string;
      uri: string;
      version: string;
    }
  }
}
