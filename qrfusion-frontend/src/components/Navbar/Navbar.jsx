import { Compass } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="absolute top-0 left-0 w-full z-50 px-12 py-6 flex justify-between items-center">

      <div className="flex items-center gap-3">

        <Compass
          size={30}
          className="text-yellow-300"
        />

        <h1 className="text-3xl font-bold text-white">
          QrFusion
        </h1>

      </div>

      <button
        className="
        bg-yellow-400
        px-6
        py-3
        rounded-full
        font-semibold
        hover:scale-105
        transition"
      >
        Generate QR
      </button>

    </nav>
  );
}