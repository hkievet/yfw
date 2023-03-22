#!/usr/bin/env ts-node
import { Command } from "commander";
import { startFullProcess } from "./core";
import { ffmpegMakeClip } from "./core/ffmpeg-make-clip";
import { runWhisperOnFile } from "./core/run-whisper-on-file";
import { stripSymbolsAndSpaces } from "./core/strip-symbols-and-spaces";
const program = new Command();
import { createVideoTable, dropVideoTable } from "./db";

program
  .command("start")
  .option("--url <youtubeUrl>", "The youtube url to donwload")
  .action(async function ({ url }) {
    await startFullProcess(url);
  });

program
  .command("strip")
  .option("--v <value>", "The value to strip")
  .action(({ v }) => {
    console.log(stripSymbolsAndSpaces(v));
  });

program
  .command("startWhisper")
  .option(
    "--file <filepath>",
    "path to the file you want to convert to whisper"
  )
  .action(async ({ file }) => {
    console.log(file);
    await runWhisperOnFile(file);
  });

program
  .command("trimVideo")
  .option("--video <string>", "Name of video you care about")
  .option("--start <number>", "Start number in the srt")
  .option("--end <number>", "End position in srt")
  .action(({ video, start, end }) => {
    const { startTime, endTime, text } = readAndParseSRT(video, start, end);
    ffmpegMakeClip(video, startTime, endTime, text);
  });

program.command("deleteTables").action(() => {
  dropVideoTable();
});

program.command("createTables").action(() => {
  createVideoTable();
});

program.parse(process.argv);

function readAndParseSRT(
  video: any,
  start: any,
  end: any
): { startTime: any; endTime: any; text: any } {
  throw new Error("Function not implemented.");
}
