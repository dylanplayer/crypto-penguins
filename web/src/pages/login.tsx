import { useRouter } from "next/router";
import { useAuthRequestChallengeEvm } from "@moralisweb3/next";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { signIn, useSession } from "next-auth/react";
import { useAccount, useSignMessage, useNetwork } from "wagmi";
import { useEffect } from "react";

export default function LoginPage() {
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const { status } = useSession();
  const { signMessageAsync } = useSignMessage();
  const { push } = useRouter();
  const { requestChallengeAsync } = useAuthRequestChallengeEvm();

  useEffect(() => {
    const handleAuth = async () => {
      if (chain && address) {
        try {
          const challenge = await requestChallengeAsync({
            address: address,
            chainId: chain.id,
          });
    
          const message = challenge?.message;
    
          if (message) {
            const signature = await signMessageAsync({ message });
      
            const res = await signIn("moralis-auth", {
              message,
              signature,
              redirect: false,
              callbackUrl: "/",
            });
  
            if (res?.url) {
              void push(res?.url);
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
    
    if (status === "unauthenticated" && isConnected) {
      void handleAuth();
    }
  }, [status, isConnected, chain, address, requestChallengeAsync, signMessageAsync, push]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#024b6d] to-[#15162c]">
      <div className="container max-w-md flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-4xl font-bold text-white text-center">Welcome to Crypto Penguins</h1>
        <p className="text-white text-center">Please connect your wallet to continue</p>
        <ConnectButton />
      </div>
    </main>
  );
}
