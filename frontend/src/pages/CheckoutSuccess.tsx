import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle,
  FolderHeart,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export const CheckoutSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const queryClient = useQueryClient();

  useEffect(() => {
    // 🔄 STATE RESYNC PRO TIP: Force TanStack Query to instantly clear out all asset details
    // and inventory arrays. This ensures that the moment the user steps into their Vault,
    // the system pulls the freshest data from Neon DB showing their newly unlocked asset!
    queryClient.invalidateQueries({ queryKey: ["asset-detail"] });
  }, [queryClient]);

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-6">
      <div className="bg-raised border-2 border-edge p-8 max-w-md w-full text-center shadow-glow rounded-xl animate-rise">
        {/* Verification Vector Aura */}
        <div className="inline-flex p-4 rounded-full bg-volt/10 border-2 border-edge text-edge mb-6 shadow-[2px_2px_0px_0px_#000000] select-none animate-bounce">
          <CheckCircle className="w-10 h-10 text-edge" strokeWidth={2.5} />
        </div>

        <h1 className="text-3xl font-black text-ghost tracking-tight mb-2">
          Transaction Authorized
        </h1>

        <p className="text-sm font-medium text-mist leading-relaxed mb-6">
          Your payment stream has been cryptographically validated by Stripe.
          The 3D geometry matrix files have been cleanly transferred directly
          into your personal storage grid account node.
        </p>

        {/* Informational Parameter Readout Box */}
        {sessionId && (
          <div className="mb-6 p-3 bg-surface border border-edge rounded-lg flex items-center gap-3 text-left font-mono text-[10px] text-mist select-none">
            <ShieldCheck
              className="w-4 h-4 text-ion shrink-0"
              strokeWidth={2}
            />
            <span className="truncate">REF_ID: {sessionId}</span>
          </div>
        )}

        <div className="h-px bg-edge w-full mb-6" />

        {/* Navigation Control Grid */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <Link
            to="/vault"
            className="w-full py-3 rounded-xl font-black text-sm border-2 border-edge bg-plasma text-ghost hover:bg-plasma-light active:translate-x-0.5 active:translate-y-0.5 active:shadow-none shadow-glow flex justify-center items-center gap-2 select-none"
          >
            <FolderHeart className="w-4 h-4" strokeWidth={2.5} />
            <span>Open My Vault</span>
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </div>
  );
};
