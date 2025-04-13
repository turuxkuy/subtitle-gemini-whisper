
import { SubtitleEntry } from "@/types/subtitle";

export function parseSRT(content: string): SubtitleEntry[] {
  // Split the content by double newline to separate subtitle blocks
  const blocks = content.trim().split(/\r?\n\r?\n/);
  const subtitles: SubtitleEntry[] = [];

  for (const block of blocks) {
    // Skip empty blocks
    if (!block.trim()) continue;

    const lines = block.split(/\r?\n/);
    
    // First line should be the subtitle number
    const id = parseInt(lines[0]);
    
    // Second line contains the time range
    const timeRange = lines[1];
    const [startTime, endTime] = timeRange.split(' --> ');
    
    // Remaining lines make up the subtitle text
    const text = lines.slice(2).join('\n');

    subtitles.push({
      id,
      startTime: startTime.trim(),
      endTime: endTime.trim(),
      text: text.trim()
    });
  }

  return subtitles;
}

export function createSRTContent(subtitles: SubtitleEntry[]): string {
  return subtitles.map(subtitle => {
    return `${subtitle.id}\n${subtitle.startTime} --> ${subtitle.endTime}\n${subtitle.text}\n`;
  }).join('\n');
}
