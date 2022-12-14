"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startFullProcess = exports.ffmpegMakeClip = exports.readAndParseSRT = exports.readSRT = exports.runWhisperOnFile = exports.downloadYoutubeVideo = exports.getYoutubeVideoTitle = exports.stripSymbolsAndSpaces = void 0;
const path_1 = __importDefault(require("path"));
const { spawn } = require("child_process");
const fs = require("node:fs");
const pathToProcessDir = path_1.default.join(__dirname, "..", "..", "..", "process");
function stripSymbolsAndSpaces(title) {
    var newTitle = title
        .replace(/[^\w\s]/gi, "")
        .split(" ")
        .join("");
    return newTitle;
}
exports.stripSymbolsAndSpaces = stripSymbolsAndSpaces;
function getYoutubeVideoTitle(url) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const youtubeVideoTitle = spawn("yt-dlp", ["--get-title", url]);
            let videoTitle = "";
            youtubeVideoTitle.stdout.on("data", (data) => {
                console.log(`stdout: ${data}`);
                videoTitle = data;
            });
            youtubeVideoTitle.stderr.on("data", (data) => {
                console.error(`stderr: ${data}`);
                reject("Error running Process");
            });
            youtubeVideoTitle.on("close", (code) => {
                console.log(`child process exited with code ${code}, title: ${videoTitle}`);
                if (videoTitle) {
                    const fixedtitle = stripSymbolsAndSpaces(videoTitle.toString()).trim();
                    resolve(fixedtitle);
                }
                reject("no video title");
            });
        });
    });
}
exports.getYoutubeVideoTitle = getYoutubeVideoTitle;
function downloadYoutubeVideo(url, title) {
    return new Promise((resolve, reject) => {
        const fp = `${pathToProcessDir}/videos/${title}.mp4`;
        const youtubeDl = spawn("yt-dlp", ["-f best[ext=mp4]", `-o`, fp, url]);
        youtubeDl.stdout.on("data", (data) => {
            console.log(`stdout: ${data}`);
        });
        youtubeDl.stderr.on("data", (data) => {
            console.error(`stderr: ${data}`);
            reject(data);
        });
        youtubeDl.on("close", (code) => {
            console.log(`child process exited with code ${code}`);
            resolve(fp);
        });
    });
}
exports.downloadYoutubeVideo = downloadYoutubeVideo;
function runWhisperOnFile(inputFile) {
    return new Promise((resolve, reject) => {
        const args = [
            inputFile,
            "--model",
            "base.en",
            "--output_dir",
            pathToProcessDir,
        ];
        console.log("whisper" + " " + args.join(" "));
        const whisperProc = spawn("whisper", args);
        whisperProc.stdout.on("data", (data) => {
            console.log(`stdout: ${data}`);
        });
        whisperProc.stderr.on("data", (data) => {
            console.error(`stderr: ${data}`);
            //   reject(data)
        });
        whisperProc.on("close", (code) => {
            console.log(`child process exited with code ${code}`);
            resolve();
        });
    });
}
exports.runWhisperOnFile = runWhisperOnFile;
function readSRT(videoName) {
    // should be figured out and calculatable...
    const srtFile = `${pathToProcessDir}/output/${videoName}`;
    const file = fs.readFileSync(srtFile).toString();
    const lines = file.split("\n");
    const segments = [];
    const regex = /^\d+$/;
    lines.forEach((line, i) => {
        if (regex.test(line)) {
            const time = lines[i + 1];
            const text = lines[i + 2];
            let [startTime, endTime] = time.split(" --> ");
            segments.push({ text, startTime, endTime });
        }
    });
    return segments;
}
exports.readSRT = readSRT;
function readAndParseSRT(videoName, start, end) {
    const segments = readSRT(videoName);
    // should be figured out and calculatable..
    const requestedSegments = segments.slice(start - 1, end);
    const combinedText = requestedSegments
        .map((segment) => segment.text)
        .join(" ");
    // start 1 second earlier and end 1 second earlier.
    // 00:03:31 these are shaped like this:
    let startTime = requestedSegments[0].startTime;
    let [hhmmss, ms] = startTime.split(",");
    let [hh, mm, ss] = hhmmss.split(":");
    ss = String(Number.parseInt(ss) - 1).padStart(2, "0");
    startTime = `${[hh, mm, ss].join(":")}.${ms}`;
    let endTime = requestedSegments[requestedSegments.length - 1].endTime;
    [hhmmss, ms] = endTime.split(",");
    [hh, mm, ss] = endTime.split(":");
    ss = String(Number.parseInt(ss) + 1).padStart(2, "0");
    endTime = `${[hh, mm, ss].join(":")}.${ms}`;
    console.log(startTime, " - ", endTime);
    return {
        startTime,
        endTime,
        text: combinedText,
    };
}
exports.readAndParseSRT = readAndParseSRT;
function ffmpegMakeClip(video, startTime, endTime, text) {
    const words = text.split(" ");
    const fileName = words[0] + words[words.length - 1] + video + ".mp4";
    const videoFp = `${pathToProcessDir}/videos/${video}.mp4`;
    const args = [
        "-i",
        videoFp,
        "-ss",
        startTime,
        "-to",
        endTime,
        `${pathToProcessDir}/trimmed/${fileName}`,
    ];
    console.log(args.join(" "));
    const ffmpegMakeClipProc = spawn("ffmpeg", args);
    ffmpegMakeClipProc.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
    });
    ffmpegMakeClipProc.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
    });
    ffmpegMakeClipProc.on("close", (code) => {
        console.log(`child process exited with code ${code}`);
    });
}
exports.ffmpegMakeClip = ffmpegMakeClip;
function startFullProcess(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const title = yield getYoutubeVideoTitle(url);
            const fp = yield downloadYoutubeVideo(url, title);
            const finished = yield runWhisperOnFile(fp);
        }
        catch (e) {
            console.error(e);
        }
    });
}
exports.startFullProcess = startFullProcess;
//# sourceMappingURL=core.js.map