import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  return (
    <div id="navbar" className="w-screen p-6 flex flex-row justify-between">
      <div>
        <span className="text-white text-xl"><a href="/">Crypto Penguins</a></span>
      </div>
      <div>
        <ConnectButton />
      </div>
    </div>
  )
};