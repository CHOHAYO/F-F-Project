import { GoogleGenAI } from "@google/genai";
import { UploadType, MenuId } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// ... (Existing SCHEMAS code remains same, omitted for brevity but logic is preserved) ...
const SCHEMAS = {
  [UploadType.SALES]: `
    [
      {
        "month": "string (e.g., '1월' or '2025-01')",
        "target": "number (amount)",
        "actual": "number (amount)"
      }
    ]
  `,
  [UploadType.COMPETITOR]: `
    [
      {
        "subject": "string (category name)",
        "FnF": "number (score or amount)",
        "CompA": "number (score or amount)",
        "CompB": "number (score or amount)"
      }
    ]
  `,
  [UploadType.PRODUCT]: `
    [
      {
        "week": "string (e.g., 'W1', '1주차')",
        "sales": "number (quantity)",
        "inventory": "number (quantity)"
      }
    ]
  `,
  [UploadType.CUSTOMER]: `
    [
      {
        "name": "string (category or sentiment)",
        "value": "number (count)"
      }
    ]
  `
};

export const transformDataWithAI = async (
  rawData: any[],
  type: UploadType
): Promise<any[]> => {
  try {
    const dataSample = rawData.slice(0, 50); 
    const targetSchema = SCHEMAS[type];

    const prompt = `
      You are a data transformation expert.
      I have raw data uploaded from an Excel file which might have messy headers or different formats.
      Your task is to extract relevant data and transform it into a strict JSON array following this schema:
      
      TARGET SCHEMA:
      ${targetSchema}

      RULES:
      1. Analyze the 'RAW DATA' below. Identify columns that match the meaning of the target schema keys.
      2. Rename keys to match the target schema exactly.
      3. Convert values to the correct type (remove commas, currency symbols, convert strings to numbers).
      4. Return ONLY the JSON array. No markdown, no explanations.
      5. If the raw data is completely irrelevant, return an empty array [].

      RAW DATA:
      ${JSON.stringify(dataSample)}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsedText = response.text;
    if (!parsedText) return [];
    
    return JSON.parse(parsedText);
  } catch (error) {
    console.error("AI Data Transformation Failed:", error);
    throw new Error("AI가 데이터 구조를 분석하지 못했습니다. 파일 내용을 확인해주세요.");
  }
};

export const generateDashboardInsight = async (
  currentDate: string,
  salesData: any[],
  competitorData: any[]
): Promise<string> => {
  // Original global insight function (kept for backward compatibility or overview)
  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      당신은 F&F 영업팀의 수석 전략가입니다.
      기준일: ${currentDate}
      [매출 현황] ${JSON.stringify(salesData?.slice(0, 5) || [])}
      [경쟁사 현황] ${JSON.stringify(competitorData || [])}
      
      전체적인 영업 상황에 대한 3줄 요약 코멘트를 작성해주세요. (한국어)
    `;
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text || "데이터 분석 실패";
  } catch (error) {
    return "AI 서비스 연결 실패";
  }
};

// NEW: Context-Aware Analysis per Tab
export const generateTabSpecificAnalysis = async (
  menuId: MenuId,
  dataContext: any
): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview';
    let promptContext = "";
    let roleDescription = "";

    switch (menuId) {
      case 'flagship':
        promptContext = `매출 데이터: ${JSON.stringify(dataContext)}`;
        roleDescription = "매출 성과 분석가로서, 현재 매출 추세와 목표 달성율을 분석하고, 다음 달 매출 증대를 위한 핵심 액션 아이템 3가지를 제안하세요.";
        break;
      case 'market':
        promptContext = `경쟁사 지표: ${JSON.stringify(dataContext)}`;
        roleDescription = "시장 전략가로서, 경쟁사 대비 당사의 강점과 약점을 파악하고, 시장 점유율 확대를 위한 공격적인 마케팅 전략을 수립하세요.";
        break;
      case 'category':
        promptContext = `상품 판매/재고 데이터: ${JSON.stringify(dataContext)}`;
        roleDescription = "MD(Merchandiser)로서, 판매 속도가 빠른 상품(Best Seller)과 재고가 쌓이는 상품(Slow Mover)을 구분하고, 재고 회전율 개선 방안을 제시하세요.";
        break;
      case 'voc':
        promptContext = `고객 리뷰 데이터: ${JSON.stringify(dataContext)}`;
        roleDescription = "CX(Customer Experience) 전문가로서, 고객들의 주요 불만 사항과 칭찬 포인트를 요약하고, 브랜드 로열티를 높이기 위한 서비스 개선안을 도출하세요.";
        break;
      default:
        return "";
    }

    const fullPrompt = `
      ${roleDescription}
      
      [분석 대상 데이터]
      ${promptContext}

      작성 규칙:
      1. 한국어로 작성하십시오.
      2. 전문적이고 통찰력 있는 톤앤매너를 유지하십시오.
      3. HTML 태그 없이 순수 텍스트(Markdown 형식 가능)로 출력하십시오.
      4. 핵심 내용을 불렛 포인트로 정리하여 가독성을 높이십시오.
      5. 글자 수는 400자 이내로 핵심만 요약하십시오.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: fullPrompt,
    });

    return response.text || "해당 섹션에 대한 AI 분석을 생성할 수 없습니다.";

  } catch (error) {
    console.error("Tab Analysis Error:", error);
    return "AI 분석 서버와 통신 중 오류가 발생했습니다.";
  }
};