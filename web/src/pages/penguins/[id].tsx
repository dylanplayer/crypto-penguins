import {
  type InferGetServerSidePropsType,
  type NextApiRequest,
  type NextApiResponse,
} from "next";
import { getSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { sepolia } from "wagmi/chains";
import CONTRACT from "../../../../hardhat/artifacts/contracts/CryptoPenguin.sol/CryptoPenguin.json";
import { env } from "process";
import { type BigNumber } from "ethers";
import Navigation from "@/components/Navigation";

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

export default function PenguinPage({
  user,
  abi,
  contractAddress,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isOwner, setIsOwner] = useState(false);
  const [recipient, setRecipient] = useState<string>("");

  const router = useRouter();
  const id = router.query.id as string;

  const { data, isError, isLoading } = useContractRead({
    address: `0x${contractAddress}`,
    abi: abi,
    functionName: "getTokensByOwner",
    args: [user?.address],
  });

  const { config: transferConfig } = usePrepareContractWrite({
    address: `0x${contractAddress}`,
    abi,
    functionName: "transfer",
    chainId: sepolia.id,
    args: [user?.address, recipient, id],
  });
  const {
    data: transferData,
    isLoading: transeferIsLoading,
    write: transfer,
  } = useContractWrite(transferConfig);

  const {
    isLoading: waitingForTransferConfirmations,
    isSuccess: transferConfirmed,
  } = useWaitForTransaction({
    confirmations: 9,
    hash: transferData?.hash,
  });

  useEffect(() => {
    if (!isLoading && !isError && data) {
      const tokenIds = data as BigNumber[];
      tokenIds.forEach((tokenId: BigNumber) => {
        if (tokenId.toNumber() === Number(id)) {
          setIsOwner(true);
        }
      });
    }
  }, [isLoading, isError, data, id]);

  interface PenguinData {
    id: number;
    background: string;
    feet: string;
    body: string;
    bill: string;
    flippers: string;
    eyes: string;
    p_accessory: string;
  }

  const [penguinData, setPenguinData] = useState<PenguinData>({
    id: 0,
    background: "arctic",
    feet: "Penguin",
    body: "A cute penguin.",
    bill: "",
    flippers: "",
    eyes: "",
    p_accessory: "",
  });

  const getPenguinData = async () => {
    const penguinMetadata = `/assets/penguins/${id}/metadata.json`;
    const response = await fetch(penguinMetadata);
    const data = await response.json();
    setPenguinData({
      id: data.id,
      background: data.attributes[0].value,
      feet: data.attributes[1].value,
      body: data.attributes[2].value,
      bill: data.attributes[3].value,
      flippers: data.attributes[4].value,
      eyes: data.attributes[5].value,
      p_accessory: data.attributes[6].value,
    });
    console.log(penguinData);
  };

  useEffect(() => {
    getPenguinData();
  }, []);

  return (
    <main className="grid min-h-screen grid-cols-12 grid-rows-6 bg-gradient-to-b from-[#024b6d] to-[#15162c]">
      <div className="col-span-12">
        <Navigation />
      </div>
      <div className="col-span-12 row-span-3 mx-auto -mt-20 flex flex-wrap space-y-10 p-4 md:mt-20 md:space-x-10 md:space-y-0">
        <div className="overflow-hidden rounded-xl">
          <Image
            src={`/assets/penguins/${penguinData.id}/penguin.png`}
            alt="Random Crypto Penguin"
            width={500}
            height={500}
          />
        </div>
        <div
          id="penguinData"
          className="flex flex-col justify-between gap-2 text-lg text-white"
        >
          <h1 className="mb-4 text-center text-2xl font-bold text-white">
            Crypto Penguin # {id}
          </h1>
          <p>
            Background: <strong>{penguinData.background}</strong>
          </p>
          <p>
            Feet: <strong>{penguinData.feet}</strong>
          </p>
          <p>
            Body: <strong>{penguinData.body}</strong>
          </p>
          <p>
            Bill: <strong>{penguinData.bill}</strong>
          </p>
          <p>
            Flippers: <strong>{penguinData.flippers}</strong>
          </p>
          <p>
            Eyes: <strong>{penguinData.eyes}</strong>
          </p>
          <p>
            Accessory: <strong>{penguinData.p_accessory}</strong>
          </p>

          {isOwner && (
            <div className="my-2 flex w-full flex-col gap-2 rounded-md bg-[#271976] p-4">
              <p className="text-left text-xl font-bold text-violet-200">
                Transfer
              </p>
              {!transeferIsLoading && !transferConfirmed && (
                <div className="flex w-full flex-col gap-1">
                  <label className="text-violet-300" htmlFor="recipient">
                    Recipient
                  </label>
                  <input
                    className="w-full rounded bg-slate-300 py-2 px-4 text-sm font-bold text-violet-900 outline-violet-500 focus:bg-white"
                    type="text"
                    placeholder="Enter a recipient"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                </div>
              )}
              {!transeferIsLoading &&
              !transferConfirmed &&
              recipient &&
              transfer ? (
                <button
                  type="button"
                  className="w-full rounded bg-[#f5c518] py-2 px-4 font-bold text-[#15162c]"
                  onClick={() => transfer()}
                >
                  Transfer
                </button>
              ) : recipient.length === 64 ? (
                <p className="text-white">
                  Please enter a valid recipient address
                </p>
              ) : (
                <></>
              )}
              {waitingForTransferConfirmations && (
                <div className="flex flex-col items-center gap-1">
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
                  <p className="text-center text-white">
                    Transaction: {transferData?.hash}
                  </p>
                </div>
              )}
              {transferConfirmed && (
                <p className="text-center text-white">Transfer confirmed!</p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="col-span-12"></div>
    </main>
  );
}
