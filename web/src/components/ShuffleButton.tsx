import Link from "next/link";

export default function ShuffleButton() {
  return (
    <button className="max-w-[500px] rounded-lg border-2 border-violet-600 bg-transparent px-5 py-2.5 text-center text-sm font-medium uppercase text-violet-300 hover:bg-violet-900 disabled:cursor-not-allowed disabled:opacity-50">
      <Link href="/all_penguins">See all penguins</Link>
    </button>
  );
}
