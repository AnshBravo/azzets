import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { assetApi } from "../api/assetApi.js";
import { useUploadS3 } from "../hooks/useUploadS3.js";
import {
  CheckCircle,
  FolderPlus,
  Loader2,
  UploadCloud,
  XCircle,
} from "lucide-react";

const CATEGORIES = [
  "vehicles",
  "characters",
  "environments",
  "weapons",
  "props",
];
const LICENSES = ["standard", "commercial", "editorial"];
const MAX_FILE_SIZE = 50 * 1024 * 1024;

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "Unable to upload this asset. Please try again.";
};

export const UploadAsset: React.FC = () => {
  const navigate = useNavigate();
  const uploadS3Mutation = useUploadS3();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [licenseType, setLicenseType] = useState(LICENSES[0]);
  const [price, setPrice] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const selectFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".glb")) {
      setErrorMsg("Only .glb 3D model files are supported.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMsg("The model file must be 50 MB or smaller.");
      return;
    }

    setSelectedFile(file);
    setErrorMsg(null);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      selectFile(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      setErrorMsg("Choose a .glb model file before submitting.");
      return;
    }

    const assetPrice = Number(price);
    if (!Number.isFinite(assetPrice) || assetPrice < 0) {
      setErrorMsg("Enter a valid, non-negative price.");
      return;
    }

    setErrorMsg(null);
    setIsFormSubmitting(true);

    try {
      const uploadResult = await uploadS3Mutation.mutateAsync({
        file: selectedFile,
        folder: "previews",
        onProgress: setUploadProgress,
      });

      await assetApi.createAsset({
        title,
        description: description || undefined,
        category,
        licenseType,
        price: assetPrice,
        files: [
          {
            fileType: uploadResult.fileType,
            s3Key: uploadResult.s3Key,
            fileSize: uploadResult.fileSize,
          },
        ],
      });

      navigate("/");
    } catch (error: unknown) {
      setErrorMsg(getErrorMessage(error));
      setUploadProgress(0);
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-3xl py-4">
      <div className="rounded-xl border-2 border-edge bg-raised p-8 shadow-glow">
        <div className="mb-8 border-b-2 border-dashed border-edge pb-6">
          <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight text-ghost">
            <span className="rounded border border-edge bg-plasma p-2 shadow-[2px_2px_0px_0px_#000]">
              <FolderPlus className="h-5 w-5 text-ghost" aria-hidden />
            </span>
            List an asset
          </h1>
          <p className="mt-2 text-sm font-medium text-mist">
            Upload a 3D model and add its marketplace details.
          </p>
        </div>

        {errorMsg && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border-2 border-edge bg-flare/10 p-4 text-sm font-bold text-edge"
          >
            <XCircle
              className="mt-0.5 h-4 w-4 shrink-0 text-flare"
              strokeWidth={2.5}
              aria-hidden
            />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="mb-2 block text-sm font-black text-ghost"
              htmlFor="file-upload"
            >
              3D model file
            </label>
            <div
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setIsDragging(false);
              }}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-surface p-8 transition-colors ${
                isDragging
                  ? "border-ion bg-orange-500/5"
                  : "border-edge hover:border-plasma"
              }`}
            >
              <input
                type="file"
                id="file-upload"
                accept=".glb,model/gltf-binary"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0];
                  if (file) {
                    selectFile(file);
                  }
                  event.currentTarget.value = "";
                }}
                className="sr-only"
                disabled={isFormSubmitting}
              />
              {selectedFile ? (
                <div className="space-y-3 text-center">
                  <CheckCircle
                    className="mx-auto h-8 w-8 text-plasma"
                    aria-hidden
                  />
                  <p className="max-w-xs truncate text-sm font-black text-ghost">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs font-bold text-mist">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  {!isFormSubmitting && (
                    <label
                      htmlFor="file-upload"
                      className="inline-block cursor-pointer rounded border border-edge bg-surface px-3 py-1 text-xs font-bold text-ghost hover:bg-void"
                    >
                      Replace file
                    </label>
                  )}
                </div>
              ) : (
                <label
                  htmlFor="file-upload"
                  className="flex w-full cursor-pointer flex-col items-center justify-center py-6 text-center"
                >
                  <UploadCloud
                    className="mb-3 h-12 w-12 text-mist"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <span className="text-sm font-black text-ghost">
                    Drag and drop your model or{" "}
                    <span className="text-ion hover:underline">
                      browse files
                    </span>
                  </span>
                  <span className="mt-1 text-xs font-bold text-mist">
                    .glb files up to 50 MB
                  </span>
                </label>
              )}
            </div>
          </div>

          {isFormSubmitting && (
            <div
              className="space-y-2 rounded-xl border-2 border-edge bg-void p-4"
              aria-live="polite"
            >
              <div className="flex items-center justify-between text-xs font-black uppercase text-ghost">
                <span className="flex items-center gap-2">
                  <Loader2
                    className="h-3.5 w-3.5 animate-spin text-ion"
                    aria-hidden
                  />
                  {uploadProgress < 100
                    ? "Uploading model..."
                    : "Saving listing..."}
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <div
                className="h-3 w-full overflow-hidden rounded-full border-2 border-edge bg-surface"
                role="progressbar"
                aria-valuenow={uploadProgress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full border-r border-edge bg-signature transition-all duration-150"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="asset-title"
              className="mb-2 block text-sm font-bold text-ghost"
            >
              Listing title
            </label>
            <input
              id="asset-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="obsidian-input w-full rounded-xl px-4 py-3 text-sm font-medium shadow-[2px_2px_0px_0px_#000]"
              placeholder="e.g. Low-poly stylized weapon pack"
              required
              disabled={isFormSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="asset-category"
                className="mb-2 block text-sm font-bold text-ghost"
              >
                Category
              </label>
              <select
                id="asset-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="obsidian-input w-full cursor-pointer appearance-none rounded-xl px-4 py-3 text-sm font-bold shadow-[2px_2px_0px_0px_#000]"
                disabled={isFormSubmitting}
              >
                {CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="asset-license"
                className="mb-2 block text-sm font-bold text-ghost"
              >
                License
              </label>
              <select
                id="asset-license"
                value={licenseType}
                onChange={(event) => setLicenseType(event.target.value)}
                className="obsidian-input w-full cursor-pointer appearance-none rounded-xl px-4 py-3 text-sm font-bold shadow-[2px_2px_0px_0px_#000]"
                disabled={isFormSubmitting}
              >
                {LICENSES.map((item) => (
                  <option key={item} value={item}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="asset-price"
                className="mb-2 block text-sm font-bold text-ghost"
              >
                Price (USD)
              </label>
              <input
                id="asset-price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className="obsidian-input w-full rounded-xl px-4 py-3 text-sm font-bold shadow-[2px_2px_0px_0px_#000]"
                placeholder="24.99"
                required
                disabled={isFormSubmitting}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="asset-description"
              className="mb-2 block text-sm font-bold text-ghost"
            >
              Description (optional)
            </label>
            <textarea
              id="asset-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="obsidian-input min-h-22.5 w-full resize-none rounded-xl px-4 py-3 text-sm font-medium shadow-[2px_2px_0px_0px_#000]"
              placeholder="Describe your model, its features, and intended use."
              disabled={isFormSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isFormSubmitting || !selectedFile}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-edge bg-plasma py-4 text-sm font-black text-ghost shadow-glow transition-all hover:bg-plasma-light disabled:pointer-events-none disabled:opacity-50"
          >
            {isFormSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Uploading asset...
              </>
            ) : (
              "Publish asset"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
