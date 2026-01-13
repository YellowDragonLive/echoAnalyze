import { GoogleGenAI, Type, Schema, Chat } from "@google/genai";
import { AnalysisResult, Scenario } from "../types";

// Helper to convert File to Base64
const fileToGenAiPart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    surfaceMeaning: { type: Type.STRING, description: "字面意思总结" },
    hiddenMotive: { type: Type.STRING, description: "深层动机或潜台词，揭示对方真实意图" },
    heartbreakIndex: { type: Type.NUMBER, description: "扎心指数 (0-100)，真相有多残酷" },
    euphemismLevel: { type: Type.NUMBER, description: "委婉程度/含蓄指数 (0-100)" },
    emotionalTags: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "情绪标签，如 '阴阳怪气', '虚情假意', '不耐烦', '真诚' 等" 
    },
    communicationScore: { type: Type.NUMBER, description: "沟通段位/质量评分 (0-100)" },
    missedCues: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "用户可能忽略的非语言信号或暗示" 
    },
    betterResponse: { type: Type.STRING, description: "高情商回复建议" },
    actionableAdvice: { type: Type.STRING, description: "具体的行动建议和局势分析" },
    keyExcerpts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "关键原文摘录或高亮语句 (针对文本分析，提取最能体现情绪或潜台词的原句)"
    },
    timelineAnalysis: {
      type: Type.ARRAY,
      description: "针对音视频的时间轴分析",
      items: {
        type: Type.OBJECT,
        properties: {
          timestamp: { type: Type.STRING },
          observation: { type: Type.STRING },
          type: { type: Type.STRING, enum: ["speech_rate", "tone", "pause", "expression"] }
        }
      }
    }
  },
  required: ["surfaceMeaning", "hiddenMotive", "heartbreakIndex", "emotionalTags", "betterResponse"],
};

export const analyzeIntent = async (
  input: string | File,
  scenario: Scenario,
  backgroundContext?: string
): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("环境变量中未找到 API Key。");
  }

  const ai = new GoogleGenAI({ apiKey });
  const modelId = 'gemini-3-flash-preview';

  const systemInstruction = `
    你是一位世界级的行为心理学家和沟通大师，尤其精通中国的人情世故、面子文化和职场潜规则。
    你的任务是“深度解码”对话背后的真实意图。
    
    当前场景: ${scenario.name} (${scenario.description})。
    ${scenario.promptContext}
    
    请分析用户提供的输入（文本、音频或视频）。
    
    分析要求：
    1. 对比“字面意思”与“心理现实”，一针见血地指出对方真正想表达的内容。
    2. 如果提供的是媒体文件，请捕捉微表情、语气突变、尴尬的停顿或语速变化，并在 timelineAnalysis 中列出。
    3. 如果是文本，请分析标点符号、用词，并提取 keyExcerpts (关键句) 予以高亮。
    4. 给出“扎心指数”和“委婉程度”。
    5. 提供高情商的回复建议和行动指南。
    
    ${backgroundContext ? `用户补充背景信息: "${backgroundContext}"。请结合此背景进行分析。` : ''}
    
    注意：所有输出必须使用**简体中文**。风格要犀利、精准。
  `;

  let parts: any[] = [];

  if (input instanceof File) {
    const mediaPart = await fileToGenAiPart(input);
    parts = [
      mediaPart,
      { text: "请分析此文件的语音语调、语速变化或面部表情微动作。" }
    ];
  } else {
    parts = [{ text: input }];
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        role: 'user',
        parts: parts
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.4, 
      },
    });

    const text = response.text;
    if (!text) throw new Error("AI 未返回数据");

    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("分析失败，可能是模型配置错误或网络问题，请重试。");
  }
};

export const createChatSession = async (
  input: string | File,
  scenario: Scenario,
  backgroundContext: string | undefined,
  analysisResult: AnalysisResult
): Promise<Chat> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key missing");

  const ai = new GoogleGenAI({ apiKey });
  const modelId = 'gemini-3-flash-preview';

  const systemInstruction = `
    你继续扮演行为心理学家。你之前已经对用户的输入进行了深度意图解码。
    现在，用户可能会针对分析结果提出疑问，或者询问更多细节。
    请基于之前的分析结果和原始输入，回答用户的追问。
    保持犀利、洞察力强的风格。
    场景: ${scenario.name}
    ${backgroundContext ? `背景: ${backgroundContext}` : ''}
  `;

  // Construct initial history
  let userContentParts: any[] = [];
  if (input instanceof File) {
    const mediaPart = await fileToGenAiPart(input);
    userContentParts = [
      mediaPart, 
      { text: `这是原始输入文件。之前的分析结果是：${JSON.stringify(analysisResult)}` }
    ];
  } else {
    userContentParts = [
      { text: `原始输入文本: "${input}"\n\n之前的分析结果: ${JSON.stringify(analysisResult)}` }
    ];
  }

  const chat = ai.chats.create({
    model: modelId,
    config: { systemInstruction },
    history: [
      {
        role: 'user',
        parts: userContentParts
      },
      {
        role: 'model',
        parts: [{ text: "好的，我已经了解了背景和分析结果。请问您有什么具体想问的细节，或者需要我进一步解释的地方吗？" }]
      }
    ]
  });

  return chat;
};
