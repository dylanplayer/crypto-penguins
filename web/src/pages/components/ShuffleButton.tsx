export default function ShuffleButton(shuffle: any) {
    return (
      <button
        className="w-full text-violet-300 border-violet-600 border-2 bg-transparent hover:bg-violet-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => (shuffle)} 
      >REGENERATE </button>
    )
}