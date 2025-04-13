
import { SubtitleEntry } from "@/types/subtitle";
import { Button } from "./ui/button";
import { Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface TranslationResultProps {
  original: SubtitleEntry[];
  translated: SubtitleEntry[];
  onDownload: () => void;
}

const TranslationResult: React.FC<TranslationResultProps> = ({
  original,
  translated,
  onDownload,
}) => {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="comparison" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="comparison">Perbandingan</TabsTrigger>
          <TabsTrigger value="full">Teks Lengkap</TabsTrigger>
        </TabsList>
        
        <TabsContent value="comparison" className="mt-4">
          <ScrollArea className="h-[400px] rounded-md border p-4">
            {translated.map((subtitle, index) => (
              <div key={subtitle.id} className="mb-6">
                <div className="text-sm text-muted-foreground mb-1">
                  {subtitle.startTime} → {subtitle.endTime}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-md">
                    <div className="text-xs text-muted-foreground mb-1">Asli:</div>
                    <div>{original[index]?.text}</div>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-md">
                    <div className="text-xs text-muted-foreground mb-1">Terjemahan:</div>
                    <div>{subtitle.text}</div>
                  </div>
                </div>
                {index < translated.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="full" className="mt-4">
          <ScrollArea className="h-[400px] rounded-md border p-4">
            {translated.map((subtitle) => (
              <div key={subtitle.id} className="mb-3">
                <div className="text-sm text-muted-foreground mb-1">
                  {subtitle.id}: {subtitle.startTime} → {subtitle.endTime}
                </div>
                <div className="p-3 bg-primary/5 rounded-md">
                  {subtitle.text}
                </div>
              </div>
            ))}
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={onDownload} className="flex items-center gap-2">
          <Download size={16} />
          <span>Download Subtitle</span>
        </Button>
      </div>
    </div>
  );
};

export default TranslationResult;
