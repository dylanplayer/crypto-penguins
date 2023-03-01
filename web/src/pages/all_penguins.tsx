import {
    type InferGetServerSidePropsType,
    type NextApiRequest,
    type NextApiResponse,
  } from "next";
  import Head from "next/head";
  import Image from "next/image";
  import { getSession } from "next-auth/react";
  import { env } from "@/env.mjs";
  import CONTRACT from "../../../hardhat/artifacts/contracts/CryptoPenguin.sol/CryptoPenguin.json";
  import { sepolia } from "wagmi/chains";
  import Navigation from "@/components/Navigation";
  import ShuffleButton from "@/components/ShuffleButton";
  
  export async function getServerSideProps({
    req,
  }: {
    req: NextApiRequest;
    res: NextApiResponse;
  }) {
    const session = await getSession({ req });
    const abi = CONTRACT.abi;
  
    if (!session) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  
    return {
      props: { abi, user: session.user, contractAddress: env.CONTRACT_ADDRESS },
    };
  }
  
  export default function PenguinIndex({
    user,
    abi,
    contractAddress,
  }: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const allPenguins = []

    for (let i = 1; i < 100; i++) {
      allPenguins.push(i);
    }

    const penguinImages = allPenguins.map((i) =>
      <div key={i} className="m-4">
        <div className="overflow-hidden rounded-xl m-4 mt-6 border-4 hover:border-violet-600 border-transparent">
          <a href={`/penguins/${i}`}>
            <Image
              src={`/assets/penguins/${i}/penguin.png`}
              alt="Random Crypto Penguin"
              width={250}
              height={250}
            />
          </a>
        </div>
        <p className="text-center text-white">CryptoPenguin <strong>{i}</strong></p>
      </div>
    );
  
  
    return (
      <>
        <Head>
          <title>Crypto Penguins</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex flex-col h-full min-h-screen bg-gradient-to-b from-[#024b6d] to-[#15162c]">
          <Navigation />
          <div className="flex flex-wrap justify-evenly p-20">
            {penguinImages}
          </div>
        </main>
      </>
    );
  }
  