const express = require('express');
const ytdl = require('ytdl-core');

const app = express();
const port = process.env.PORT || 3000;

app.get('/download', async (req, res) => {
  const videoURL = req.query.url;
  if (!videoURL) return res.status(400).send('URL parameter missing');

  try {
    res.header('Content-Disposition', 'attachment; filename="audio.mp3"');
    ytdl(videoURL, {
      filter: 'audioonly',
      quality: 'highestaudio'
    }).pipe(res);
  } catch (error) {
    res.status(500).send('Error processing video');
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
