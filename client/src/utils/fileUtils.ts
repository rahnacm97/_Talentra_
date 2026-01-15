import { toast } from "react-toastify";

export const handleFileDownload = async (url: string, fileName: string) => {
  if (!url) {
    toast.error("No file URL provided");
    return;
  }

  const toastId = toast.loading("Preparing download...");

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const finalFileName = fileName.toLowerCase().endsWith(".pdf")
      ? fileName
      : `${fileName}.pdf`;

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = finalFileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);

    toast.update(toastId, {
      render: "Download started!",
      type: "success",
      isLoading: false,
      autoClose: 2000,
    });
  } catch (error) {
    console.error("Download failed:", error);

    toast.update(toastId, {
      render:
        "Direct download blocked by browser security. Opening in new tab...",
      type: "warning",
      isLoading: false,
      autoClose: 3000,
    });

    setTimeout(() => {
      window.open(url, "_blank");
    }, 1000);
  }
};
