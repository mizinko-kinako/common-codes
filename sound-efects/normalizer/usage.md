# Amplitude Normalization Usage

This document explains how to use the `normalizeAmplitude` function to normalize the amplitude of audio data.

## Usage

### Importing the Module

Import the required functions from the module.

```typescript
import { normalizeAmplitude } from './path/to/normalizeAmplitude';
import { AudioData, StereoAudioData } from './path/to/AudioDataInterfaces';
```

### Normalizing Amplitude for Mono Audio Data

Create an `AudioData` object and normalize the amplitude.

```typescript
const monoAudio: AudioData = { audioData: [32767, 16383, 0, -16383, -32767] };
const sampleRate = 44100; // Sample rate in Hz
const targetDb = -3; // Target amplitude in dB

const normalizedMonoAudio = normalizeAmplitude(monoAudio, sampleRate, targetDb);
console.log(normalizedMonoAudio);
```

### Normalizing Amplitude for Stereo Audio Data

Create a `StereoAudioData` object and normalize the amplitude.

```typescript
const stereoAudio: StereoAudioData = { 
  audioData: [], 
  audioDataLeft: [32767, 16383, 0, -16383, -32767], 
  audioDataRight: [-32767, -16383, 0, 16383, 32767] 
};
const sampleRate = 44100; // Sample rate in Hz
const targetDb = -3; // Target amplitude in dB

const normalizedStereoAudio = normalizeAmplitude(stereoAudio, sampleRate, targetDb);
console.log(normalizedStereoAudio);
```

### Full Example

Here is a full example of how to use the `normalizeAmplitude` function.

```typescript
import { normalizeAmplitude } from './path/to/normalizeAmplitude';
import { AudioData, StereoAudioData } from './path/to/AudioDataInterfaces';

const monoAudio: AudioData = { audioData: [32767, 16383, 0, -16383, -32767] };
const stereoAudio: StereoAudioData = { 
  audioData: [], 
  audioDataLeft: [32767, 16383, 0, -16383, -32767], 
  audioDataRight: [-32767, -16383, 0, 16383, 32767] 
};
const sampleRate = 44100; // Sample rate in Hz
const targetDb = -3; // Target amplitude in dB

const normalizedMonoAudio = normalizeAmplitude(monoAudio, sampleRate, targetDb);
console.log(normalizedMonoAudio);

const normalizedStereoAudio = normalizeAmplitude(stereoAudio, sampleRate, targetDb);
console.log(normalizedStereoAudio);
```

## Summary

This document explained how to use the `normalizeAmplitude` function to normalize the amplitude of both mono and stereo audio data. By specifying the target amplitude in dB, you can customize the normalization process to suit your needs.
