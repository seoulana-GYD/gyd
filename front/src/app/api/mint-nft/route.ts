import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import * as fs from 'node:fs'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()
export async function POST(request: NextRequest) {
  return NextResponse.json({
    details: 'Message',
  })
}
