/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { env } from "@/env.mjs";
import { type NextApiRequest, type NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const hash = req.query.hash as string;

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'X-API-Key': env.MORALIS_API_KEY,
    },
  };
  
  const response = await fetch(`https://deep-index.moralis.io/api/v2/transaction/${hash}/verbose?chain=sepolia`, options);
  const data = await response.json();

  const tokenId = data.logs[0].decoded_event.params[2].value as string;

  res.redirect(`/penguins/${tokenId}`);
}
