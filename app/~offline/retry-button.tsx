"use client";

export default function RetryButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="mt-8 rounded-lg bg-[#060691] px-6 py-3 font-semibold text-white hover:opacity-90"
    >
      Réessayer
    </button>
  );
}