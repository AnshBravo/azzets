import React, { useState } from "react";
import { useOrders } from "../hooks/useOrders.js";
import { apiClient } from "../api/client.js";
import { Layers, DownloadCloud, Loader2, FolderLock, Box } from "lucide-react";

export const Vault: React.FC = () => {
  const { data, isLoading, isError, error } = useOrders();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const orders = data?.data || [];

  /**
   * ⚡ SECURE S3 DOWNLOAD ORCHESTRATOR
   * Requests a short-lived presigned download signature token from the backend,
   * and cleanly forces the browser window to download the asset binary payload.
   */
  const handleDownload = async (orderId: string, assetTitle: string) => {
    try {
      setDownloadingId(orderId);

      // 1. Ask your backend gatekeeper route to verify purchase and issue an official download link
      const response = await apiClient.get(`/orders/${orderId}/download`);
      const { downloadUrl } = response.data;

      if (!downloadUrl) {
        throw new Error(
          "S3 download link configuration could not be resolved.",
        );
      }

      // 2. Programmatically trigger a clean browser file download stream sequence
      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      anchor.setAttribute(
        "download",
        `${assetTitle.toLowerCase().replace(/\s+/g, "-")}.glb`,
      );
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } catch (err: any) {
      alert(err.message || "Failed to establish secure file stream links.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="w-full relative py-4 animate-rise">
      {/* Module Title Banner */}
      <div className="mb-8 border-b-2 border-dashed border-edge pb-6 select-none">
        <h1 className="text-3xl font-black text-ghost tracking-tight flex items-center gap-3">
          <span className="p-2 rounded bg-plasma border border-edge shadow-[2px_2px_0px_0px_#000]">
            <Layers className="w-5 h-5 text-ghost" />
          </span>
          <span>My Cryptographic Vault</span>
        </h1>
        <p className="text-sm font-medium text-mist mt-2">
          Verify data permissions and execute high-speed direct-to-cloud
          downloads for your owned 3D assets.
        </p>
      </div>

      {/* ============ INVENTORY RENDERING BLOCK ============ */}
      {isLoading ? (
        <div className="min-h-[40vh] grid place-items-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2
              className="w-8 h-8 animate-spin text-ion"
              strokeWidth={2.5}
            />
            <p className="text-sm font-black text-mist tracking-wider">
              Syncing Inventory Ledger Node...
            </p>
          </div>
        </div>
      ) : isError ? (
        <div className="border-2 border-edge bg-flare/10 p-6 text-center text-edge font-bold rounded-xl shadow-glow">
          💥 Inventory Sync Error:{" "}
          {(error as any)?.message || "Failed to load purchase history."}
        </div>
      ) : orders.length === 0 ? (
        <div className="border-2 border-edge border-dashed bg-surface py-16 text-center rounded-xl p-6">
          <FolderLock className="w-12 h-12 text-mist mx-auto mb-4 stroke-[1.5]" />
          <p className="text-lg font-black text-ghost">
            Your storage vault is completely empty.
          </p>
          <p className="text-xs font-medium text-mist mt-1 max-w-sm mx-auto">
            Acquired marketplace assets will unlock automatically right here
            with full permanent transmission rights.
          </p>
        </div>
      ) : (
        /* Inventory Table / Card Deck */
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div
              key={order.id}
              className="bg-raised border-2 border-edge p-6 shadow-glow rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 transition-all duration-150 hover:border-zinc-500"
            >
              {/* Asset Identity Block */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="size-12 border-2 border-edge bg-surface rounded-lg flex items-center justify-center text-ion shrink-0 bg-wireframe">
                  <Box className="w-6 h-6" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 select-none">
                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border border-edge bg-volt text-ghost rounded">
                      unlocked
                    </span>
                    <span className="text-[10px] font-bold text-mist">
                      Ref: {order.stripePaymentIntentId?.substring(3, 12)}...
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-ghost truncate max-w-md">
                    {order.asset?.title || "Secured 3D Mesh Engine Product"}
                  </h3>
                </div>
              </div>

              {/* Action Trigger Block */}
              <div className="flex items-center justify-end shrink-0">
                <button
                  onClick={() =>
                    handleDownload(order.id, order.asset?.title || "asset")
                  }
                  disabled={downloadingId === order.id}
                  className="px-5 py-3 rounded-xl font-black text-xs transition-all duration-150 border-2 border-edge bg-ion text-white hover:bg-orange-500 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none shadow-glow flex justify-center items-center gap-2 select-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  {downloadingId === order.id ? (
                    <>
                      <Loader2
                        className="w-4 h-4 animate-spin text-white"
                        strokeWidth={2.5}
                      />
                      <span>Streaming GLB File...</span>
                    </>
                  ) : (
                    <>
                      <DownloadCloud className="w-4 h-4" strokeWidth={2.5} />
                      <span>Download GLB Matrix</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
