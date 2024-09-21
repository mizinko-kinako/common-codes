# Hum Noise Removal Usage

This document explains how to use the `removeHumNoise` function to remove hum noise from audio data.

## Installation

First, install the necessary modules.

## Usage

### Importing the Module

Import the required functions and enums from the module.

```typescript
import { removeHumNoise, HumFrequency, NotchWidth } from './path/to/NoiseRemoval';
import { AudioData, StereoAudioData } from './path/to/AudioDataInterfaces';
```

### Removing Hum Noise from Mono Audio Data

Create an `AudioData` object and remove the hum noise.

```typescript
const monoAudio: AudioData = { audioData: [32767, 16383, 0, -16383, -32767] };
const sampleRate = 44100; // Sample rate in Hz

// Using predefined hum frequency and notch width
const cleanedMonoAudio = removeHumNoise(monoAudio, sampleRate, HumFrequency.FIFTY_HZ, NotchWidth.NARROW);
console.log(cleanedMonoAudio);

// Using custom hum frequency and notch width
const customHumFrequency = 55; // Custom frequency in Hz
const customNotchWidth = 1.5; // Custom notch width in Hz
const cleanedMonoAudioCustom = removeHumNoise(monoAudio, sampleRate, customHumFrequency, customNotchWidth);
console.log(cleanedMonoAudioCustom);
```

### Removing Hum Noise from Stereo Audio Data

Create a `StereoAudioData` object and remove the hum noise.

```typescript
const stereoAudio: StereoAudioData = { 
  audioData: [], 
  audioDataLeft: [32767, 16383, 0, -16383, -32767], 
  audioDataRight: [-32767, -16383, 0, 16383, 32767] 
};
const sampleRate = 44100; // Sample rate in Hz

// Using predefined hum frequency and notch width
const cleanedStereoAudio = removeHumNoise(stereoAudio, sampleRate, HumFrequency.SIXTY_HZ, NotchWidth.MEDIUM);
console.log(cleanedStereoAudio);

// Using custom hum frequency and notch width
const customHumFrequency = 55; // Custom frequency in Hz
const customNotchWidth = 1.5; // Custom notch width in Hz
const cleanedStereoAudioCustom = removeHumNoise(stereoAudio, sampleRate, customHumFrequency, customNotchWidth);
console.log(cleanedStereoAudioCustom);
```

### Full Example

Here is a full example of how to use the `removeHumNoise` function.

```typescript
import { removeHumNoise, HumFrequency, NotchWidth } from './path/to/NoiseRemoval';
import { AudioData, StereoAudioData } from './path/to/AudioDataInterfaces';

const monoAudio: AudioData = { audioData: [32767, 16383, 0, -16383, -32767] };
const stereoAudio: StereoAudioData = { 
  audioData: [], 
  audioDataLeft: [32767, 16383, 0, -16383, -32767], 
  audioDataRight: [-32767, -16383, 0, 16383, 32767] 
};
const sampleRate = 44100; // Sample rate in Hz

// Using predefined hum frequency and notch width
const cleanedMonoAudio = removeHumNoise(monoAudio, sampleRate, HumFrequency.FIFTY_HZ, NotchWidth.NARROW);
console.log(cleanedMonoAudio);

const cleanedStereoAudio = removeHumNoise(stereoAudio, sampleRate, HumFrequency.SIXTY_HZ, NotchWidth.MEDIUM);
console.log(cleanedStereoAudio);

// Using custom hum frequency and notch width
const customHumFrequency = 55; // Custom frequency in Hz
const customNotchWidth = 1.5; // Custom notch width in Hz
const cleanedMonoAudioCustom = removeHumNoise(monoAudio, sampleRate, customHumFrequency, customNotchWidth);
console.log(cleanedMonoAudioCustom);

const cleanedStereoAudioCustom = removeHumNoise(stereoAudio, sampleRate, customHumFrequency, customNotchWidth);
console.log(cleanedStereoAudioCustom);
```

## Summary

This document explained how to use the `removeHumNoise` function to remove hum noise from both mono and stereo audio data. By specifying the hum frequency and notch width, you can customize the noise removal process to suit your needs. Predefined values for common hum frequencies and notch widths are provided, and custom values can also be used.
