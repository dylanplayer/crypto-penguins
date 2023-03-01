import {
  type InferGetServerSidePropsType,
  type NextApiRequest,
  type NextApiResponse,
} from "next";
import Head from "next/head";
import Image from "next/image";
import { getSession } from "next-auth/react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useEffect, useState } from "react";
import { env } from "@/env.mjs";
import CONTRACT from "../../../hardhat/artifacts/contracts/CryptoPenguin.sol/CryptoPenguin.json";
import { sepolia } from "wagmi/chains";
import { useRouter } from "next/router";
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

export default function Home({
  user,
  abi,
  contractAddress,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [randomPenguin, setRandomPenguin] = useState(
    Math.floor(Math.random() * 1000) + 1
  );

  const { config } = usePrepareContractWrite({
    address: `0x${contractAddress}`,
    abi,
    functionName: "mint",
    chainId: sepolia.id,
    args: [user?.address],
  });
  const { data, isLoading, write } = useContractWrite(config);
  const { isLoading: waitingForConfirmations, isSuccess: confirmed } =
    useWaitForTransaction({
      confirmations: 9,
      hash: data?.hash,
    });

  useEffect(() => {
    if (!waitingForConfirmations && confirmed && data) {
      void router.push(`/api/tx/${data.hash}`);
    }
  }, [waitingForConfirmations, confirmed, data, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRandomPenguin(Math.floor(Math.random() * 1000) + 1);
    }, 800);
    return () => clearInterval(interval);
  });

  return (
    <>
      <Head>
        <title>Crypto Penguins</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="grid h-full min-h-screen grid-cols-12 gap-4 bg-gradient-to-b from-[#024b6d] to-[#15162c]">
        <div className="col-span-12">
          <Navigation />
        </div>
        <div
          id="crypto-penguin-block"
          className="col-span-12 flex justify-around md:col-span-6 md:col-start-4"
        >
          <div id="nft-block" className="flex flex-col space-y-6">
            <div
              id="nft-image"
              className="relative h-[500px] w-full min-w-[500px] overflow-hidden rounded-2xl"
            >
              <Image
                src={`/assets/penguins/${randomPenguin}/penguin.png`}
                alt="Random Crypto Penguin"
                layout="fill"
                objectFit="cover"
              />
            </div>

            <div id="cta-and-loading" className="pt-8">
              {!isLoading && write && (
                <div className="flex flex-col space-y-6" id="button-block">
                  <button
                    disabled={!write}
                    className="px-auto max-w-[500px] animate-bounce rounded-lg border-2 border-[#7beacc] bg-[#7beacc] px-5 py-2.5 text-center text-sm font-medium uppercase text-violet-900 hover:border-[#009d86] hover:bg-[#009d86] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => write()}
                  >
                    Mint a random penguin
                  </button>
                  <ShuffleButton />
                </div>
              )}
              {isLoading && (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="mr-2 h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              )}
              {waitingForConfirmations && (
                <div className="flex max-w-[500px] flex-col items-center gap-1 overflow-ellipsis">
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="mr-2 h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">
                      Waiting for confirmations...
                    </span>
                  </div>
                  <p className="mt-4 text-center text-white">
                    Waiting for 9 confirmations
                  </p>
                  <p className="max-w-[500px] overflow-hidden text-ellipsis text-center text-white">
                    Transaction: {data?.hash}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
