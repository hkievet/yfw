#!/usr/bin/env ts-node
console.log("bom")
const command = require("commander");
const program = new command.Command();
const coreFunctions = require("./core")

program
  .command("start")
  .option("--url <youtubeUrl>", "The youtube url to donwload")
  .action(async function ({ url }) {
    await coreFunctions.startFullProcess(url)
    // // downloadYoutubeVideo(url)
    // const title = await getYoutubeVideoTitle(url);
    // const fp = await downloadYoutubeVideo(url, title);
    // const finished = await runWhisperOnFile(fp);
  });

program
  .command("strip")
  .option("--v <value>", "The value to strip")
  .action(({ v }) => {
    console.log(coreFunctions.stripSymbolsAndSpaces(v));
  });

program
  .command("startWhisper")
  .option(
    "--file <filepath>",
    "path to the file you want to convert to whisper"
  )
  .action(async ({ file }) => {
    console.log(file);
    await coreFunctions.runWhisperOnFile(file);
  });

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
