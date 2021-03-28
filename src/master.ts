import express from 'express';
import { createWriteStream, unlinkSync } from 'fs';
import { ImageProcessor } from './util';

const app: express.Application = express();

app.get('/process', (req, res) => {
  if (req.query.height && req.query.width && req.query.brightness && req.query.contrast && req.query.quality && req.query.inverted && req.query.buffer) {
    const writer = createWriteStream('./temp.jpg');
    writer.write(req.query.Buffer);
    writer.close();
    const process = new ImageProcessor('./temp.jpg', {
      size: { height: req.query.height as unknown as number ?? 300, width: req.query.width as unknown as number ?? 300 },
      brightness: req.query.brightness as unknown as number ?? 50,
      contrast: req.query.contrast as unknown as number ?? 50,
      quality: req.query.quality as unknown as number ?? 50,
      inverted: req.query.inverted as unknown as boolean ?? false,
    })
    process.process().then(r => {
      res.json({ buffer: r.ImageBuffer });
    })
    process.deleteProcessedImage();
    unlinkSync('./temp.jpg')
  } else {
    res.send('Cannot find arguments!')
  }
})

app.listen(80);