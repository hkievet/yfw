import express from "express";
import fs from "node:fs";
import path from "node:path";

const app = express();
const PORT = 3333;

const downloadedVideosPath = "process/videos";
const generatedTranscriptsPath = "process/output";
const trimmedVideosPath = "process/trimmed";

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

/**
 * Allow serving up of video files
 */

app.use(
  "/static/trimmed",
  // todo use __dirname etc.,
  express.static(path.join(trimmedVideosPath))
);
app.use(
  "/static/transcripts",
  // todo use __dirname etc.,
  express.static(path.join(generatedTranscriptsPath))
);
app.use(
  "/static/videos",
  // todo use __dirname etc.,
  express.static(path.join(downloadedVideosPath))
);

/**
 * Endpoint to start downloading a video via a url
 */
app.post("/start", async (req, res) => {
  res.send({ hello: "world" });
});

app.listen(PORT);

app.get("/", async (req, res) => {
  res.send({ hello: "world" });
});
