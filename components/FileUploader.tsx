"use client";

import { convertFileToUrl } from "@/lib/utils";
import Image from "next/image";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

type FileUploaderProps = {
  files: File[] | undefined;
  onChange: (files: File[]) => void;
};

const FileUploader = ({ files, onChange }: FileUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onChange(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="file-upload">
      <input {...getInputProps()} />
      {files && files?.length > 0 ? (
        <Image
          src={convertFileToUrl(files[0])}
          width={1000}
          height={1000}
          alt="uploaded image"
          className="max-h-[400px] overflow-hidden object-cover"
        />
      ) : (
        <>
          <Image
            src="/assets/icons/upload.svg"
            width={40}
            height={40}
            alt="uploaded"
          />
          <div className="file-upload_label">
            <p className="text-14-regular">
              <span className="text-green-500">
                Cliquer pour télécharger&nbsp;
              </span>
              ou glisser et déposez
            </p>
            <p>SVG, PNG, JPG ou GIF (max 800x400)</p>
          </div>
        </>
      )}
      {isDragActive ? (
        <p>Déposez le(s) fichier(s) ici ...</p>
      ) : (
        <p>
          Glisser et déposez un ou des fichiers ici ou,
          <br /> cliquez pour sélectionner un ou des fichiers
        </p>
      )}
    </div>
  );
};

export default FileUploader;
