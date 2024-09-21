import { Complex } from '../Complex';
import { FFT } from '../FFT';
import { AudioData, StereoAudioData } from '../AudioDataInterfaces';

export function reduceNoise(audio: AudioData | StereoAudioData, sampleRate: number, thresholdDb: number): AudioData | StereoAudioData {
  const applyNoiseReduction = (data: number[], sampleRate: number, thresholdDb: number): number[] => {
    const complexData = data.map(value => new Complex(value, 0));
    const fftInstance = new FFT(complexData);
    const frequencyData = fftInstance.fft();

    const thresholdAmplitude = Math.pow(10, thresholdDb / 20);

    const reducedFrequencyData = frequencyData.map((phasor, index) => {
      const amplitude = Math.sqrt(phasor.real * phasor.real + phasor.imag * phasor.imag);
      if (amplitude < thresholdAmplitude) {
        const scale = amplitude / thresholdAmplitude;
        return new Complex(phasor.real * scale, phasor.imag * scale);
      }
      return phasor;
    });

    const ifftInstance = new FFT(reducedFrequencyData);
    const reducedDataComplex = ifftInstance.ifft();
    return reducedDataComplex.map(complex => complex.real);
  };

  if ('audioDataLeft' in audio && 'audioDataRight' in audio) {
    audio.audioDataLeft = applyNoiseReduction(audio.audioDataLeft, sampleRate, thresholdDb);
    audio.audioDataRight = applyNoiseReduction(audio.audioDataRight, sampleRate, thresholdDb);
  } else {
    audio.audioData = applyNoiseReduction(audio.audioData, sampleRate, thresholdDb);
  }
  return audio;
}
