import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import * as fs from 'node:fs'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()
export async function POST(request: NextRequest) {
  try {
    // console.log('API 호출됨: /api/transform')
    // // API 키 확인
    // const apiKey = process.env.OPENAI_API_KEY
    // if (!apiKey) {
    //   console.error('OpenAI API 키가 없음')
    //   return NextResponse.json(
    //     { error: '서버 설정 오류: API 키가 설정되지 않았습니다.' },
    //     { status: 500 }
    //   )
    // }
    // // OpenAI 클라이언트 초기화
    // const openai = new OpenAI({
    //   apiKey: apiKey,
    // })
    // // 요청 확인 및 파싱
    // const body = await request.json().catch((e) => {
    //   console.error('JSON 파싱 오류:', e)
    //   throw new Error('요청 본문을 파싱할 수 없습니다.')
    // })
    // const { image } = body
    // if (!image) {
    //   console.error('이미지가 없음')
    //   return NextResponse.json(
    //     { error: '이미지가 필요합니다.' },
    //     { status: 400 }
    //   )
    // }
    // console.log('이미지 데이터 수신 완료. 길이:', image.length)
    // // 1. Vision API를 사용하여 이미지 상세 분석
    // try {
    //   console.log('이미지 상세 분석 시작')
    //   const visionResponse = await openai.chat.completions.create({
    //     model: 'gpt-4o',
    //     messages: [
    //       {
    //         role: 'user',
    //         content: [
    //           {
    //             type: 'text',
    //             text: '첨부한 이미지를 기반으로 참고해서 지브리 느낌의  이미지로 만들어주세요',
    //           },
    //           {
    //             type: 'image_url',
    //             image_url: {
    //               url: `data:image/jpeg;base64,${image}`,
    //             },
    //           },
    //         ],
    //       },
    //     ],
    //     max_tokens: 500,
    //   })
    //   const imageDescription =
    //     visionResponse.choices[0]?.message?.content || '인물 이미지'
    //   console.log('이미지 분석 결과:', imageDescription)
    //   // 2. gbl 스타일로 변환하는 프롬프트 생성
    //   const gblPrompt = `다음 설명을 기반으로 스튜디오 지브리 스타일의 캐릭터 이미지를 생성해주세요: "${imageDescription}"
    // 이미지는 다음 특성을 가져야 합니다:
    // - 지브리 애니메이션 스타일의 캐릭터 디자인
    // - 원본 이미지의 특징을 유지하되 지브리풍 단순화
    // - 큰 표현력 있는 눈과 부드러운 얼굴 특징
    // - 따뜻한 파스텔 톤 색상과 부드러운 선
    // - 미야자키 하야오 감독의 애니메이션 캐릭터와 같은 느낌
    // - 원본의 표정과 분위기를 유지`
    //   console.log('DALL-E 요청 시작')
    //   console.log('프롬프트 요약:', gblPrompt.substring(0, 100) + '...')
    //   // 3. DALL-E로 지브리풍 이미지 생성
    //   const dalleResponse = await openai.images.generate({
    //     model: 'dall-e-3',
    //     prompt: gblPrompt,
    //     n: 1,
    //     size: '1024x1024',
    //     response_format: 'b64_json',
    //   })
    //   console.log('DALL-E 응답 수신 완료')
    //   if (!dalleResponse.data[0].b64_json) {
    //     console.error('DALL-E 응답에 이미지 데이터 없음')
    //     return NextResponse.json(
    //       { error: '이미지를 생성할 수 없습니다.' },
    //       { status: 500 }
    //     )
    //   }
    //   // 응답에서 base64 이미지 데이터 추출
    //   const outputImage = `data:image/png;base64,${dalleResponse.data[0].b64_json}`
    //   console.log('응답 반환')
    //   return NextResponse.json({ outputImage })
    // } catch (visionError) {
    //   console.error('Vision API 오류:', visionError)
    //   // Vision API 오류 시 기본 프롬프트로 진행
    //   console.log('Vision API 실패, 기본 프롬프트 사용')
    //   const defaultPrompt =
    //     "Create a portrait in Studio Ghibli style with anime-like features. Use the classic Ghibli look with large expressive eyes, simplified facial details, soft pastel colors, and gentle line work characteristic of Miyazaki's films. The character should have a warm, friendly appearance with the distinctive Ghibli aesthetic."
    //   const dalleResponse = await openai.images.generate({
    //     model: 'dall-e-2',
    //     prompt: defaultPrompt,
    //     n: 1,
    //     size: '1024x1024',
    //     response_format: 'b64_json',
    //   })
    //   if (!dalleResponse.data[0].b64_json) {
    //     throw new Error('이미지를 생성할 수 없습니다.')
    //   }
    //   const outputImage = `data:image/png;base64,${dalleResponse.data[0].b64_json}`
    //   return NextResponse.json({ outputImage })
    // }
    const apiKey = process.env.API_KEY
    if (!apiKey) {
      console.error('Error: API_KEY not found in environment variables.')
      return NextResponse.json({
        error: 'Error: API_KEY not found in environment variables.',
      })
    }

    const ai = new GoogleGenAI({ apiKey })

    const body = await request.json().catch((e) => {
      console.error('JSON 파싱 오류:', e)
      throw new Error('요청 본문을 파싱할 수 없습니다.')
    })
    const { image, fileName } = body
    if (!image) {
      console.error('이미지가 없음')
      return NextResponse.json(
        { error: '이미지가 필요합니다.' },
        { status: 400 }
      )
    }
    console.log('이미지 데이터 수신 완료. 길이:', image.length, fileName)

    // 이미지 파일 이름을 강아지 이미지 파일명으로 업데이트
    // const imagePath = './doori.jpg' // 첨부하신 강아지 이미지 파일명으로 변경하세요
    // const imageData = fs.readFileSync(imagePath)
    const base64Image = image
    const ghibliPrompt =
      'Convert this photo into a Studio Ghibli animation-style illustration. ' +
      'Important requirements: ' +
      '1. Preserve the exact composition, layout, and all background elements. ' +
      "2. Apply Ghibli's signature hand-drawn animation style with soft watercolor textures and smooth outlines. " +
      "3. Use the warm, nostalgic color palette typical of Miyazaki's films. " +
      '4. Do not add any new elements, characters, or background features. ' +
      '5. Do not change perspective, framing, or camera angles. ' +
      '6. Transformations should only be applied to visual styles, such as filters that transform a photo into a Ghibli animation without changing the content or composition'

    // Prepare the content parts
    const contents = [
      { text: ghibliPrompt },
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Image,
        },
      },
    ]

    // Set responseModalities to include "Image" so the model can generate an image
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp-image-generation',
      contents: contents,
      config: {
        responseModalities: ['Text', 'Image'],
        temperature: 0.2, // 낮은 온도값으로 설정하여 더 결정적인 결과 생성
        topK: 32,
        topP: 0.95,
      },
    })
    for (const part of response.candidates[0].content.parts) {
      // Based on the part type, either show the text or save the image
      if (part.text) {
        console.log(part.text)
      } else if (part.inlineData) {
        const imageData = part.inlineData.data
        const buffer = Buffer.from(imageData, 'base64')
        const outputPath = path.join(
          process.cwd(),
          'public',
          'images',
          `${fileName}.png`
        )
        fs.writeFileSync(outputPath, buffer)
        console.log(`Image saved as ${fileName}.png`)
      }
    }
    const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000'

    const imageUrl = `${baseUrl}/images/${fileName}.png`

    //&
    return NextResponse.json({
      success: 'Success!',
      outputImage: imageUrl,
    })
  } catch (error) {
    console.error('Error during image conversion:', error)

    let errorMessage = 'Unknown error'
    if (error instanceof Error) {
      errorMessage = error.message

      // OpenAI API 오류 메시지 포맷
      if (errorMessage.includes('OpenAI API')) {
        errorMessage = 'OpenAI API connection error. Check API key.'
      }
    }

    // 오류 메시지와 함께 상세 정보 반환
    return NextResponse.json(
      {
        error: 'An error occurred during image conversion.',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}
