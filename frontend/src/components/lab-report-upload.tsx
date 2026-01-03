import { useRef, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Upload, FileText, X } from "lucide-react";

type LabReportUploadProps = {
  onUpload?: (file: File) => Promise<void> | void;
};

export function LabReportUpload({ onUpload }: LabReportUploadProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (
      selected.type === "application/pdf" ||
      selected.name.endsWith(".pdf")
    ) {
      setFile(selected);
      setError(null);
    } else {
      setError("Please select a PDF file");
      setFile(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    try {
      setUploading(true);
      setError(null);

      if (onUpload) {
        await onUpload(file);
      } else {
        // Demo behavior
        await new Promise((r) => setTimeout(r, 1000));
      }

      setError("Upload successful!");
      setTimeout(() => {
        setOpen(false);
        setFile(null);
        setError(null);
        setUploading(false);
        if (inputRef.current) inputRef.current.value = "";
      }, 800);
    } catch (err: any) {
      setError(err?.message || "Upload failed");
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>
        <Upload className="mr-2 h-4 w-4" />
        Upload Report
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Lab Report</DialogTitle>
          <DialogDescription>
            Upload a PDF of your lab test results for analysis.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!file ? (
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500 mb-2">
                Select a PDF lab report
              </p>

              <input
                ref={inputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />

              <Button onClick={() => inputRef.current?.click()}>
                Select PDF File
              </Button>
            </div>
          ) : (
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <Button onClick={handleRemoveFile}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {error && (
            <div
              className={`rounded-lg border p-3 ${
                error.includes("successful")
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                setOpen(false);
                handleRemoveFile();
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? "Uploading..." : "Upload & Analyze"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
