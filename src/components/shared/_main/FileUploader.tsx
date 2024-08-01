import React, { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";

function FileUploader({ fieldChange }: any) {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState("");

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles[0]);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [file],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg", ".svg"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="flex cursor-pointer  flex-col items-center justify-center rounded-[14px] bg-dark-300"
    >
      <input {...getInputProps()} className="cursor-pointer" />
      {fileUrl ? (
        <div className="py-12">
          <div className="flex w-full flex-1 justify-center p-5 lg:p-10">
            <img src={fileUrl} alt="" />
          </div>
          <p className="text-center text-light-400">
            Click or drag photo to replace
          </p>
        </div>
      ) : (
        <div className="relative flex h-full w-full flex-col items-center justify-center py-12">
          <img
            src="/assets/icons/file-upload.svg"
            width={96}
            height={77}
            alt="file-upload"
          />
          <h3 className="mb-2 mt-3 text-lg font-semibold">
            Drag photos and videos here
          </h3>
          <p className="mb-4 text-xs text-light-400">
            SVG, PNG, JPG or GIF (max. 800x400px)
          </p>
          <Button className="bg-dark-400">Select from computer</Button>
          <div className="absolute bottom-6 right-6">
            <div className="rounded-md bg-dark-400 p-2">
              <img src="/assets/icons/file.svg" alt="" />
            </div>
            <img
              src="/assets/icons/state-drag.svg"
              alt=""
              className="absolute -bottom-2 -right-2"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUploader;
