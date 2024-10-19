import React, { useState, useRef, ChangeEvent } from "react";
import { keccak_256 } from "js-sha3";
import copy from "clipboard-copy";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { request } from "@/utils/request";

interface File {
  name: string;
  size: number;
  type: string;
  totalChunks: number;
  percent: number;
  uid: string;
  status: "init" | "pending" | "success" | "failure";
  raw: File;
  url?: string;
}

interface UploadProps {
  account: string;
  fileContract: string;
  flatDirectory: string;
  dirPath: string;
  beforeUpload?: () => boolean;
  onChange?: (file: File, files: File[]) => void;
  onSuccess?: (response: any, file: File, files: File[]) => void;
  onError?: (error: Error, file: File, files: File[]) => void;
  onProgress?: (event: { percent: number }, file: File, files: File[]) => void;
  onExceed?: (files: File[], uploadedFiles: File[]) => void;
  accept?: string;
  multiple?: boolean;
  customRequestClient?: typeof request;
  limit?: number;
  drag?: boolean;
  showList?: boolean;
}

const noop = () => {};

// const request = async (options: any) => {
//   // Implement your request function here
//   // This is a placeholder and should be replaced with actual implementation
//   console.log("Request options:", options);
// };

const FileUploader: React.FC<UploadProps> = ({
  account = "",
  fileContract = "",
  flatDirectory = "",
  dirPath = "",
  beforeUpload,
  onChange = noop,
  onSuccess = noop,
  onError = noop,
  onProgress = noop,
  onExceed = noop,
  accept,
  multiple = false,
  customRequestClient = request,
  limit,
  drag = true,
  showList = true,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [reqs, setReqs] = useState<Record<string, any>>({});
  const [currentReq, setCurrentReq] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const chunkLength = 24 * 1024;
  const enable = fileContract !== null;

  const clearFile = (rawFiles: File[]): File[] => {
    const newFiles: File[] = [];
    for (const rawFile of rawFiles) {
      const uid = keccak_256(rawFile.name + rawFile.size + rawFile.type);
      const isExists = files.some((file) => file.uid === uid);
      if (!isExists) {
        newFiles.push(rawFile);
      }
    }
    return newFiles;
  };

  const normalizeFiles = (rawFile: File): File => {
    let chunkSize = 1;
    if (rawFile.size > chunkLength) {
      chunkSize = Math.ceil(rawFile.size / chunkLength);
    }
    return {
      name: rawFile.name,
      size: rawFile.size,
      type: rawFile.type,
      totalChunks: chunkSize,
      percent: 0,
      uid: keccak_256(rawFile.name + rawFile.size + rawFile.type),
      status: "init",
      raw: rawFile,
    };
  };

  const normalizeReq = (file: File) => {
    const { uid } = file;
    setReqs((prev) => ({
      ...prev,
      [uid]: {
        chunkLength,
        account,
        contractAddress: fileContract,
        flatDirectoryAddress: flatDirectory,
        dirPath,
        file,
        onSuccess: (response: any) => handleSuccess(file, response),
        onError: (error: Error) => handleError(file, error),
        onProgress: (event: { percent: number }) => handleProgress(file, event),
      },
    }));
  };

  const handleSuccess = (file: File, response: any) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.uid === file.uid ? { ...f, status: "success", url: response.path } : f
      )
    );
    setReqs((prev) => {
      const { [file.uid]: _, ...rest } = prev;
      return rest;
    });
    onChange(file, files);
    onSuccess(response, file, files);
  };

  const handleError = (file: File, error: Error) => {
    setFiles((prev) =>
      prev.map((f) => (f.uid === file.uid ? { ...f, status: "failure" } : f))
    );
    setReqs((prev) => {
      const { [file.uid]: _, ...rest } = prev;
      return rest;
    });
    onError(error, file, files);
    if (error instanceof Error && error.message === "Not enough balance") {
      // Show error notification
      console.error("Not enough balance! File >=24kb requires staking token.");
    }
  };

  const handleProgress = (file: File, event: { percent: number }) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.uid === file.uid ? { ...f, percent: event.percent } : f
      )
    );
    onChange(file, files);
    onProgress(event, file, files);
  };

  const onClickTrigger = () => {
    if (enable && inputRef.current) {
      inputRef.current.click();
    }
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawFiles = Array.from(e.target.files || []);
    uploadFiles(rawFiles);
  };

  const uploadFiles = (rawFiles: File[]) => {
    const clearedFiles = clearFile(rawFiles);
    const filesLen = clearedFiles.length + files.length;
    if (limit && limit < filesLen) {
      return onExceed(clearedFiles, files);
    }
    startUpload(clearedFiles);
  };

  const startUpload = (rawFiles: File[]) => {
    const newFiles = rawFiles.map(normalizeFiles);
    setFiles((prev) => [...prev, ...newFiles]);
    newFiles.forEach(normalizeReq);
    autoUpload();
  };

  const autoUpload = async () => {
    if (currentReq) return;
    if (!beforeUpload || beforeUpload()) {
      const firstReq = Object.values(reqs)[0];
      if (firstReq) {
        setCurrentReq(firstReq);
        const file = firstReq.file;
        setFiles((prev) =>
          prev.map((f) =>
            f.uid === file.uid ? { ...f, status: "pending" } : f
          )
        );
        onChange(file, files);
        await customRequestClient(firstReq);
        setCurrentReq(null);
        autoUpload();
      }
    }
  };

  const onCopy = (url: string) => {
    copy(url);
    console.log("Copy Success");
  };

  const onDelete = (file: File) => {
    setFiles((prev) => prev.filter((f) => f.uid !== file.uid));
    setReqs((prev) => {
      const { [file.uid]: _, ...rest } = prev;
      return rest;
    });
  };

  const onReUpload = (file: File) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.uid === file.uid ? { ...f, status: "init", percent: 0 } : f
      )
    );
    onChange(file, files);
    normalizeReq(file);
    autoUpload();
  };

  return (
    <div className="go-upload">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        multiple={multiple}
        accept={accept}
        onChange={onInputChange}
      />
      {drag ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer"
          onClick={onClickTrigger}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const droppedFiles = Array.from(e.dataTransfer.files);
            uploadFiles(droppedFiles);
          }}
        >
          Drag files here or click to upload
        </div>
      ) : (
        <Button onClick={onClickTrigger} disabled={!enable}>
          Upload Files
        </Button>
      )}
      {showList && enable && (
        <div className="mt-4">
          {files.map((file) => (
            <div key={file.uid} className="mb-2">
              <div className="flex justify-between items-center">
                <span>{file.name}</span>
                <div>
                  {file.status === "success" && file.url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCopy(file.url!)}
                    >
                      Copy URL
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(file)}
                  >
                    Delete
                  </Button>
                  {file.status === "failure" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReUpload(file)}
                    >
                      Retry
                    </Button>
                  )}
                </div>
              </div>
              <Progress value={file.percent} className="mt-1" />
              {file.status === "failure" && (
                <Alert variant="destructive" className="mt-1">
                  <AlertDescription>
                    Upload failed. Please try again.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
