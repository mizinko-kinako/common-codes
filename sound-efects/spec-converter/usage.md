# Sample Rate Conversion and Bit Depth Conversion of Audio Data

This document explains how to convert the sample rate and bit depth of audio data.

## Sample Rate Conversion

To convert the sample rate of audio data, use the `convertSampleRate` function. The following interpolation methods are supported:

- `linear`: Linear interpolation
- `nearest`: Nearest neighbor interpolation
- `cubic`: Cubic spline interpolation

### Example Usage

```typescript
import { convertSampleRate } from './path/to/your/module';
import { AudioData, StereoAudioData } from './path/to/your/AudioDataInterfaces';

const monoAudio: AudioData = { audioData: [32767, 16383, 0, -16383, -32767] };
const stereoAudio: StereoAudioData = { audioData: [], audioDataLeft: [32767, 16383, 0, -16383, -32767], audioDataRight: [-32767, -16383, 0, 16383, 32767] };

const originalSampleRate = 44100;
const targetSampleRate = 48000;

const convertedMonoAudio = convertSampleRate(monoAudio, originalSampleRate, targetSampleRate, 'cubic');
const convertedStereoAudio = convertSampleRate(stereoAudio, originalSampleRate, targetSampleRate, 'cubic');

console.log(convertedMonoAudio);
console.log(convertedStereoAudio);
```

## Bit Depth Conversion

To convert the bit depth of audio data, use the `convertBitDepth` function.

### Example Usage

```typescript
import { convertBitDepth } from './path/to/your/module';
import { AudioData, StereoAudioData } from './path/to/your/AudioDataInterfaces';

const monoAudio: AudioData = { audioData: [32767, 16383, 0, -16383, -32767] };
const stereoAudio: StereoAudioData = { audioData: [], audioDataLeft: [32767, 16383, 0, -16383, -32767], audioDataRight: [-32767, -16383, 0, 16383, 32767] };

const originalBitDepth = 16;
const targetBitDepth = 8;

const convertedMonoAudio = convertBitDepth(monoAudio, originalBitDepth, targetBitDepth);
const convertedStereoAudio = convertBitDepth(stereoAudio, originalBitDepth, targetBitDepth);

console.log(convertedMonoAudio);
console.log(convertedStereoAudio);
```

## Summary

This document explained how to convert the sample rate and bit depth of audio data. By selecting the interpolation method, you can accommodate various use cases.
