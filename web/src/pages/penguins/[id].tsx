import { type InferGetServerSidePropsType, type NextApiRequest, type NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { sepolia } from "wagmi/chains";
import CONTRACT from '../../../../hardhat/artifacts/contracts/CryptoPenguin.sol/CryptoPenguin.json';
import { env } from "process";
import { type BigNumber } from "ethers";

export async function getServerSideProps({ req }: { req: NextApiRequest, res: NextApiResponse }) {
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

export default function PenguinPage({ user, abi, contractAddress }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isOwner, setIsOwner] = useState(false);
  const [recipient, setRecipient] = useState<string>('');

  const router = useRouter();
  const id = router.query.id as string;

  const { data, isError, isLoading } = useContractRead({
    address: `0x${contractAddress}`,
    abi: abi,
    functionName: 'getTokensByOwner',
    args: [user?.address],
  });

  const { config: transferConfig } = usePrepareContractWrite({
    address: `0x${contractAddress}`,
    abi,
    functionName: 'transfer',
    chainId: sepolia.id,
    args: [
      user?.address,
      recipient,
      id,
    ],
  })
  const { data: transferData, isLoading: transeferIsLoading, write: transfer } = useContractWrite(transferConfig);

  const { isLoading: waitingForTransferConfirmations, isSuccess: transferConfirmed } = useWaitForTransaction({
    confirmations: 5,
    hash: transferData?.hash,
  })

  useEffect(() => {
    if (!isLoading && !isError && data) {
      const tokenIds = data as BigNumber[];
      tokenIds.forEach((tokenId: BigNumber) => {
        if (tokenId.toNumber() === Number(id)) {
          setIsOwner(true);
        }
      })
    }
  }, [isLoading, isError, data, id]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#024b6d] to-[#15162c]">
      <div className="container max-w-md flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-4xl font-bold text-white text-center"># {id}</h1>
        <Image
          src={`/assets/penguins/${id}.png`}
          alt="Crypto Penguin"
          width={450}
          height={450}
          className="rounded"
        />
        {
          isOwner && (
            <div className="w-full flex flex-col items-center gap-2">
              <h1 className="text-2xl font-bold text-white text-center">Transfer</h1>
              {
                !transeferIsLoading && !transferConfirmed && (
                  <div className="w-full flex flex-col gap-1">
                    <label className="text-white" htmlFor="recipient">Recipient</label>
                    <input
                      className="w-full bg-white text-[#15162c] font-bold py-2 px-4 rounded text-sm"
                      type="text"
                      placeholder="Enter a recipient"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                    />
                  </div>
                )
              }
              {
                !transeferIsLoading && !transferConfirmed && recipient && transfer ? (
                  <button
                    type="button"
                    className="w-full bg-[#f5c518] text-[#15162c] font-bold py-2 px-4 rounded"
                    onClick={() => transfer()}
                  >
                    Transfer
                  </button>
                ) : recipient.length === 64 ? (
                  <p className="text-white">Please enter a valid recipient address</p>
                ) : (
                  <></>
                )
              }
              {
                waitingForTransferConfirmations && (
                  <div className="flex flex-col items-center gap-1">
                    <div role="status">
                        <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <span className="sr-only">Waiting for confirmations...</span>
                    </div>
                    <p className="text-white text-center mt-4">Waiting for 5 confirmations</p>
                    <p className="text-white text-center">Transaction: {transferData?.hash}</p>
                  </div>
                )
              }
              {
                transferConfirmed && (
                  <p className="text-white text-center">Transfer confirmed!</p>
                )
              }
            </div>
          )
        }
      </div>
    </main>
  );
}
