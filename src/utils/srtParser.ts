
export function createSRTContent(subtitles: SubtitleEntry[]): string {
  return subtitles.map((subtitle, index) => {
    return `${index + 1}\n${subtitle.startTime} --> ${subtitle.endTime}\n${subtitle.text}\n`;
  }).join('\n');
}
