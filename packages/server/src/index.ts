import express from "express";
import fs from "node:fs";
import path from "node:path";
import cors from "cors";
import { readSRT, startFullProcess } from "@yfw/core/core";

const app = express();
const PORT = 3333;

const pathToProcessDir = path.join(__dirname, "..", "..","..", "process")

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
  console.log("boom")
  let segments = await readSRT(req.params.id);
  res.send(segments);
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
  if (req.body.url) {
    console.log(req.body.url);
    await startFullProcess(req.body.url);
  }
  res.send({ success: "true" });
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

console.log("Server running on http://localhost:" + PORT)
console.log(path.join(__dirname, "..", "..","..", "process"))
app.listen(PORT);
