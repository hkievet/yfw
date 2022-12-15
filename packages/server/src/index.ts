import express from "express";
import fs from "node:fs";
import path from "node:path";
import cors from "cors";
import { startFullProcess, trimVideo } from "@yfw/core/core";
import { getSRTFromVideo } from "@yfw/core/core/get-srt-from-video";
import { joinClips } from "@yfw/core/core/ffmpeg-join-clips";
import { aggregateVideosPath } from "@yfw/core/core/constants";

const app = express();
const PORT = 3333;

const pathToProcessDir = path.join(__dirname, "..", "..", "..", "process");

const downloadedVideosPath = pathToProcessDir + "/videos";
const generatedTranscriptsPath = pathToProcessDir + "/output";
const trimmedVideosPath = pathToProcessDir + "/trimmed";

app.use(cors());
app.use(express.json());

/**
 * returns a list of videos that are completed and available for trimming
 */
async function getAvailableVideos() {
  return fs.promises.readdir(downloadedVideosPath);
}

async function getAvailableTranscriptFileNames() {
  const files = fs.promises.readdir(generatedTranscriptsPath);
  const srtFiles = (await files).filter((fileName) => {
    return path.extname(fileName) == ".srt";
  });
  return srtFiles;
}

async function getTrimmedVideos() {
  const files = fs.promises.readdir(trimmedVideosPath);
  return files;
}

app.get("/transcripts/:id", async (req, res) => {
  try {
    let segments = await getSRTFromVideo(req.params.id);
    res.send(segments);
  } catch {
    res.sendStatus(404);
  }
});

app.get("/trimmed", async (req, res) => {
  let trimmedVideoFiles = await getTrimmedVideos();
  res.send(trimmedVideoFiles);
});

app.get("/transcripts", async (req, res) => {
  let transcriptFiles = await getAvailableTranscriptFileNames();
  res.send(transcriptFiles);
});

app.get("/videos", async (req, res) => {
  let videos = await getAvailableVideos();
  res.send(videos);
});

app.get("/", async (req, res) => {
  res.send({ hello: "world" });
});

app.post("/start", async (req, res) => {
  try {
    if (req.body.url) {
      console.log(req.body.url);
      await startFullProcess(req.body.url);
    }
    res.send({ success: "true" });
  } catch (e) {
    res.status(500);
    res.send();
  }
});

app.post("/trimVideo", async (req, res) => {
  const { url, start, end } = req.body;
  console.log("received request to trim ", url, "with", start, end);
  if (url && start && end && start <= end) {
    const fp = await trimVideo(url, start, end);
    if (fp) {
      res.send({ trimUrl: fp.split("/")[fp.split("/").length - 1] });
    }
  }
});

app.post("/joinClips", async (req, res) => {
  try {
    const { clips, name } = req.body;
    if (clips.length) {
      const fp = await joinClips(clips, name);
      if (fp) {
        const aggregateVideoId = fp.split("/")[fp.split("/").length - 1];
        res.send({ aggregateUrl: aggregateVideoId });
      }
    }
  } catch (e) {
    res.status(500);
    res.send();
  }
});

/**
 * Allow serving up of video files
 */

app.use(
  "/static/trimmed",
  // todo use __dirname etc.,
  express.static(trimmedVideosPath)
);
app.use(
  "/static/transcripts",
  // todo use __dirname etc.,
  express.static(generatedTranscriptsPath)
);
app.use(
  "/static/videos",
  // todo use __dirname etc.,
  express.static(downloadedVideosPath)
);
app.use(
  "/static/aggregate",
  // todo use __dirname etc.,
  express.static(aggregateVideosPath)
);

/**
 * Endpoint to start downloading a video via a url
 */

console.log("Server running on http://localhost:" + PORT);
console.log(path.join(__dirname, "..", "..", "..", "process"));
app.listen(PORT);
