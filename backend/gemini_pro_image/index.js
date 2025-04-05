import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import dotenv from "dotenv";

// .env 파일 로드
dotenv.config();

async function main() {
  // API 키가 존재하는지 확인
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("Error: API_KEY not found in environment variables.");
    console.error("Please create a .env file with API_KEY=your_api_key");
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });

  // 이미지 파일 이름을 강아지 이미지 파일명으로 업데이트
  const imagePath = "./doori.jpg"; // 첨부하신 강아지 이미지 파일명으로 변경하세요
  const imageData = fs.readFileSync(imagePath);
  const base64Image = imageData.toString("base64");

  const ghibliPrompt = "Convert this photo into a Studio Ghibli animation-style illustration. " +
  "Important requirements: " +
  "1. Preserve the exact composition, layout, and all background elements. " +
  "2. Apply Ghibli's signature hand-drawn animation style with soft watercolor textures and smooth outlines. " +
  "3. Use the warm, nostalgic color palette typical of Miyazaki's films. " +
  "4. Do not add any new elements, characters, or background features. " +
  "5. Do not change perspective, framing, or camera angles. " +
  "6. Transformations should only be applied to visual styles, such as filters that transform a photo into a Ghibli animation without changing the content or composition";

  // Prepare the content parts
  const contents = [
    { text: ghibliPrompt },
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Image,
      },
    },
  ];

  // Set responseModalities to include "Image" so the model can generate an image
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp-image-generation",
    contents: contents,
    config: {
      responseModalities: ["Text", "Image"],
      temperature: 0.2, // 낮은 온도값으로 설정하여 더 결정적인 결과 생성
      topK: 32,
      topP: 0.95,
    },
  });
  
  for (const part of response.candidates[0].content.parts) {
    // Based on the part type, either show the text or save the image
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("new-style.png", buffer);
      console.log("Image saved as new-style.png");
    }
  }
}

main().catch(error => {
  console.error("Error:", error);
});