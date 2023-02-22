import { createClient, configureChains, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { mainnet } from "wagmi/chains";
import { SessionProvider } from "next-auth/react";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { AppType } from "next/app";
import { Session } from "next-auth";

import "@/styles/globals.css";

const { provider, webSocketProvider, chains } = configureChains(
  [mainnet],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Crypto Penguins",
  chains,
});

const client = createClient({
  provider,
  webSocketProvider,
  autoConnect: true,
  connectors,
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <WagmiConfig client={client}>
      <SessionProvider session={session} refetchInterval={0}>
        <RainbowKitProvider chains={chains}>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </SessionProvider>
    </WagmiConfig>
  );
};

export default MyApp;
