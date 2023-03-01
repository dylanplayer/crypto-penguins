import { ConnectButton } from "@rainbow-me/rainbowkit";
import ShuffleButton from "./ShuffleButton";

export default function Navigation() {
  return (
    <div id="navbar" className="w-screen p-6 flex flex-row justify-between">
      <div>
        <span className="text-white text-xl"><a href="/">Crypto Penguins</a></span>
      </div>
      <div className="flex space-x-4">
        <button
          className="max-w-[500px] uppercase text-[#7beacc] border-[#7beacc] border-2 bg-transparent hover:bg-[#0c745a] font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:cursor-not-allowed disabled:opacity-50"
        ><a href="/">Mint </a></button>
        <ShuffleButton />
        <ConnectButton />
      </div>
    </div>
  )
};
