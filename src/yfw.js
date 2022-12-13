#!/usr/bin/env node
const command = require('commander');
const program = new command.Command();
const { spawn } = require('child_process');
const fs = require('node:fs');
const { request } = require('http');

function stripSymbolsAndSpaces(title) {
    var newTitle = title.replace(/[^\w\s]/gi, '').split(' ').join('')
    return newTitle
}

function getYoutubeVideoTitle(url, callBack) {
    const youtubeVideoTitle = spawn('youtube-dl', ["--get-title", url]);
    let videoTitle = ""

    youtubeVideoTitle.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        videoTitle = data
    });

    youtubeVideoTitle.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    youtubeVideoTitle.on('close', (code) => {
        console.log(`child process exited with code ${code}, title: ${videoTitle}`);
        if (videoTitle) {
            callBack(videoTitle.toString());
        }
    });
}



function downloadYoutubeVideo(url, title) {
    var newTitle = title.replace(/[^\w\s]/gi, '').split(' ').join('')
    const youtubeDl = spawn('youtube-dl', ["-f best[ext=mp4]", `-oprocess/videos/${newTitle}.mp4`, url]);


    youtubeDl.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    youtubeDl.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    youtubeDl.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}

function runWhisperOnFile(inputFile) {
    const args = [inputFile, "--model", "small", "--output_dir", "./process/output"]
    console.log(args.join(' '))
    const whisperProc = spawn('whisper', [inputFile, "--model", "small", "--output_dir", "./process/output"]);

    whisperProc.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    whisperProc.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    whisperProc.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}

function readAndParseSRT(videoName, start, end) {
    const srtFile = `process/output/${videoName}.mp4.srt`
    const file = fs.readFileSync(srtFile).toString();
    const lines = file.split("\n")
    const segments = []
    const regex = /^\d+$/;
    lines.forEach((line, i) => {
        if (regex.test(line)) {
            const time = lines[i + 1]
            const text = lines[i + 2]
            const [startTime, endTime] = time.split(' --> ')
            segments.push({ text, startTime, endTime })
        }
    })

    const requestedSegments = segments.slice(start - 1, end)
    const combinedText = requestedSegments.map(segment => segment.text).join(" ")
    console.log(combinedText);
}


program.command('start')
    .option('--url <youtubeUrl>', 'The youtube url to donwload')
    .action(function ({ url }) {
        // downloadYoutubeVideo(url)
        getYoutubeVideoTitle(url, (title) => { downloadYoutubeVideo(url, title) })
    });

program.command('strip')
    .option('--v <value>', 'The value to strip')
    .action(({ v }) => {
        console.log(stripSymbolsAndSpaces(v))
    });


program.command('startWhisper')
    .option('--file <filepath>', 'path to the file you want to convert to whisper')
    .action(({ file }) => {
        console.log(file)
        runWhisperOnFile(file)
    })

program.command('trimVideo')
    .option('--video <string>', 'Name of video you care about')
    .option('--start <number>', 'Start number in the srt')
    .option('--end <number>', 'End position in srt')
    .action(({ video, start, end }) => {
        const { start, end, text } = readAndParseSRT(video, start, end)
    })


program.parse(process.argv);