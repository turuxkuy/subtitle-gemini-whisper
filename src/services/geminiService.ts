
import { SubtitleEntry } from "@/types/subtitle";

// The Gemini API key
const GEMINI_API_KEY = "AIzaSyA8YmwOrBK7Yg1E_NMg-_T2TZf7J9h8qOM";

export async function translateSubtitles(
  subtitles: SubtitleEntry[],
  sourceLanguage: string,
  targetLanguage: string
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
    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
    
    // Create the prompt with source and target language
    const prompt = `Translate the following subtitles from ${sourceLangName} to ${targetLangName}. 
Return only the translated text for each subtitle, maintaining the same format and number:

${subtitleTexts.join('\n\n')}`;

    console.log("Sending request to Gemini API with prompt:", prompt);
    console.log("Source language:", sourceLangName);
    console.log("Target language:", targetLangName);
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
          topK: 40
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
    
    // Map the translated text back to subtitle objects
    const result = subtitles.map((sub, index) => ({
      ...sub,
      text: index < translatedSubtitles.length ? translatedSubtitles[index].trim() : sub.text
    }));
    
    return result;
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
