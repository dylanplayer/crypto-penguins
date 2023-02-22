import { env } from "@/env.mjs";
import { MoralisNextApi } from '@moralisweb3/next';

export default MoralisNextApi({
  apiKey: env.MORALIS_API_KEY,
  authentication: {
    domain: env.APP_DOMAIN,
    uri: env.NEXTAUTH_URL,
    timeout: 120,
  },
});
