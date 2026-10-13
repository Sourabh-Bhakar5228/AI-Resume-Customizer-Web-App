"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileText, CheckCircle2, X, AlertCircle } from "lucide-react";

interface ResumeUploadProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  error?: string | null;
}

export default function ResumeUpload({ file, onFileSelect, error }: ResumeUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      } else if (fileRejections.length > 0) {
        onFileSelect(null);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/msword": [".doc"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
          <span>1. Upload Resume</span>
          <span className="text-xs font-normal text-slate-400">(PDF or DOCX, max 10MB)</span>
        </label>
        {file && (
          <button
            type="button"
            onClick={() => onFileSelect(null)}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>
        )}
      </div>

      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragActive
              ? "border-teal-400 bg-teal-500/10 scale-[1.01]"
              : isDragReject
              ? "border-rose-500 bg-rose-500/10"
              : "border-slate-700 hover:border-slate-500 bg-slate-900/50 hover:bg-slate-800/40"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800 text-teal-400 flex items-center justify-center shadow-inner">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">
                {isDragActive ? "Drop your resume here" : "Drag & drop your resume file"}
              </p>
              <p className="text-xs text-slate-400 mt-1">or click to browse from your device</p>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-slate-500">
              <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 font-mono">PDF</span>
              <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 font-mono">DOCX</span>
              <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 font-mono">TXT</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-teal-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-3 truncate">
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <p className="text-sm font-medium text-slate-200 truncate">{file.name}</p>
              <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                <span>{formatFileSize(file.size)}</span>
                <span>•</span>
                <span className="text-teal-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 inline mr-0.5" />
                  Ready to parse
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onFileSelect(null)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Replace file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
