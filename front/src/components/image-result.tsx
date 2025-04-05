'use client'

import React from 'react'
import useUserSOLBalanceStore from 'stores/useUserSOLBalanceStore'

export default function ImageResult() {
  const { imageUrl, setImageUrl, randomUrl } = useUserSOLBalanceStore()

  if (!imageUrl) {
    // return null
    setImageUrl('http://localhost:3000/images/before_image.png')
  }
  return (
    <div className="mt-8 p-6 border border-gray-200 rounded-lg">
      <h2 className="text-xl font-semibold mb-6">
        Not just minting, it’s an experience of discovery !
      </h2>
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-1">
          <p className="text-md text-gray-500 mb-2">My NFT Image</p>
          <img
            src={imageUrl}
            alt="ai-art-image"
            className="max-w-full max-h-[300px] object-contain"
          />
        </div>
        <div className="flex-1">
          <p className="text-md text-gray-500 mb-2">
            The random person's image
          </p>
          {/* {imageUrl && ( */}
          <img
            src={randomUrl || '/unknown.png'}
            alt="original-image"
            className="max-w-full max-h-[300px] object-contain"
          />
          {/* )} */}
        </div>
      </div>
      <div className="mt-4">
        <a
          href={imageUrl}
          download="image.png"
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
  )
}
