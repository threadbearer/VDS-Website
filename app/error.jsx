"use client";
export default function Error({ error, reset }) {
  return (
    <main className="grid min-h-screen place-items-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-3xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-neutral-400">{error?.message ?? "Unknown error"}</p>
        <button onClick={()=>reset()} className="mt-6 rounded-full bg-white px-4 py-2 text-black">Try again</button>
      </div>
    </main>
  );
}