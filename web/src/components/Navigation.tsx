import { ConnectButton } from "@rainbow-me/rainbowkit";
import ShuffleButton from "./ShuffleButton";

export default function Navigation() {
  return (
    <div id="navbar" className="w-screen p-6 flex flex-row justify-between">
      <div>
        <span className="text-white text-xl"><a href="/">Crypto Penguins</a></span>
      </div>
      <div className="flex space-x-4">
        <ShuffleButton />
        <ConnectButton />
      </div>
    </div>
  )
};