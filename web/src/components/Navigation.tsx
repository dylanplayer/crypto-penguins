import { ConnectButton } from "@rainbow-me/rainbowkit";
import ShuffleButton from "./ShuffleButton";
import Link from "next/link";

export default function Navigation() {
  return (
    <div id="navbar" className="flex w-screen flex-row justify-between p-6">
      <div>
        <span className="text-xl text-white">
          <a href="/">Crypto Penguins</a>
        </span>
      </div>
      <div className="flex space-x-4">
        <button className="max-w-[500px] rounded-lg border-2 border-[#7beacc] bg-transparent px-5 py-2.5 text-center text-sm font-medium uppercase text-[#7beacc] hover:bg-[#0c745a] disabled:cursor-not-allowed disabled:opacity-50">
          <Link href="/">Mint </Link>
        </button>
        <ShuffleButton />
        <ConnectButton />
      </div>
    </div>
  );
}
