import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ViralAnalysis } from "../types";

// Initialize Gemini Client
// IMPORTANT: Expects process.env.API_KEY to be available
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = "gemini-2.5-flash";

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    hookStrategy: {
      type: Type.STRING,
      description: "초반 10초 동안 시청자를 사로잡은 '후킹' 전략에 대한 분석 (한국어)",
    },
    pacing: {
      type: Type.STRING,
      description: "편집 및 말하기 속도와 호흡에 대한 설명 (예: 빠른 컷 편집, 차분한 설명 등) (한국어)",
    },
    emotionalTriggers: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "사용된 감정적 트리거 목록 (예: 호기심, 공포, 대리만족, 분노 등) (한국어)",
    },
    structureType: {
      type: Type.STRING,
      description: "스토리텔링 구조 유형 (예: 영웅의 여정, 순위 매기기, 문제-해결 구조 등) (한국어)",
    },
    retentionTechniques: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "시청 지속 시간을 늘리기 위해 사용된 구체적인 기법들 (예: 열린 결말, 패턴 깨기 등) (한국어)",
    },
    callToActionType: {
      type: Type.STRING,
      description: "구독이나 좋아요를 유도하는 방식 (한국어)",
    },
    summary: {
      type: Type.STRING,
      description: "이 영상이 왜 떡상했는지에 대한 2문장 요약 (한국어)",
    },
    suggestedTopics: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "이 영상의 구조와 스타일을 적용했을 때 대박날 만한 새로운 주제 3가지 추천 (한국어)",
    }
  },
  required: ["hookStrategy", "pacing", "emotionalTriggers", "structureType", "retentionTechniques", "callToActionType", "summary", "suggestedTopics"],
};

export const analyzeViralScript = async (transcript: string): Promise<ViralAnalysis> => {
  if (!transcript || transcript.length < 50) {
    throw new Error("대본이 너무 짧습니다. 50자 이상 입력해주세요.");
  }

  const prompt = `
    당신은 대한민국 최고의 유튜브 알고리즘 전략가입니다.
    다음은 조회수가 폭발한 '떡상' 영상의 대본입니다.
    
    이 대본을 분석하여 성공 요인(Viral DNA)을 추출하고, 
    이 스타일을 그대로 적용해서 또 다른 대박을 터뜨릴 수 있는 새로운 주제 3가지를 추천해주세요.
    모든 분석 결과는 **반드시 한국어**로 작성되어야 합니다.
    
    대본:
    "${transcript.substring(0, 15000)}" 
    (너무 길 경우 일부 생략됨)
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "당신은 냉철하고 분석적인 유튜브 컨설턴트입니다. 핵심만 명확하게 한국어로 전달하세요.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("Gemini로부터 응답이 없습니다.");
    
    return JSON.parse(text) as ViralAnalysis;
  } catch (error) {
    console.error("Analysis Error:", error);
    throw new Error("대본 분석에 실패했습니다. 다시 시도해주세요.");
  }
};

export const generateRemixedScript = async (
  analysis: ViralAnalysis, 
  newTopic: string
): Promise<string> => {
  
  const analysisContext = JSON.stringify(analysis, null, 2);

  const prompt = `
    새로운 유튜브 영상 대본을 작성해주세요.
    주제: "${newTopic}"
    
    **중요**: 반드시 이전에 분석한 '떡상 영상'의 성공 공식(Viral DNA)을 그대로 따라야 합니다.
    
    [성공 공식 분석 데이터]
    ${analysisContext}
    
    [작성 지침]
    1. **구조**: ${analysis.structureType} 구조를 그대로 사용하세요.
    2. **후킹**: 오프닝은 다음 전략을 따르세요: ${analysis.hookStrategy}.
    3. **호흡**: ${analysis.pacing} 느낌이 나도록 문장을 구성하세요.
    4. **몰입 장치**: 다음 기법들을 대본 곳곳에 배치하세요: ${analysis.retentionTechniques.join(", ")}.
    5. **톤앤매너**: 원본 영상의 에너지와 감정선을 유지하세요.
    6. **언어**: 자연스럽고 몰입도 높은 **한국어 구어체**로 작성하세요.
    
    [출력 형식]
    Markdown 형식을 사용하세요.
    섹션은 헤더(##)로 구분하세요 (예: ## 후킹 (0-10초), ## 본론 1, ## 결론 및 CTA).
    영상 편집자를 위한 지시문(화면 연출, 효과음 등)은 인용구(>)로 표시하세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: prompt,
    });

    return response.text || "대본 생성에 실패했습니다.";
  } catch (error) {
    console.error("Generation Error:", error);
    throw new Error("새로운 대본을 생성하는 중 오류가 발생했습니다.");
  }
};