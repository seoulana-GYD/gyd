import { NextResponse } from 'next/server'
import OpenAI from 'openai/index.mjs'

export async function GET() {
  try {
    console.log('API 키 테스트 호출')

    // API 키 확인
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'API 키 테스트 실패',
          details: 'OpenAI API 키가 설정되지 않았습니다.',
        },
        { status: 500 }
      )
    }

    console.log('API 키 일부:', apiKey.substring(0, 10) + '...')

    // OpenAI 클라이언트 초기화
    const openai = new OpenAI({
      apiKey: apiKey,
    })

    // 간단한 ChatGPT 요청으로 API 연결 테스트
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            '첨부한 이미지를 읽고 지브리풍의 이미지를 만들어주거나 일본 애니메이션 느낌의 이미지를 만들어달라 예를 들면 이웃집 토토로  처럼 만들어달라',
        },
        { role: 'user', content: 'Say Hello World!' },
      ],
      max_tokens: 20,
    })

    return NextResponse.json({
      success: true,
      message: 'API 키가 정상적으로 작동합니다.',
      response: response.choices[0].message.content,
    })
  } catch (error) {
    console.error('API 테스트 중 오류 발생:', error)

    let errorMessage = '알 수 없는 오류'
    if (error instanceof Error) {
      errorMessage = error.message
    }

    return NextResponse.json(
      {
        success: false,
        error: 'API 키 테스트 실패',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}
