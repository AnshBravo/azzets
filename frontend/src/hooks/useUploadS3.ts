import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { assetApi } from "../api/assetApi";

interface UploadFileParams {
  file: File;
  folder: "previews" | "vault";
  onProgress?: (progress: number) => void;
}

export const useUploadS3 = () => {
  return useMutation({
    mutationFn: async ({ file, folder, onProgress }: UploadFileParams) => {
      const presignResponse = await assetApi.getUploadUrl({
        fileName: file.name,
        fileType: file.type,
        folder,
      });

      const { uploadUrl, s3Key } = presignResponse;

      await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type, // Must match the signature definition exactly
        },
        // Live transmission calculation feedback loop for frontend progress bars!
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percentage = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            onProgress(percentage);
          }
        },
      });

      return {
        s3Key,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      };
    },
  });
};
