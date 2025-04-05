'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

export default function ImageDropZone() {
  const [preview, setPreview] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
  })

  return (
    <div className="w-full max-w-xl mx-auto p-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors duration-300
          ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-white'
          }
        `}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-600 font-semibold">
            이미지를 여기에 놓아주세요...
          </p>
        ) : (
          <p className="text-gray-500">
            여기에 이미지를 드래그하거나 클릭해서 업로드하세요
          </p>
        )}
      </div>

      {preview && (
        <div className="mt-6 text-center">
          <p className="mb-2 font-medium text-gray-700">미리보기</p>
          <img
            src={preview}
            alt="Preview"
            className="w-full max-h-96 object-contain rounded-xl shadow"
          />
        </div>
      )}
    </div>
  )
}
