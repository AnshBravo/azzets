import React, { useState } from "react";
import { useAssets } from "../hooks/useAssets.js";
import { AssetCard } from "../components/marketplace/AssetCard.js";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Sparkles,
} from "lucide-react";

const CATEGORIES = [
  "all",
  "vehicles",
  "characters",
  "environments",
  "weapons",
  "props",
];

export const Home: React.FC = () => {
  // 1. Unified state hooks tracking active filter configurations
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // 2. Fetch and cache database assets reactively via your TanStack Query hook
  const { data, isLoading, isError, error } = useAssets({
    category: selectedCategory === "all" ? undefined : selectedCategory,
    page: currentPage,
    limit: 6, // Renders a perfect 3x2 grid layout balance on desktop
  });

  const assets = data?.data || [];
  const pagination = data?.pagination || { total: 0, page: 1, pages: 1 };

  // Filter items in memory by search string text to prevent extra database lookups
  const filteredAssets = assets.filter((asset: any) =>
    asset.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Always reset page index back to 1 on category shift
  };

  return (
    <div className="w-full min-h-screen relative py-6">
      {/* ============ HERO HEADLINE SECTION ============ */}
      <header className="mb-12 border-2 border-edge bg-surface p-8 shadow-glow relative overflow-hidden select-none">
        <div className="absolute -right-16 -top-16 size-48 bg-radial from-plasma/20 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-edge bg-white text-ghost font-black text-xs uppercase tracking-widest shadow-[2px_2px_0px_0px_#000000] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-ion" strokeWidth={2.5} />
            <span>Distributed Core Node</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-ghost tracking-tight leading-none">
            High-Performance <br />
            <span className="text-signature">3D Engineering Models.</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base font-medium text-mist leading-relaxed">
            Acquire fully optimized, untextured wireframe packages, complex
            spatial nodes, and production-ready components directly from top
            creators.
          </p>
        </div>
      </header>

      {/* ============ FILTER & SEARCH BAR MATRIX ============ */}
      <section className="mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search input node wrapper */}
        <div className="relative flex-1 max-w-md group">
          <Search
            className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-mist transition-colors group-focus-within:text-ion"
            strokeWidth={2}
          />
          <input
            type="text"
            placeholder="Query workspace parameters (e.g. Cruiser)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="obsidian-input w-full rounded-xl py-3 pl-11 pr-4 text-sm font-medium shadow-[2px_2px_0px_0px_#000]"
          />
        </div>

        {/* Category filtering nodes row */}
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <span className="p-2 border-2 border-edge bg-void text-ghost rounded-xl shrink-0 hidden sm:inline-block">
            <SlidersHorizontal className="w-4 h-4" strokeWidth={2.5} />
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`
                px-4 py-2 
                border-2 
                border-edge 
                font-black 
                text-xs 
                uppercase 
                tracking-wider 
                rounded-xl 
                transition-all 
                cursor-pointer
                ${
                  selectedCategory === cat
                    ? "bg-plasma text-ghost shadow-[2px_2px_0px_0px_#000000] translate-x-0.5 translate-y-0.5 shadow-none"
                    : "bg-raised text-mist hover:bg-surface hover:text-ghost shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ============ ASSETS INTERACTIVE GRID VIEWER ============ */}
      {isLoading ? (
        <div className="min-h-[40vh] grid place-items-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2
              className="w-8 h-8 animate-spin text-ion"
              strokeWidth={2.5}
            />
            <p className="text-sm font-black text-mist tracking-wider">
              Syncing Global Stores...
            </p>
          </div>
        </div>
      ) : isError ? (
        <div className="border-2 border-edge bg-flare/10 p-6 text-center text-edge font-bold rounded-xl shadow-glow">
          💥 Database Request Error:{" "}
          {(error as any)?.message || "Failed to fetch asset matrices."}
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="border-2 border-edge border-dashed bg-surface py-16 text-center rounded-xl">
          <p className="text-lg font-black text-ghost">
            No operational assets matched your search parameters.
          </p>
          <p className="text-xs font-medium text-mist mt-1">
            Try resetting your active navigation filters or search tags.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-rise">
          {filteredAssets.map((asset: any) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      )}

      {/* ============ NEO-BRUTALIST PAGINATION CONTROLS ============ */}
      {!isLoading && !isError && pagination.pages > 1 && (
        <nav className="mt-12 flex items-center justify-center gap-4 select-none">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-3 border-2 border-edge bg-raised text-ghost rounded-xl font-black shadow-[2px_2px_0px_0px_#000000] hover:bg-surface active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={3} />
          </button>

          <span className="px-4 py-2 border-2 border-edge bg-white text-ghost font-black text-xs rounded-xl shadow-[3px_3px_0px_0px_#000000]">
            NODE: {pagination.page} / {pagination.pages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, pagination.pages))
            }
            disabled={currentPage === pagination.pages}
            className="p-3 border-2 border-edge bg-raised text-ghost rounded-xl font-black shadow-[2px_2px_0px_0px_#000000] hover:bg-surface active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={3} />
          </button>
        </nav>
      )}
    </div>
  );
};
