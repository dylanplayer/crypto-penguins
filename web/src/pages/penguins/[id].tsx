import { type InferGetServerSidePropsType, type NextApiRequest, type NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useContractRead } from "wagmi";
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
  const router = useRouter();
  const { data, isError, isLoading } = useContractRead({
    address: `0x${contractAddress}`,
    abi: abi,
    functionName: 'getTokensByOwner',
    args: [user?.address],
  });

  const id = router.query.id as string;

  useEffect(() => {
    if (!isLoading && !isError && data) {
      const tokenIds = data as BigNumber[];
      tokenIds.forEach((tokenId: BigNumber) => {
        console.log(tokenId);
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
            <button className="w-full bg-[#f5c518] text-[#15162c] font-bold py-2 px-4 rounded">
              Transfer
            </button>
          )
        }
      </div>
    </main>
  );
}
