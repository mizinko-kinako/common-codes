# Equalizer Usage

This document explains how to use the `adjustEqualizer` function to apply equalizer settings to audio data.

## Usage

### Importing the Module

Import the required functions and interfaces from the module.

```typescript
import { adjustEqualizer, EqualizerSettings } from './path/to/Equalizer';
import { AudioData, StereoAudioData } from './path/to/AudioDataInterfaces';
```

### Creating Equalizer Settings

Create an `EqualizerSettings` object to define the gain for different frequency bands.

```typescript
const equalizerSettings: EqualizerSettings = {
  100: 1.5,  // 100Hz
  300: 1.2,  // 300Hz
  500: 1.0,  // 500Hz
  700: 0.8,  // 700Hz
  1000: 0.5  // 1000Hz
};
```

### Adjusting Equalizer for Mono Audio Data

Create an `AudioData` object and apply the equalizer settings.

```typescript
const monoAudio: AudioData = { audioData: [32767, 16383, 0, -16383, -32767] };
const sampleRate = 44100; // Sample rate in Hz

const adjustedMonoAudio = adjustEqualizer(monoAudio, equalizerSettings, sampleRate);
console.log(adjustedMonoAudio);
```

### Adjusting Equalizer for Stereo Audio Data

Create a `StereoAudioData` object and apply the equalizer settings.

```typescript
const stereoAudio: StereoAudioData = { 
  audioData: [], 
  audioDataLeft: [32767, 16383, 0, -16383, -32767], 
  audioDataRight: [-32767, -16383, 0, 16383, 32767] 
};
const sampleRate = 44100; // Sample rate in Hz

const adjustedStereoAudio = adjustEqualizer(stereoAudio, equalizerSettings, sampleRate);
console.log(adjustedStereoAudio);
```

### Full Example

Here is a full example of how to use the function.

```typescript
import { adjustEqualizer, EqualizerSettings } from './path/to/Equalizer';
import { AudioData, StereoAudioData } from './path/to/AudioDataInterfaces';

const equalizerSettings: EqualizerSettings = {
  100: 1.5,  // 100Hz
  300: 1.2,  // 300Hz
  500: 1.0,  // 500Hz
  700: 0.8,  // 700Hz
  1000: 0.5  // 1000Hz
};

const monoAudio: AudioData = { audioData: [32767, 16383, 0, -16383, -32767] };
const stereoAudio: StereoAudioData = { 
  audioData: [], 
  audioDataLeft: [32767, 16383, 0, -16383, -32767], 
  audioDataRight: [-32767, -16383, 0, 16383, 32767] 
};
const sampleRate = 44100; // Sample rate in Hz

const adjustedMonoAudio = adjustEqualizer(monoAudio, equalizerSettings, sampleRate);
console.log(adjustedMonoAudio);

const adjustedStereoAudio = adjustEqualizer(stereoAudio, equalizerSettings, sampleRate);
console.log(adjustedStereoAudio);
```

## Summary

This document explained how to use the `adjustEqualizer` function to apply equalizer settings to both mono and stereo audio data. By defining gain values for different frequency bands, you can customize the audio output to suit your needs.
