# Audio Filters Usage

This document explains how to use various audio filters to process audio data. Each filter is implemented as a class that conforms to a common interface, allowing for easy interchangeability.

## Filters Overview

### High-Pass Filter

A high-pass filter attenuates frequencies below a specified cutoff frequency, allowing higher frequencies to pass through.

### Low-Pass Filter

A low-pass filter attenuates frequencies above a specified cutoff frequency, allowing lower frequencies to pass through.

### Band-Pass Filter

A band-pass filter allows frequencies within a specified range to pass through while attenuating frequencies outside that range.

### Band-Stop Filter

A band-stop filter attenuates frequencies within a specified range while allowing frequencies outside that range to pass through. Also known as a notch filter.

### Peaking Filter

A peaking filter boosts or attenuates frequencies within a specified range. Commonly used in equalizers.

### Shelving Filter

A shelving filter boosts or attenuates frequencies above (high shelf) or below (low shelf) a specified cutoff frequency.

### All-Pass Filter

An all-pass filter changes the phase of the signal without affecting its amplitude. Used for phase correction and effects.

## Usage

### Importing the Module

Import the required classes from the module.

```typescript
import { HighPassFilter, LowPassFilter, BandPassFilter, BandStopFilter, PeakingFilter, ShelvingFilter, AllPassFilter, FilterHandler } from './path/to/audioFilters';
import { AudioData, StereoAudioData } from './path/to/AudioDataInterfaces';
```

### Applying Filters to Mono Audio Data

Create an `AudioData` object and apply various filters.

```typescript
const monoAudio: AudioData = { audioData: [32767, 16383, 0, -16383, -32767] };
const sampleRate = 44100; // Sample rate in Hz

// High-Pass Filter
const highPassFilter = new HighPassFilter(100);
const filterHandler = new FilterHandler(highPassFilter);
const filteredMonoAudio = filterHandler.applyFilter(monoAudio, sampleRate);
console.log(filteredMonoAudio);

// Low-Pass Filter
filterHandler.setFilter(new LowPassFilter(1000));
const filteredMonoAudioLowPass = filterHandler.applyFilter(monoAudio, sampleRate);
console.log(filteredMonoAudioLowPass);

// Band-Pass Filter
filterHandler.setFilter(new BandPassFilter(100, 1000));
const filteredMonoAudioBandPass = filterHandler.applyFilter(monoAudio, sampleRate);
console.log(filteredMonoAudioBandPass);

// Band-Stop Filter
filterHandler.setFilter(new BandStopFilter(100, 1000));
const filteredMonoAudioBandStop = filterHandler.applyFilter(monoAudio, sampleRate);
console.log(filteredMonoAudioBandStop);

// Peaking Filter
filterHandler.setFilter(new PeakingFilter(500, 6, 100));
const filteredMonoAudioPeaking = filterHandler.applyFilter(monoAudio, sampleRate);
console.log(filteredMonoAudioPeaking);

// Shelving Filter
filterHandler.setFilter(new ShelvingFilter(500, 6, 'high'));
const filteredMonoAudioShelving = filterHandler.applyFilter(monoAudio, sampleRate);
console.log(filteredMonoAudioShelving);

// All-Pass Filter
filterHandler.setFilter(new AllPassFilter(Math.PI / 4));
const filteredMonoAudioAllPass = filterHandler.applyFilter(monoAudio, sampleRate);
console.log(filteredMonoAudioAllPass);
```

### Applying Filters to Stereo Audio Data

Create a `StereoAudioData` object and apply various filters.

```typescript
const stereoAudio: StereoAudioData = { 
  audioData: [], 
  audioDataLeft: [32767, 16383, 0, -16383, -32767], 
  audioDataRight: [-32767, -16383, 0, 16383, 32767] 
};
const sampleRate = 44100; // Sample rate in Hz

// High-Pass Filter
const highPassFilter = new HighPassFilter(100);
const filterHandler = new FilterHandler(highPassFilter);
const filteredStereoAudio = filterHandler.applyFilter(stereoAudio, sampleRate);
console.log(filteredStereoAudio);

// Low-Pass Filter
filterHandler.setFilter(new LowPassFilter(1000));
const filteredStereoAudioLowPass = filterHandler.applyFilter(stereoAudio, sampleRate);
console.log(filteredStereoAudioLowPass);

// Band-Pass Filter
filterHandler.setFilter(new BandPassFilter(100, 1000));
const filteredStereoAudioBandPass = filterHandler.applyFilter(stereoAudio, sampleRate);
console.log(filteredStereoAudioBandPass);

// Band-Stop Filter
filterHandler.setFilter(new BandStopFilter(100, 1000));
const filteredStereoAudioBandStop = filterHandler.applyFilter(stereoAudio, sampleRate);
console.log(filteredStereoAudioBandStop);

// Peaking Filter
filterHandler.setFilter(new PeakingFilter(500, 6, 100));
const filteredStereoAudioPeaking = filterHandler.applyFilter(stereoAudio, sampleRate);
console.log(filteredStereoAudioPeaking);

// Shelving Filter
filterHandler.setFilter(new ShelvingFilter(500, 6, 'high'));
const filteredStereoAudioShelving = filterHandler.applyFilter(stereoAudio, sampleRate);
console.log(filteredStereoAudioShelving);

// All-Pass Filter
filterHandler.setFilter(new AllPassFilter(Math.PI / 4));
const filteredStereoAudioAllPass = filterHandler.applyFilter(stereoAudio, sampleRate);
console.log(filteredStereoAudioAllPass);
```

## Summary

This document explained how to use various audio filters to process both mono and stereo audio data. By specifying the desired filter and its parameters, you can customize the audio processing to suit your needs.
