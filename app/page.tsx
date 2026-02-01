import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main>
        <div className="">
          <h1>My Task App</h1>
          <button className="border">Add</button>
        </div>
      </main>
    </div>
  );
}
