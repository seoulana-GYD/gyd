'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import axios, { AxiosError } from 'axios'
import useUserSOLBalanceStore from 'stores/useUserSOLBalanceStore'
import Lottie from 'lottie-react'

export default function ImageDropZone() {
  const [inputImage, setInputImage] = useState<string | null>(null)
  const [outputImage, setOutputImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiStatus, setApiStatus] = useState<{
    success: boolean
    message: string
  } | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const { setImageUrl } = useUserSOLBalanceStore()
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드할 수 있습니다.')
      return
    }
    setFileName(file.name)
    setError(null)
    const reader = new FileReader()
    reader.onload = () => {
      setInputImage(reader.result as string)
      setOutputImage(null)
    }
    reader.readAsDataURL(file)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
    maxFiles: 1,
  })

  const transformImage = async () => {
    if (!inputImage) return

    try {
      setLoading(true)
      setError(null)

      // 이미지 데이터 추출 (base64 데이터 부분만)
      const base64Data = inputImage.split(',')[1]

      const response = await axios.post('/api/transform', {
        image: base64Data,
        fileName: fileName.split('.')[0],
      })
      console.log('first: ', response)
      setOutputImage(response.data.outputImage)
      setImageUrl(response.data.outputImage)
      console.log('first2: ', response.data.outputImage)
    } catch (err) {
      console.error('Error during image conversion:', err)

      // 서버에서 제공하는 상세 오류 정보가 있으면 표시
      let errorMessage = 'Error converting image, please try again.'

      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{
          details?: string
          error?: string
        }>
        const errorDetails =
          axiosError.response?.data?.details || axiosError.response?.data?.error
        if (errorDetails) {
          errorMessage = `An error occurred during image conversion: ${errorDetails}`
        }
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // API 키 테스트 함수
  const testApiKey = async () => {
    try {
      const response = await axios.get('/api/test')
      setApiStatus({
        success: true,
        message: response.data.message,
      })
    } catch (err) {
      console.error('API 키 테스트 오류:', err)

      let errorMessage = 'API 키 테스트 실패'
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.details || errorMessage
      }

      setApiStatus({
        success: false,
        message: errorMessage,
      })
    }
  }

  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      <main className="w-full max-w-3xl flex flex-col gap-8">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400'
          }`}
        >
          <input {...getInputProps()} />
          {inputImage ? (
            <div className="flex flex-col items-center">
              <img
                src={inputImage}
                alt="업로드된 이미지"
                className="max-w-full max-h-[300px] object-contain"
              />
              <p className="mt-4 text-sm text-gray-500">
                Click or drag a new image to change it
              </p>
            </div>
          ) : (
            <div className="py-10">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-4 text-lg font-medium w-96">
                {isDragActive
                  ? 'Put the image here'
                  : 'Click to upload or drag a picture of a person'}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Supports PNG, JPG, and GIF files
              </p>
            </div>
          )}
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        <button
          onClick={transformImage}
          disabled={!inputImage || loading}
          className={`py-3 px-6 rounded-full font-medium transition-colors ${
            !inputImage || loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Converting...
            </span>
          ) : (
            'Convert'
          )}
        </button>
        {!outputImage && (
          <Lottie
            animationData={require('./cat.json')}
            loop
            autoplay={loading}
          />
        )}
        {outputImage && (
          <div className="mt-8 p-6 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Conversion Results</h2>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* <div className="flex-1">
                <p className="text-sm text-gray-500 mb-2">Original image</p>
                {inputImage && (
                  <img
                    src={inputImage}
                    alt="original-image"
                    className="max-w-full max-h-[300px] object-contain"
                  />
                )}
              </div> */}
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-2">AI Art Image</p>
                <img
                  src={outputImage}
                  alt="ai-art-image"
                  className="max-w-full max-h-[300px] object-contain"
                />
              </div>
            </div>
            <div className="mt-4">
              <a
                href={outputImage}
                download="ghibli_styled_image.png"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  ></path>
                </svg>
                Download Image
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
