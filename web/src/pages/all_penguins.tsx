import Head from "next/head";
import Image from "next/image";
import Navigation from "@/components/Navigation";

export default function PenguinIndex() {
  const allPenguins = [];

  for (let i = 1; i < 101; i++) {
    allPenguins.push(i);
  }

  const penguinImages = allPenguins.map((i: number) => (
    <div key={i} className="m-4">
      <div className="m-4 mt-6 overflow-hidden rounded-xl border-4 border-transparent hover:border-violet-600">
        <a href={`/penguins/${i}`}>
          <Image
            src={`/assets/penguins/${i}/penguin.png`}
            alt="Random Crypto Penguin"
            width={250}
            height={250}
          />
        </a>
      </div>
      <p className="text-center text-white">
        CryptoPenguin <strong>{i}</strong>
      </p>
    </div>
  ));

  return (
    <>
      <Head>
        <title>Crypto Penguins</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-full min-h-screen flex-col bg-gradient-to-b from-[#024b6d] to-[#15162c]">
        <Navigation />
        <div className="flex flex-wrap justify-evenly p-20">
          {penguinImages}
        </div>
      </main>
    </>
  );
}
