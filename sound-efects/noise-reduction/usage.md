# Noise Reduction Module

This document explains how to use the `NoiseReduction` class to reduce noise in audio data.

## Usage

### Importing the Module

Import the required classes and enums from the module.

```typescript
import { NoiseReduction, NoiseReductionMethod } from './path/to/NoiseReduction';
import { AudioData, StereoAudioData } from './path/to/AudioDataInterfaces';
```

### Creating Noise Reduction Filters

Create an array of method-threshold pairs to define the noise reduction filters.

```typescript
const methodThresholdPairs = [
  { method: NoiseReductionMethod.Amplitude, threshold: 0.1 },
  { method: NoiseReductionMethod.Power, threshold: 0.01 },
  { method: NoiseReductionMethod.Decibel, threshold: -40 },
  { method: NoiseReductionMethod.AbsoluteValue, threshold: 0.05 }
];
```

### Initializing the Noise Reduction

Initialize the `NoiseReduction` class with the method-threshold pairs.

```typescript
const noiseReduction = new NoiseReduction(methodThresholdPairs);
```

### Reducing Noise in Audio Data

#### Mono Audio Data

Create an `AudioData` object and reduce noise.

```typescript
const monoAudio: AudioData = { audioData: [32767, 16383, 0, -16383, -32767] };
const reducedMonoAudio = noiseReduction.reduceNoise(monoAudio);
console.log(reducedMonoAudio);
```

#### Stereo Audio Data

Create a `StereoAudioData` object and reduce noise.

```typescript
const stereoAudio: StereoAudioData = { 
  audioData: [], 
  audioDataLeft: [32767, 16383, 0, -16383, -32767], 
  audioDataRight: [-32767, -16383, 0, 16383, 32767] 
};
const reducedStereoAudio = noiseReduction.reduceNoise(stereoAudio);
console.log(reducedStereoAudio);
```

### Full Example

Here is a full example of how to use the `NoiseReduction` class.

```typescript
import { NoiseReduction, NoiseReductionMethod } from './path/to/NoiseReduction';
import { AudioData, StereoAudioData } from './path/to/AudioDataInterfaces';

const methodThresholdPairs = [
  { method: NoiseReductionMethod.Amplitude, threshold: 0.1 },
  { method: NoiseReductionMethod.Power, threshold: 0.01 },
  { method: NoiseReductionMethod.Decibel, threshold: -40 },
  { method: NoiseReductionMethod.AbsoluteValue, threshold: 0.05 }
];

const noiseReduction = new NoiseReduction(methodThresholdPairs);

const monoAudio: AudioData = { audioData: [32767, 16383, 0, -16383, -32767] };
const reducedMonoAudio = noiseReduction.reduceNoise(monoAudio);
console.log(reducedMonoAudio);

const stereoAudio: StereoAudioData = { 
  audioData: [], 
  audioDataLeft: [32767, 16383, 0, -16383, -32767], 
  audioDataRight: [-32767, -16383, 0, 16383, 32767] 
};
const reducedStereoAudio = noiseReduction.reduceNoise(stereoAudio);
console.log(reducedStereoAudio);
```

## Summary

This document explained how to use the `NoiseReduction` class to reduce noise in both mono and stereo audio data. By defining method-threshold pairs, you can customize the noise reduction process to suit your needs.

