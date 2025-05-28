const express = require("express");
const ytdl = require("ytdl-core");
const cors = require("cors");
const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("✅ YouTube to MP3 API is working");
});

app.get("/download", async (req, res) => {
  const videoURL = req.query.url;
  if (!videoURL || !ytdl.validateURL(videoURL)) {
    return res.status(400).json({ error: "Invalid YouTube URL" });
  }

  const info = await ytdl.getInfo(videoURL);
  const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');

  res.header("Content-Disposition", `attachment; filename="${title}.mp3"`);

  ytdl(videoURL, {
    format: "mp3",
    filter: "audioonly",
    quality: "highestaudio",
  }).pipe(res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
