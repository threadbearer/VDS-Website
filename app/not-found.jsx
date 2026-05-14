export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-3xl font-semibold">Page not found</h1>
        <p className="mt-2 text-neutral-400">Let’s get you back on track.</p>
        <a href="/" className="mt-6 inline-block rounded-full bg-white px-4 py-2 text-black">Go home</a>
      </div>
    </main>
  );
}