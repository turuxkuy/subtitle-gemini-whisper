
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
  selectedSourceLanguage: string;
  selectedTargetLanguage: string;
  onSourceLanguageChange: (language: string) => void;
  onTargetLanguageChange: (language: string) => void;
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
  onSourceLanguageChange,
  onTargetLanguageChange,
  onTranslate,
  isTranslating,
  disableTranslate,
}) => {
  const [sourceOpen, setSourceOpen] = useState(false);
  const [targetOpen, setTargetOpen] = useState(false);

  const selectedSourceLanguageLabel = languages.find(
    (language) => language.value === selectedSourceLanguage
  )?.label;

  const selectedTargetLanguageLabel = languages.find(
    (language) => language.value === selectedTargetLanguage
  )?.label;

  return (
    <div className="flex flex-col space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Bahasa Asal</label>
          <Popover open={sourceOpen} onOpenChange={setSourceOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={sourceOpen}
                className="w-full justify-between"
              >
                {selectedSourceLanguageLabel || "Pilih bahasa asal..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Cari bahasa..." />
                <CommandList>
                  <CommandEmpty>Bahasa tidak ditemukan.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-y-auto">
                    {languages.map((language) => (
                      <CommandItem
                        key={language.value}
                        value={language.value}
                        onSelect={() => {
                          onSourceLanguageChange(language.value);
                          setSourceOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedSourceLanguage === language.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {language.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Bahasa Tujuan</label>
          <Popover open={targetOpen} onOpenChange={setTargetOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={targetOpen}
                className="w-full justify-between"
              >
                {selectedTargetLanguageLabel || "Pilih bahasa tujuan..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Cari bahasa..." />
                <CommandList>
                  <CommandEmpty>Bahasa tidak ditemukan.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-y-auto">
                    {languages.map((language) => (
                      <CommandItem
                        key={language.value}
                        value={language.value}
                        onSelect={() => {
                          onTargetLanguageChange(language.value);
                          setTargetOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedTargetLanguage === language.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {language.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
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
