import * as fs from 'fs';
import { AudioData, StereoAudioData } from './AudioDataInterfaces';

class WavFile {
  private filePath: string | null;
  private blob: Blob | null;
  private header: any;
  private audioDataLeft: number[];
  private audioDataRight: number[];
  private audioData: number[];

  constructor(filePath: string | null = null, blob: Blob | null = null) {
    this.filePath = filePath;
    this.blob = blob;
    this.header = {};
    this.audioDataLeft = [];
    this.audioDataRight = [];
    this.audioData = [];
    this.readWavFile();
  }

  private async readWavFile() {
    let buffer: Buffer;
    if (this.filePath) {
      buffer = fs.readFileSync(this.filePath);
    } else if (this.blob) {
      buffer = await this.blobToBuffer(this.blob);
    } else {
      throw new Error('Either filePath or blob must be provided');
    }
    this.parseHeader(buffer);
    this.parseAudioData(buffer);
  }

  private blobToBuffer(blob: Blob): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        resolve(Buffer.from(arrayBuffer));
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
  }

  private parseHeader(buffer: Buffer) {
    this.header.chunkId = buffer.toString('ascii', 0, 4);
    this.header.chunkSize = buffer.readUInt32LE(4);
    this.header.format = buffer.toString('ascii', 8, 12);
    this.header.subchunk1Id = buffer.toString('ascii', 12, 16);
    this.header.subchunk1Size = buffer.readUInt32LE(16);
    this.header.audioFormat = buffer.readUInt16LE(20);
    this.header.numChannels = buffer.readUInt16LE(22);
    this.header.sampleRate = buffer.readUInt32LE(24);
    this.header.byteRate = buffer.readUInt32LE(28);
    this.header.blockAlign = buffer.readUInt16LE(32);
    this.header.bitsPerSample = buffer.readUInt16LE(34);
    this.header.subchunk2Id = buffer.toString('ascii', 36, 40);
    this.header.subchunk2Size = buffer.readUInt32LE(40);
  }

  private parseAudioData(buffer: Buffer) {
    const dataStart = 44;
    const dataSize = this.header.subchunk2Size;
    const bytesPerSample = this.header.bitsPerSample / 8;
    const numSamples = dataSize / bytesPerSample;
    const numChannels = this.header.numChannels;

    if (numChannels === 1) {
      this.audioData = new Array(numSamples);
      for (let i = 0; i < numSamples; i++) {
        const sampleStart = dataStart + i * bytesPerSample;
        if (bytesPerSample === 1) {
          this.audioData[i] = buffer.readInt8(sampleStart);
        } else if (bytesPerSample === 2) {
          this.audioData[i] = buffer.readInt16LE(sampleStart);
        } else if (bytesPerSample === 4) {
          this.audioData[i] = buffer.readInt32LE(sampleStart);
        } else {
          throw new Error(`Unsupported bit depth: ${this.header.bitsPerSample}`);
        }
      }
    } else if (numChannels === 2) {
      const numStereoSamples = numSamples / 2;
      this.audioDataLeft = new Array(numStereoSamples);
      this.audioDataRight = new Array(numStereoSamples);
      for (let i = 0; i < numStereoSamples; i++) {
        const sampleStart = dataStart + i * 2 * bytesPerSample;
        if (bytesPerSample === 1) {
          this.audioDataLeft[i] = buffer.readInt8(sampleStart);
          this.audioDataRight[i] = buffer.readInt8(sampleStart + bytesPerSample);
        } else if (bytesPerSample === 2) {
          this.audioDataLeft[i] = buffer.readInt16LE(sampleStart);
          this.audioDataRight[i] = buffer.readInt16LE(sampleStart + bytesPerSample);
        } else if (bytesPerSample === 4) {
          this.audioDataLeft[i] = buffer.readInt32LE(sampleStart);
          this.audioDataRight[i] = buffer.readInt32LE(sampleStart + bytesPerSample);
        } else {
          throw new Error(`Unsupported bit depth: ${this.header.bitsPerSample}`);
        }
      }
    } else {
      throw new Error(`Unsupported number of channels: ${numChannels}`);
    }
  }

  public getHeader() {
    return this.header;
  }

  public getAudioData(): AudioData | StereoAudioData {
    if (this.header.numChannels === 1) {
      return { audioData: this.audioData };
    } else if (this.header.numChannels === 2) {
      return { audioData: this.audioData, audioDataLeft: this.audioDataLeft, audioDataRight: this.audioDataRight };
    } else {
      throw new Error(`Unsupported number of channels: ${this.header.numChannels}`);
    }
  }
}