import { Complex } from '../Complex';
import { FFT } from '../FFT';
import { AudioData, StereoAudioData } from '../AudioDataInterfaces';

function dbToAmplitude(db: number): number {
  return Math.pow(10, db / 20);
}

export function normalizeAmplitude(audio: AudioData | StereoAudioData, sampleRate: number, targetDb: number): AudioData | StereoAudioData {
  const targetAmplitude = dbToAmplitude(targetDb);

  const applyNormalization = (data: number[], sampleRate: number, targetAmplitude: number): number[] => {
    const complexData = data.map(value => new Complex(value, 0));
    const fftInstance = new FFT(complexData);
    const frequencyData = fftInstance.fft();

    let maxAmplitude = 0;
    frequencyData.forEach(phasor => {
      const amplitude = Math.sqrt(phasor.real * phasor.real + phasor.imag * phasor.imag);
      if (amplitude > maxAmplitude) {
        maxAmplitude = amplitude;
      }
    });

    const normalizationFactor = targetAmplitude / maxAmplitude;
    const normalizedFrequencyData = frequencyData.map(phasor => {
      return new Complex(phasor.real * normalizationFactor, phasor.imag * normalizationFactor);
    });

    const ifftInstance = new FFT(normalizedFrequencyData);
    const normalizedDataComplex = ifftInstance.ifft();
    return normalizedDataComplex.map(complex => complex.real);
  };

  if ('audioDataLeft' in audio && 'audioDataRight' in audio) {
    audio.audioDataLeft = applyNormalization(audio.audioDataLeft, sampleRate, targetAmplitude);
    audio.audioDataRight = applyNormalization(audio.audioDataRight, sampleRate, targetAmplitude);
  } else {
    audio.audioData = applyNormalization(audio.audioData, sampleRate, targetAmplitude);
  }
  return audio;
}
