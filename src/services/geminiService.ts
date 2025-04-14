
import { SubtitleEntry } from "@/types/subtitle";

// The Gemini API key
const GEMINI_API_KEY = "AIzaSyA8YmwOrBK7Yg1E_NMg-_T2TZf7J9h8qOM";
// The OpenRouter API key - DO NOT use this in production
const OPENROUTER_API_KEY = "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";

// Available models
export const geminiModels = [
  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", description: "Cepat dan hemat", provider: "gemini" },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", description: "Kualitas tinggi", provider: "gemini" },
  { id: "gemini-pro", name: "Gemini Pro", description: "Model standar", provider: "gemini" },
  { id: "gemini-pro-vision", name: "Gemini Pro Vision", description: "Mendukung analisis gambar", provider: "gemini" },
  { id: "google/gemini-2.0-flash-thinking-exp:free", name: "Gemini 2.0 Flash Thinking", description: "Experimental via OpenRouter", provider: "openrouter" },
];

export async function translateSubtitles(
  subtitles: SubtitleEntry[],
  sourceLanguage: string,
  targetLanguage: string,
  model: string = "gemini-1.5-flash"
): Promise<SubtitleEntry[]> {
  try {
    // Ensure subtitles array is not empty
    if (!subtitles || subtitles.length === 0) {
      throw new Error("No subtitles provided for translation");
    }

    // Get language labels for better prompting
    const languages: Record<string, string> = {
      "id": "Bahasa Indonesia",
      "en": "English",
      "ja": "Japanese",
      "ko": "Korean",
      "zh": "Chinese Simplified",
      "zh-TW": "Chinese Traditional",
      "fr": "French",
      "de": "German",
      "es": "Spanish",
      "pt": "Portuguese",
      "ru": "Russian",
      "ar": "Arabic",
      "hi": "Hindi",
      "bn": "Bengali",
      "it": "Italian",
    };
    
    const sourceLangName = languages[sourceLanguage] || sourceLanguage;
    const targetLangName = languages[targetLanguage] || targetLanguage;

    const subtitleTexts = subtitles.map(sub => sub.text);
    
    // Find the selected model to determine provider
    const selectedModelInfo = geminiModels.find(m => m.id === model);
    
    // Default to gemini-1.5-flash if model not found
    if (!selectedModelInfo) {
      console.warn(`Model ${model} not found, falling back to gemini-1.5-flash`);
      return translateWithGemini(
        subtitles, 
        subtitleTexts, 
        sourceLangName, 
        targetLangName, 
        "gemini-1.5-flash"
      );
    }
    
    // Use the appropriate API based on provider
    if (selectedModelInfo.provider === "openrouter") {
      return translateWithOpenRouter(
        subtitles, 
        subtitleTexts, 
        sourceLangName, 
        targetLangName, 
        selectedModelInfo.id
      );
    } else {
      return translateWithGemini(
        subtitles, 
        subtitleTexts, 
        sourceLangName, 
        targetLangName, 
        selectedModelInfo.id
      );
    }
  } catch (error) {
    console.error("Translation error:", error);
    // If API call fails, return mock translated subtitles (as fallback)
    const languageMap: Record<string, string> = {
      "id": "[Terjemahan Bahasa Indonesia] ",
      "en": "[English Translation] ",
      "fr": "[Traduction Française] ",
      "de": "[Deutsche Übersetzung] ",
      "es": "[Traducción Española] ",
      "pt": "[Tradução Portuguesa] ",
      "ru": "[Русский перевод] ",
      "ja": "[日本語翻訳] ",
      "ko": "[한국어 번역] ",
      "zh": "[简体中文翻译] ",
      "zh-TW": "[繁體中文翻譯] ",
      "ar": "[ترجمة عربية] ",
      "hi": "[हिंदी अनुवाद] ",
      "bn": "[বাংলা অনুবাদ] ",
      "it": "[Traduzione Italiana] ",
    };

    return subtitles.map(subtitle => ({
      ...subtitle,
      text: `${languageMap[targetLanguage] || ''}${subtitle.text} (API Error: ${(error as Error).message})`
    }));
  }
}

async function translateWithGemini(
  subtitles: SubtitleEntry[],
  subtitleTexts: string[],
  sourceLangName: string,
  targetLangName: string,
  modelId: string
): Promise<SubtitleEntry[]> {
  console.log("Using Gemini API with model:", modelId);
  
  const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/" + modelId + ":generateContent";
  
  // Enhanced prompt with clear instructions for high-quality translations
  const prompt = `Translate the following subtitles from ${sourceLangName} to ${targetLangName}.
Your translation MUST:
1. Maintain the original meaning and context
2. Use natural expressions in ${targetLangName}
3. Keep proper names unchanged
4. Preserve formatting and emotion
5. Be concise and clear
6. Translate ALL subtitles completely without omissions

Return ONLY the translated text for each subtitle, in the same order:

${subtitleTexts.join('\n\n')}`;

  console.log("Sending request to Gemini API with prompt:", prompt);
  console.log("Source language:", sourceLangName);
  console.log("Target language:", targetLangName);
  console.log("Selected model:", modelId);
  console.log("Number of subtitles:", subtitles.length);

  // Make request to Gemini API
  const response = await fetch(`${apiUrl}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 8192 // Ensure there's enough token space for all translations
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Gemini API error:", errorData);
    throw new Error(`Gemini API responded with status ${response.status}: ${errorData}`);
  }

  const data = await response.json();
  console.log("Gemini API response:", data);
  
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0].text) {
    console.error("Unexpected Gemini API response structure:", data);
    throw new Error("Unexpected Gemini API response structure");
  }
  
  // Extract translated text from the response
  const translatedText = data.candidates[0].content.parts[0].text;
  
  // Split the translated text by double newlines to get individual subtitles
  const translatedSubtitles = translatedText.split(/\n\s*\n/);
  
  console.log("Translated subtitles count:", translatedSubtitles.length);
  console.log("Original subtitles count:", subtitles.length);
  
  // If the counts don't match, try to intelligently adjust or log a warning
  if (translatedSubtitles.length !== subtitles.length) {
    console.warn("Warning: number of translated subtitles doesn't match original count.");
  }
  
  // Map the translated text back to subtitle objects, ensuring each subtitle gets a translation
  const result = subtitles.map((sub, index) => ({
    ...sub,
    text: index < translatedSubtitles.length ? translatedSubtitles[index].trim() : 
      `[${targetLangName} translation missing] ${sub.text}`
  }));
  
  return result;
}

async function translateWithOpenRouter(
  subtitles: SubtitleEntry[],
  subtitleTexts: string[],
  sourceLangName: string,
  targetLangName: string,
  modelId: string
): Promise<SubtitleEntry[]> {
  console.log("Using OpenRouter API with model:", modelId);
  
  const apiUrl = "https://openrouter.ai/api/v1/chat/completions";
  
  // Create a clear system message for translation
  const systemMessage = `You are a professional subtitle translator. Translate subtitles from ${sourceLangName} to ${targetLangName} maintaining original meaning, context, formatting, and emotion. Keep proper names unchanged. Be concise and clear. Translate ALL subtitles without omissions.`;
  
  // Create the user message with the subtitles
  const userMessage = `Translate these subtitles from ${sourceLangName} to ${targetLangName}. Return ONLY the translated subtitles, one subtitle per paragraph, with no additional text:\n\n${subtitleTexts.join('\n\n')}`;
  
  console.log("Sending request to OpenRouter API");
  console.log("Source language:", sourceLangName);
  console.log("Target language:", targetLangName);
  console.log("Model ID:", modelId);
  console.log("Number of subtitles:", subtitles.length);

  // Make request to OpenRouter API
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": window.location.origin, // Required for OpenRouter API
      "X-Title": "Subtitle Translator" // Optional but recommended
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
      ],
      temperature: 0.2,
      max_tokens: 8192
    })
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("OpenRouter API error:", errorData);
    throw new Error(`OpenRouter API responded with status ${response.status}: ${errorData}`);
  }

  const data = await response.json();
  console.log("OpenRouter API response:", data);
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
    console.error("Unexpected OpenRouter API response structure:", data);
    throw new Error("Unexpected OpenRouter API response structure");
  }
  
  // Extract translated text from the response
  const translatedText = data.choices[0].message.content;
  
  // Split the translated text by double newlines to get individual subtitles
  const translatedSubtitles = translatedText.split(/\n\s*\n/);
  
  console.log("Translated subtitles count:", translatedSubtitles.length);
  console.log("Original subtitles count:", subtitles.length);
  
  // If the counts don't match, try to intelligently adjust or log a warning
  if (translatedSubtitles.length !== subtitles.length) {
    console.warn("Warning: number of translated subtitles doesn't match original count.");
  }
  
  // Map the translated text back to subtitle objects, ensuring each subtitle gets a translation
  const result = subtitles.map((sub, index) => ({
    ...sub,
    text: index < translatedSubtitles.length ? translatedSubtitles[index].trim() : 
      `[${targetLangName} translation missing] ${sub.text}`
  }));
  
  return result;
}
