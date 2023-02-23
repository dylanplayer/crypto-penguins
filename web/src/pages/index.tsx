import { InferGetServerSidePropsType, NextApiRequest, NextApiResponse, type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { getSession } from "next-auth/react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { useEffect } from "react";
import { env } from "@/env.mjs";
import CONTRACT from '../../../hardhat/artifacts/contracts/CryptoPenguin.sol/CryptoPenguin.json';
import { sepolia } from "wagmi/chains";

export async function getServerSideProps({ req, _res }: { req: NextApiRequest, _res: NextApiResponse }) {
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

export default function Home({ user, abi, contractAddress }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { config } = usePrepareContractWrite({
    address: `0x${contractAddress}`,
    abi,
    functionName: 'mint',
    chainId: sepolia.id,
    // ignore this error
    args: [
      user?.address,
    ],
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  // Need to redirect to penguin page here
  useEffect(() => {
    if (isSuccess) {
      console.log(data);
    }
  }, [isSuccess, data])

  return (
    <>
      <Head>
        <title>Crypto Penguins</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#024b6d] to-[#15162c]">
        <div className="container max-w-md flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-4xl font-bold text-white text-center">Crypto Penguins</h1>
          <Image
            src="/assets/penguins/1.png"
            alt="Crypto Penguin Egg"
            width={450}
            height={450}
            className="rounded"
          />
          {write && (
            <button
              disabled={!write}
              className="w-full text-white bg-blue-400 dark:bg-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => write()}
            >Mint</button>
          )}
        </div>
      </main>
    </>
  );
};
