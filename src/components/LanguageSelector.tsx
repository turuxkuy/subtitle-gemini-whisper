
import { useState } from "react";
import { Check, ChevronsUpDown, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { geminiModels } from "@/services/geminiService";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LanguageSelectorProps {
  selectedSourceLanguage: string;
  selectedTargetLanguage: string;
  selectedModel: string;
  onSourceLanguageChange: (language: string) => void;
  onTargetLanguageChange: (language: string) => void;
  onModelChange: (model: string) => void;
  onTranslate: () => void;
  isTranslating: boolean;
  disableTranslate: boolean;
}

const languages = [
  { value: "id", label: "Bahasa Indonesia" },
  { value: "en", label: "English" },
  { value: "ja", label: "Japanese (日本語)" },
  { value: "ko", label: "Korean (한국어)" },
  { value: "zh", label: "Chinese Simplified (简体中文)" },
  { value: "zh-TW", label: "Chinese Traditional (繁體中文)" },
  { value: "fr", label: "French (Français)" },
  { value: "de", label: "German (Deutsch)" },
  { value: "es", label: "Spanish (Español)" },
  { value: "pt", label: "Portuguese (Português)" },
  { value: "ru", label: "Russian (Русский)" },
  { value: "ar", label: "Arabic (العربية)" },
  { value: "hi", label: "Hindi (हिन्दी)" },
  { value: "bn", label: "Bengali (বাংলা)" },
  { value: "it", label: "Italian (Italiano)" },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedSourceLanguage,
  selectedTargetLanguage,
  selectedModel,
  onSourceLanguageChange,
  onTargetLanguageChange,
  onModelChange,
  onTranslate,
  isTranslating,
  disableTranslate,
}) => {
  return (
    <div className="flex flex-col space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Bahasa Asal</label>
          <Select 
            value={selectedSourceLanguage} 
            onValueChange={onSourceLanguageChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih bahasa asal..." />
            </SelectTrigger>
            <SelectContent>
              {languages.map((language) => (
                <SelectItem key={language.value} value={language.value}>
                  {language.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Bahasa Tujuan</label>
          <Select 
            value={selectedTargetLanguage} 
            onValueChange={onTargetLanguageChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih bahasa tujuan..." />
            </SelectTrigger>
            <SelectContent>
              {languages.map((language) => (
                <SelectItem key={language.value} value={language.value}>
                  {language.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 flex items-center gap-1">
            <Sparkles size={16} className="text-yellow-500" />
            <span>Model AI</span>
          </label>
          <Select 
            value={selectedModel} 
            onValueChange={onModelChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih model AI..." />
            </SelectTrigger>
            <SelectContent>
              {geminiModels.map((model) => (
                <TooltipProvider key={model.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SelectItem value={model.id}>
                        {model.name}
                      </SelectItem>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{model.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button 
        className="w-full" 
        onClick={onTranslate} 
        disabled={isTranslating || disableTranslate}
      >
        {isTranslating ? "Menerjemahkan..." : "Terjemahkan Subtitle"}
      </Button>
    </div>
  );
};

export default LanguageSelector;
