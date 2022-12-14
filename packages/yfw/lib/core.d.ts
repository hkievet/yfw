export declare function stripSymbolsAndSpaces(title: string): string;
export declare function getYoutubeVideoTitle(url: string): Promise<string>;
export declare function downloadYoutubeVideo(url: string, title: string): Promise<string>;
export declare function runWhisperOnFile(inputFile: string): Promise<void>;
interface SRTLineSegment {
    text: string;
    startTime: string;
    endTime: string;
}
export declare function readSRT(videoName: string): SRTLineSegment[];
export declare function readAndParseSRT(videoName: string, start: number, end: number): SRTLineSegment;
export declare function ffmpegMakeClip(video: string, startTime: string, endTime: string, text: string): void;
export declare function startFullProcess(url: string): Promise<void>;
export {};
