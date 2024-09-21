import { Complex } from '../Complex';
import { FFT } from '../FFT';
import { AudioData, StereoAudioData } from '../AudioDataInterfaces';

export interface EqualizerSettings {
  [frequencyHz: number]: number; 
}

export function adjustEqualizer(audio: AudioData | StereoAudioData, settings: EqualizerSettings, sampleRate: number): AudioData | StereoAudioData {
  const applyEqualizer = (data: number[], settings: EqualizerSettings, sampleRate: number): number[] => {
    const complexData = data.map(value => new Complex(value, 0));
    const fftInstance = new FFT(complexData);
    const frequencyData = fftInstance.fft();

    const adjustedFrequencyData = frequencyData.map((phasor, index) => {
      const frequencyHz = (index * sampleRate) / data.length;
      let gain = 1;
      for (const [freqHz, settingGain] of Object.entries(settings)) {
        if (frequencyHz <= parseFloat(freqHz)) {
          gain = settingGain;
          break;
        }
      }
      return new Complex(phasor.real * gain, phasor.imag * gain);
    });

    const ifftInstance = new FFT(adjustedFrequencyData);
    const adjustedDataComplex = ifftInstance.ifft();
    return adjustedDataComplex.map(complex => complex.real);
  };

  if ('audioDataLeft' in audio && 'audioDataRight' in audio) {
    audio.audioDataLeft = applyEqualizer(audio.audioDataLeft, settings, sampleRate);
    audio.audioDataRight = applyEqualizer(audio.audioDataRight, settings, sampleRate);
  } else {
    audio.audioData = applyEqualizer(audio.audioData, settings, sampleRate);
  }
  return audio;
}