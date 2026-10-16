import React from "react";
import { Link } from "react-router-dom";
import { Box, User, Tag, ShoppingBag } from "lucide-react";
import { GlassCard } from "../common/GlassCard";

// Mirror your Prisma database Asset & User relation typings cleanly
export interface AssetCardProps {
  asset: {
    id: string;
    title: string;
    description?: string | null;
    category: string;
    licenseType: string;
    price: string | number;
    creator: {
      username: string;
      avatarUrl?: string | null;
    };
    files: Array<{
      fileType: string;
    }>;
  };
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
  // Format price matrix cleanly (handles standard Decimal strings from backend safely)
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "usd",
  }).format(Number(asset.price));

  // Extract file types (e.g., model/gltf-binary becomes GLB) to build high contrast badges
  const getCleanExtension = (mimeType: string) => {
    if (mimeType.includes("gltf") || mimeType.includes("glb")) return "GLB";
    if (mimeType.includes("fbx")) return "FBX";
    if (mimeType.includes("obj")) return "OBJ";
    return "3D";
  };

  return (
    <div className="group relative transition-all duration-150">
      <GlassCard hoverEffect className="flex flex-col h-full overflow-hidden">
        <div className="w-full aspect-video bg-surface border-b-2 border-edge -mx-6 -mt-6 mb-4 relative flex items-center justify-center overflow-hidden bg-wireframe group-hover:bg-hero-glow transition-all duration-300">
          <Box
            className="w-12 h-12 text-mist group-hover:text-ion transition-colors group-hover:scale-110 duration-300"
            strokeWidth={1.5}
          />

          <div className="absolute top-3 right-3 px-2 py-0.5 border-2 border-edge bg-white text-ghost text-xs font-black rounded-md shadow-[2px_2px_0px_0px_#000000]">
            {asset.files[0] ? getCleanExtension(asset.files[0].fileType) : "3D"}
          </div>
        </div>

        {/*  Asset Identification Block */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 border border-edge bg-plasma text-ghost rounded">
                {asset.category}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-mist flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {asset.licenseType}
              </span>
            </div>

            <h3 className="text-lg font-black text-ghost line-clamp-1 group-hover:text-ion transition-colors">
              {asset.title}
            </h3>

            <p className="text-xs font-medium text-mist line-clamp-2 mt-1 min-h-[32px]">
              {asset.description ||
                "Premium untextured engineering 3D asset cluster listing."}
            </p>
          </div>

          {/* Creator Deck & Pricing Action Row */}
          <div className="mt-5 pt-4 border-t-2 border-dashed border-edge flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="size-6 rounded border border-edge bg-white flex items-center justify-center text-ghost text-[10px] font-black uppercase shrink-0">
                {asset.creator.username.substring(0, 2)}
              </div>
              <span className="text-xs font-bold text-ghost truncate">
                {asset.creator.username}
              </span>
            </div>

            <Link
              to={`/assets/${asset.id}`}
              className="px-3 py-1.5 border-2 border-edge bg-ion text-white font-black text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000000] hover:bg-orange-500 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all rounded-lg select-none"
            >
              <ShoppingBag className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span>{formattedPrice}</span>
            </Link>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
