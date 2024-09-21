import { AudioData, StereoAudioData } from '../AudioDataInterfaces';

export type InterpolationMethod = 'linear' | 'nearest' | 'cubic';

interface Interpolator {
  interpolate(data: number[], originalIndex: number, lowerIndex: number, upperIndex: number, weight: number): number;
}

class LinearInterpolator implements Interpolator {
  interpolate(data: number[], originalIndex: number, lowerIndex: number, upperIndex: number, weight: number): number {
    return (1 - weight) * data[lowerIndex] + weight * data[upperIndex];
  }
}

class NearestInterpolator implements Interpolator {
  interpolate(data: number[], originalIndex: number, lowerIndex: number, upperIndex: number, weight: number): number {
    return data[Math.round(originalIndex)];
  }
}

class CubicInterpolator implements Interpolator {
  interpolate(data: number[], originalIndex: number, lowerIndex: number, upperIndex: number, weight: number): number {
    const p0 = data[lowerIndex - 1] || data[lowerIndex];
    const p1 = data[lowerIndex];
    const p2 = data[upperIndex];
    const p3 = data[upperIndex + 1] || data[upperIndex];
    return this.cubicInterpolation(p0, p1, p2, p3, weight);
  }

  private cubicInterpolation(p0: number, p1: number, p2: number, p3: number, t: number): number {
    return (
      p1 +
      0.5 * t * (p2 - p0 + t * (2 * p0 - 5 * p1 + 4 * p2 - p3 + t * (3 * (p1 - p2) + p3 - p0)))
    );
  }
}

const interpolators: { [key in InterpolationMethod]: Interpolator } = {
  linear: new LinearInterpolator(),
  nearest: new NearestInterpolator(),
  cubic: new CubicInterpolator(),
};

export function convertSampleRate(audio: AudioData | StereoAudioData, originalSampleRate: number, targetSampleRate: number, method: InterpolationMethod = 'linear'): AudioData | StereoAudioData {
  const resample = (data: number[], originalSampleRate: number, targetSampleRate: number, interpolator: Interpolator): number[] => {
    const ratio = targetSampleRate / originalSampleRate;
    const newDataLength = Math.round(data.length * ratio);
    const newData = new Array(newDataLength);

    for (let i = 0; i < newDataLength; i++) {
      const originalIndex = i / ratio;
      const lowerIndex = Math.floor(originalIndex);
      const upperIndex = Math.ceil(originalIndex);
      const weight = originalIndex - lowerIndex;

      newData[i] = interpolator.interpolate(data, originalIndex, lowerIndex, upperIndex, weight);
    }

    return newData;
  };

  const interpolator = interpolators[method];

  if ('audioDataLeft' in audio && 'audioDataRight' in audio) {
    audio.audioDataLeft = resample(audio.audioDataLeft, originalSampleRate, targetSampleRate, interpolator);
    audio.audioDataRight = resample(audio.audioDataRight, originalSampleRate, targetSampleRate, interpolator);
  } else {
    audio.audioData = resample(audio.audioData, originalSampleRate, targetSampleRate, interpolator);
  }
  return audio;
}

export function convertBitDepth(audio: AudioData | StereoAudioData, originalBitDepth: number, targetBitDepth: number): AudioData | StereoAudioData {
  const convert = (data: number[], originalBitDepth: number, targetBitDepth: number): number[] => {
    const originalMaxValue = Math.pow(2, originalBitDepth - 1) - 1;
    const targetMaxValue = Math.pow(2, targetBitDepth - 1) - 1;

    return data.map(sample => {
      const normalizedSample = sample / originalMaxValue;
      return Math.round(normalizedSample * targetMaxValue);
    });
  };

  if ('audioDataLeft' in audio && 'audioDataRight' in audio) {
    audio.audioDataLeft = convert(audio.audioDataLeft, originalBitDepth, targetBitDepth);
    audio.audioDataRight = convert(audio.audioDataRight, originalBitDepth, targetBitDepth);
  } else {
    audio.audioData = convert(audio.audioData, originalBitDepth, targetBitDepth);
  }
  return audio;
}

const monoAudio: AudioData = { audioData: [32767, 16383, 0, -16383, -32767] };
const stereoAudio: StereoAudioData = { audioData: [], audioDataLeft: [32767, 16383, 0, -16383, -32767], audioDataRight: [-32767, -16383, 0, 16383, 32767] };

const originalSampleRate = 44100;
const targetSampleRate = 48000;
const originalBitDepth = 16;
const targetBitDepth = 8;

const convertedMonoAudioSampleRate = convertSampleRate(monoAudio, originalSampleRate, targetSampleRate, 'cubic');
const convertedStereoAudioSampleRate = convertSampleRate(stereoAudio, originalSampleRate, targetSampleRate, 'cubic');

const convertedMonoAudioBitDepth = convertBitDepth(monoAudio, originalBitDepth, targetBitDepth);
const convertedStereoAudioBitDepth = convertBitDepth(stereoAudio, originalBitDepth, targetBitDepth);

console.log(convertedMonoAudioSampleRate);
console.log(convertedStereoAudioSampleRate);
console.log(convertedMonoAudioBitDepth);
console.log(convertedStereoAudioBitDepth);