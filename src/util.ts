import { read } from 'jimp';
import { existsSync, mkdirSync, readFileSync, unlinkSync } from 'fs';

interface sizeOpts {
  height: number,
  width: number
}

export interface ImageProcessingOptions {
  size: sizeOpts,
  quality: number,
  brightness: number,
  contrast: number,
  inverted: boolean,
}
export interface Results {
  ImageBuffer: Buffer,
  ImagePath: string,
}

export class ImageProcessor {
  public imagePath!: string;
  public options!: ImageProcessingOptions;

  constructor(imagePath: string, options: ImageProcessingOptions) {
    this.imagePath = imagePath
    this.options = options
  }

  async process() {
    const r = await read(this.imagePath);
    r.resize(this.options.size.width, this.options.size.height);
    r.quality(this.options.quality);
    r.contrast(this.options.contrast);
    r.brightness(this.options.brightness);
    if (this.options.inverted) {
      r.invert();
    }
    if (existsSync('../images')) {
      r.write('../images/output.jpg');
    } else {
      mkdirSync('../images');
      r.write('../images/output.jpg');
    }

    return {
      ImagePath: '../images/output.jpg',
      ImageBuffer: readFileSync('../images/output.jpg')
    }
    
  }
  deleteProcessedImage() : void {
    unlinkSync('../images/output.jpg');
  }
}