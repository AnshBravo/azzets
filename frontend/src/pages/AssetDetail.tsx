import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAssetDetail } from "../hooks/useAssetDetail.js";
import { paymentApi } from "../api/paymentApi.js";
import { ModelViewer } from "../components/marketplace/ModelViewer.js";
import {
  ShoppingBag,
  Loader2,
  ArrowLeft,
  Shield,
  FileCode,
  ExternalLink,
} from "lucide-react";

export const AssetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // 1. Fetch live metadata and active S3 preview URL paths in tandem
  const { data, isLoading, isError, error } = useAssetDetail(id || "");

  const asset = data?.data;
  const previewFile = asset?.files?.find(
    (f: any) => f.fileType.includes("glb") || f.fileType.includes("gltf"),
  );

  const handlePurchase = async () => {
    if (!id) return;
    try {
      setCheckoutLoading(true);

      // 2. Trigger your backend Stripe session initiator route
      const response = await paymentApi.createCheckoutSession(id);

      if (response.checkoutUrl) {
        // Redirect browser viewport straight to Stripe's payment gateways
        window.location.href = response.checkoutUrl;
      }
    } catch (err: any) {
      alert(
        err.message ||
          "Failed to initialize payment gateway interaction loops.",
      );
      setCheckoutLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 min-h-[60vh] grid place-items-center bg-void">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            className="w-8 h-8 animate-spin text-ion"
            strokeWidth={2.5}
          />
          <p className="text-sm font-black text-mist tracking-wider">
            Syncing Architectural Canvas Layouts...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !asset) {
    return (
      <div className="w-full max-w-xl mx-auto mt-12 border-2 border-edge bg-flare/10 p-6 text-center text-edge font-bold rounded-xl shadow-glow">
        💥 File Node Fault:{" "}
        {(error as any)?.message ||
          "The requested 3D asset cluster could not be parsed."}
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "usd",
  }).format(Number(asset.price));

  return (
    <div className="w-full relative py-4 animate-rise">
      {/* Back button anchor navigation row */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-black uppercase text-mist hover:text-ghost transition-colors mb-6 cursor-pointer select-none"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={3} />
        <span>Return to Marketplace Feed</span>
      </button>

      {/* Main Structural Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 items-start">
        {/* LEFT COLUMN: The Interactive 3D WebGL Canvas Layer */}
        <div className="flex flex-col gap-4">
          <ModelViewer url={previewFile?.downloadUrl || ""} />
          <div className="text-[10px] font-bold text-mist uppercase tracking-widest flex items-center gap-1.5 select-none">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>
              Interaction map: Mouse left drag to rotate • Right click drag to
              pan • Scroll zoom
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: The Opaque Checkout Parameter Deck */}
        <div className="flex flex-col gap-6">
          <div className="bg-raised border-2 border-edge p-8 shadow-glow rounded-xl">
            <div className="flex items-center gap-2 mb-3 select-none">
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 border border-edge bg-plasma text-ghost rounded">
                {asset.category}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 border border-edge bg-white text-ghost rounded">
                {asset.licenseType} License
              </span>
            </div>

            <h1 className="text-3xl font-black text-ghost tracking-tight mb-2">
              {asset.title}
            </h1>

            <p className="text-sm font-medium text-mist leading-relaxed mb-6">
              {asset.description ||
                "Premium structural architecture model asset profile listed by a verified creator node."}
            </p>

            <div className="h-px bg-edge w-full mb-6" />

            {/* Price block and actions */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-mist select-none">
                  Asset Acquisition Cost
                </p>
                <p className="text-4xl font-black text-ghost tracking-tight">
                  {formattedPrice}
                </p>
              </div>
            </div>

            <button
              onClick={handlePurchase}
              disabled={checkoutLoading}
              className="w-full py-4 rounded-xl font-black text-sm transition-all duration-150 border-2 border-edge bg-ion text-white hover:bg-orange-500 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none shadow-glow flex justify-center items-center gap-2 select-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {checkoutLoading ? (
                <>
                  <Loader2
                    className="w-5 h-5 animate-spin text-white"
                    strokeWidth={2.5}
                  />
                  <span>Connecting Secure Gateways...</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" strokeWidth={2.5} />
                  <span>Initialize Checkout Session</span>
                </>
              )}
            </button>
          </div>

          {/* Meta Specifications Box Container */}
          <div className="bg-surface border-2 border-edge p-6 rounded-xl text-xs font-bold text-mist space-y-3 select-none">
            <h3 className="text-sm font-black text-ghost uppercase tracking-wide flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-plasma-light" />
              <span>Asset File Integrity Audit</span>
            </h3>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-mist">
                <FileCode className="w-3.5 h-3.5" /> Core Target Architecture
              </span>
              <span className="text-ghost uppercase font-black">
                {previewFile?.fileType?.split("/")[1] || "GLB"} Format
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Creator Ledger Profile</span>
              <span className="text-ghost font-black">
                @{asset.creator.username}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
