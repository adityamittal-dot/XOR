<<<<<<< HEAD
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X } from "lucide-react";
=======
import { useRef, useState } from "react";
import { Button } from "./ui/button";
>>>>>>> origin/frontend
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
<<<<<<< HEAD
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
=======
} from "./ui/dialog";
import { Upload, FileText, X } from "lucide-react";

type LabReportUploadProps = {
  onUpload?: (file: File) => Promise<void> | void;
};

export function LabReportUpload({ onUpload }: LabReportUploadProps) {
>>>>>>> origin/frontend
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
<<<<<<< HEAD
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
=======
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (
      selected.type === "application/pdf" ||
      selected.name.endsWith(".pdf")
    ) {
      setFile(selected);
>>>>>>> origin/frontend
      setError(null);
    } else {
      setError("Please select a PDF file");
      setFile(null);
    }
  };

<<<<<<< HEAD
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

=======
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
>>>>>>> origin/frontend
      setTimeout(() => {
        setOpen(false);
        setFile(null);
        setError(null);
<<<<<<< HEAD

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
=======
        setUploading(false);
        if (inputRef.current) inputRef.current.value = "";
      }, 800);
    } catch (err: any) {
      setError(err?.message || "Upload failed");
      setUploading(false);
>>>>>>> origin/frontend
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
<<<<<<< HEAD
            Upload a PDF of your lab test results. AI-powered analysis
            will be available once connected to the backend.
=======
            Upload a PDF of your lab test results for analysis.
>>>>>>> origin/frontend
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!file ? (
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
<<<<<<< HEAD
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop your lab report PDF here, or click to browse
              </p>

              <input
                ref={fileInputRef}
=======
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500 mb-2">
                Select a PDF lab report
              </p>

              <input
                ref={inputRef}
>>>>>>> origin/frontend
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />

<<<<<<< HEAD
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
=======
              <Button onClick={() => inputRef.current?.click()}>
>>>>>>> origin/frontend
                Select PDF File
              </Button>
            </div>
          ) : (
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
<<<<<<< HEAD
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
=======
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">
>>>>>>> origin/frontend
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

<<<<<<< HEAD
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                >
=======
                <Button onClick={handleRemoveFile}>
>>>>>>> origin/frontend
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {error && (
            <div
              className={`rounded-lg border p-3 ${
                error.includes("successful")
<<<<<<< HEAD
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
=======
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              <p className="text-sm">{error}</p>
>>>>>>> origin/frontend
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
<<<<<<< HEAD
              variant="outline"
              onClick={() => {
                setOpen(false);
                setFile(null);
                setError(null);
=======
              onClick={() => {
                setOpen(false);
                handleRemoveFile();
>>>>>>> origin/frontend
              }}
            >
              Cancel
            </Button>

<<<<<<< HEAD
            <Button onClick={handleUpload} disabled={!file || uploading}>
=======
            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
            >
>>>>>>> origin/frontend
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? "Uploading..." : "Upload & Analyze"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
