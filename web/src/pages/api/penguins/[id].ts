import { env } from "@/env.mjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const penguin = {
    id,
    image: `${env.NEXTAUTH_URL}/assets/penguins/${id}.png`,
  }
  res.status(200).json(penguin);
}
