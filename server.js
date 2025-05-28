const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');

const app = express();
app.use(cors());

app.get("/download", async (req, res) => {
  const videoURL = req.query.url;

  try {
    if (!ytdl.validateURL(videoURL)) {
      return res.status(400).send("Invalid YouTube URL");
    }

    const info = await ytdl.getInfo(videoURL);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');

    res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);
    ytdl(videoURL, {
      filter: 'audioonly',
      quality: 'highestaudio'
    }).pipe(res).on("error", (err) => {
      console.error("Streaming Error:", err);
      res.status(500).send("Stream Error");
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Server Error");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
