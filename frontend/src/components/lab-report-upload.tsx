import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LabReportUploadProps {
  onUploadSuccess?: () => void;
}

/**
 * UI-only Lab Report Upload component.
 * Simulates PDF selection and upload success.
 * Ready to be connected to DRF + file upload backend later.
 */
export function LabReportUpload({
  onUploadSuccess,
}: LabReportUploadProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (
      selectedFile.type === "application/pdf" ||
      selectedFile.name.endsWith(".pdf")
    ) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Please select a PDF file");
      setFile(null);
    }
  };

  const handleUpload = () => {
    if (!file) {
      setError("Please select a PDF file");
      return;
    }

    setUploading(true);
    setError(null);

    // UI-only simulated upload
    setTimeout(() => {
      setUploading(false);
      setError("Upload successful! (Demo mode)");

      setTimeout(() => {
        setOpen(false);
        setFile(null);
        setError(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        if (onUploadSuccess) {
          onUploadSuccess();
        }
      }, 1000);
    }, 1200);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
            Upload a PDF of your lab test results. AI-powered analysis
            will be available once connected to the backend.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!file ? (
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop your lab report PDF here, or click to browse
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />

              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Select PDF File
              </Button>
            </div>
          ) : (
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {error && (
            <div
              className={`rounded-lg border p-3 ${
                error.includes("successful")
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <p
                className={`text-sm ${
                  error.includes("successful")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {error}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                setFile(null);
                setError(null);
              }}
            >
              Cancel
            </Button>

            <Button onClick={handleUpload} disabled={!file || uploading}>
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? "Uploading..." : "Upload & Analyze"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
