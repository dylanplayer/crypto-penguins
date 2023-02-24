import { env } from "@/env.mjs";
import { type NextApiRequest, type NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;
  const penguin = {
    id: id ,
    image: `${env.NEXTAUTH_URL}/assets/penguins/${id}.png`,
  }
  res.status(200).json(penguin);
}
