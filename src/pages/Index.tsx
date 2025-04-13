
import { useState } from "react";
import { Upload, Languages, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FileUploader from "@/components/FileUploader";
import LanguageSelector from "@/components/LanguageSelector";
import TranslationResult from "@/components/TranslationResult";
import { Separator } from "@/components/ui/separator";
import { SubtitleEntry } from "@/types/subtitle";
import { parseSRT, createSRTContent } from "@/utils/srtParser";
import { translateSubtitles } from "@/services/geminiService";
import { toast } from "sonner";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [targetLanguage, setTargetLanguage] = useState("id");
  const [originalSubtitles, setOriginalSubtitles] = useState<SubtitleEntry[]>([]);
  const [translatedSubtitles, setTranslatedSubtitles] = useState<SubtitleEntry[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setTranslatedSubtitles([]);
    
    try {
      const content = await uploadedFile.text();
      const subtitles = parseSRT(content);
      setOriginalSubtitles(subtitles);
      
      toast.success("SRT file successfully loaded");
    } catch (error) {
      toast.error("Failed to parse SRT file. Please check the file format.");
      console.error("SRT parsing error:", error);
    }
  };

  const handleTranslate = async () => {
    if (originalSubtitles.length === 0) {
      toast.error("Please upload a valid SRT file first");
      return;
    }

    setIsTranslating(true);

    try {
      const translated = await translateSubtitles(originalSubtitles, targetLanguage);
      setTranslatedSubtitles(translated);
      toast.success("Translation completed successfully");
    } catch (error) {
      toast.error("Translation failed. Please try again.");
      console.error("Translation error:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleDownload = () => {
    if (translatedSubtitles.length === 0) {
      toast.error("No translated subtitles to download");
      return;
    }

    const content = createSRTContent(translatedSubtitles);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = file ? `translated_${file.name}` : "translated_subtitles.srt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Terjemahan Subtitle</h1>
          <p className="text-muted-foreground">Upload file SRT Anda dan terjemahkan ke bahasa lain menggunakan Gemini AI</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload size={20} />
                <span>Upload File SRT</span>
              </CardTitle>
              <CardDescription>
                Seret dan lepas file SRT Anda atau klik untuk memilih file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader onFileUpload={handleFileUpload} file={file} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages size={20} />
                <span>Bahasa Target</span>
              </CardTitle>
              <CardDescription>
                Pilih bahasa tujuan untuk terjemahan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LanguageSelector 
                selectedLanguage={targetLanguage}
                onLanguageChange={setTargetLanguage}
                onTranslate={handleTranslate}
                isTranslating={isTranslating}
                disableTranslate={originalSubtitles.length === 0}
              />
            </CardContent>
          </Card>

          {translatedSubtitles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText size={20} />
                  <span>Subtitle Terjemahan</span>
                </CardTitle>
                <CardDescription>
                  Hasil terjemahan dari file SRT Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TranslationResult 
                  original={originalSubtitles}
                  translated={translatedSubtitles}
                  onDownload={handleDownload}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
