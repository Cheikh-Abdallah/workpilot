import RetryButton from "./retry-button";

export default function OfflinePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <div className="max-w-md">
        <div className="mb-6 text-6xl">📡</div>

        <h1 className="text-3xl font-bold text-[#060691]">
          Vous êtes hors connexion
        </h1>

        <p className="mt-4 text-gray-600">
          Impossible de charger cette page pour le moment.
          Vérifiez votre connexion Internet et réessayez.
        </p>

        <RetryButton />
      </div>
    </main>
  );
}