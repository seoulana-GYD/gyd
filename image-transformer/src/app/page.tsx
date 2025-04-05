"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios, { AxiosError } from "axios";

export default function Home() {
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setInputImage(reader.result as string);
      setOutputImage(null);
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
  });

  const transformImage = async () => {
    if (!inputImage) return;

    try {
      setLoading(true);
      setError(null);

      // 이미지 데이터 추출 (base64 데이터 부분만)
      const base64Data = inputImage.split(",")[1];

      const response = await axios.post("/api/transform", {
        image: base64Data,
      });

      setOutputImage(response.data.outputImage);
    } catch (err) {
      console.error("이미지 변환 중 오류 발생:", err);

      // 서버에서 제공하는 상세 오류 정보가 있으면 표시
      let errorMessage =
        "이미지 변환 중 오류가 발생했습니다. 다시 시도해 주세요.";

      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{
          details?: string;
          error?: string;
        }>;
        const errorDetails =
          axiosError.response?.data?.details ||
          axiosError.response?.data?.error;
        if (errorDetails) {
          errorMessage = `이미지 변환 중 오류가 발생했습니다: ${errorDetails}`;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // API 키 테스트 함수
  const testApiKey = async () => {
    try {
      const response = await axios.get("/api/test");
      setApiStatus({
        success: true,
        message: response.data.message,
      });
    } catch (err) {
      console.error("API 키 테스트 오류:", err);

      let errorMessage = "API 키 테스트 실패";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.details || errorMessage;
      }

      setApiStatus({
        success: false,
        message: errorMessage,
      });
    }
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      <header className="w-full max-w-3xl mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">지브리풍 이미지 변환기</h1>
        <p className="text-lg text-gray-600 mb-2">
          나만의 이미지를 지브리 스튜디오 스타일로 변환해보세요!
        </p>
        <p className="text-md text-blue-600 mb-4">
          인물 사진을 업로드하면 지브리 애니메이션 스타일의 캐릭터로 변환됩니다.
        </p>
        <button
          onClick={testApiKey}
          className="mt-2 text-sm underline text-blue-500 hover:text-blue-700"
        >
          API 연결 테스트
        </button>
        {apiStatus && (
          <div
            className={`mt-2 text-sm ${
              apiStatus.success ? "text-green-500" : "text-red-500"
            }`}
          >
            {apiStatus.message}
          </div>
        )}
      </header>

      <main className="w-full max-w-3xl flex flex-col gap-8">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400"
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
                클릭하거나 새 이미지를 끌어다 놓아 변경하세요
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
              <p className="mt-4 text-lg font-medium">
                {isDragActive
                  ? "여기에 이미지를 놓으세요"
                  : "인물 사진을 클릭하여 업로드하거나 끌어서 놓으세요"}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                PNG, JPG, GIF 파일을 지원합니다.
              </p>
              <p className="mt-2 text-sm text-blue-500">
                얼굴이 잘 보이는 인물 사진을 사용하면 더 좋은 결과를 얻을 수
                있습니다!
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
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
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
              변환 중...
            </span>
          ) : (
            "지브리풍 이미지로 변환하기"
          )}
        </button>

        {outputImage && (
          <div className="mt-8 p-6 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">변환 결과</h2>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-2">원본 이미지</p>
                {inputImage && (
                  <img
                    src={inputImage}
                    alt="원본 이미지"
                    className="max-w-full max-h-[300px] object-contain"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-2">지브리풍 이미지</p>
                <img
                  src={outputImage}
                  alt="변환된 이미지"
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
                이미지 다운로드
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
