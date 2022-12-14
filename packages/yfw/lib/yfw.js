#!/usr/bin/env ts-node
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
const command = require("commander");
const program = new command.Command();
const coreFunctions = require("./core");
program
    .command("start")
    .option("--url <youtubeUrl>", "The youtube url to donwload")
    .action(function ({ url }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield coreFunctions.startFullProcess(url);
        // // downloadYoutubeVideo(url)
        // const title = await getYoutubeVideoTitle(url);
        // const fp = await downloadYoutubeVideo(url, title);
        // const finished = await runWhisperOnFile(fp);
    });
});
program
    .command("strip")
    .option("--v <value>", "The value to strip")
    .action(({ v }) => {
    console.log(coreFunctions.stripSymbolsAndSpaces(v));
});
program
    .command("startWhisper")
    .option("--file <filepath>", "path to the file you want to convert to whisper")
    .action(({ file }) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(file);
    yield coreFunctions.runWhisperOnFile(file);
}));
program
    .command("trimVideo")
    .option("--video <string>", "Name of video you care about")
    .option("--start <number>", "Start number in the srt")
    .option("--end <number>", "End position in srt")
    .action(({ video, start, end }) => {
    const { startTime, endTime, text } = coreFunctions.readAndParseSRT(video, start, end);
    coreFunctions.ffmpegMakeClip(video, startTime, endTime, text);
});
program.parse(process.argv);
//# sourceMappingURL=yfw.js.map