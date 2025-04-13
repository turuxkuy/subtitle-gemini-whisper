
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
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
  selectedLanguage,
  onLanguageChange,
  onTranslate,
  isTranslating,
  disableTranslate,
}) => {
  const [open, setOpen] = useState(false);

  const selectedLanguageLabel = languages.find(
    (language) => language.value === selectedLanguage
  )?.label;

  return (
    <div className="flex flex-col space-y-4">
      <div className="space-y-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {selectedLanguageLabel || "Select language..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search language..." />
              <CommandEmpty>No language found.</CommandEmpty>
              <CommandGroup className="max-h-[300px] overflow-y-auto">
                {languages.map((language) => (
                  <CommandItem
                    key={language.value}
                    value={language.value}
                    onSelect={(currentValue) => {
                      onLanguageChange(currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedLanguage === language.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {language.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
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
