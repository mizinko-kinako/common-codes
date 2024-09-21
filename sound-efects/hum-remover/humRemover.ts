import { Complex } from '../Complex';
import { FFT } from '../FFT';
import { AudioData, StereoAudioData } from '../AudioDataInterfaces';

export enum HumFrequency {
  FIFTY_HZ = 50,
  SIXTY_HZ = 60,
  HUNDRED_HZ = 100,
  CUSTOM = -1 
}

export enum NotchWidth {
  NARROW = 1,
  MEDIUM = 2,
  WIDE = 5,
  CUSTOM = -1 
}

export function removeHumNoise(
  audio: AudioData | StereoAudioData,
  sampleRate: number,
  humFrequency: HumFrequency | number = HumFrequency.FIFTY_HZ,
  notchWidth: NotchWidth | number = NotchWidth.NARROW
): AudioData | StereoAudioData {
  const applyNotchFilter = (data: number[], sampleRate: number, humFrequency: number, notchWidth: number): number[] => {
    try {
      const complexData = data.map(value => new Complex(value, 0));
      const fftInstance = new FFT(complexData);
      const frequencyData = fftInstance.fft();

      const filteredFrequencyData = frequencyData.map((phasor, index) => {
        const frequencyHz = (index * sampleRate) / data.length;
        const isHarmonic = (frequencyHz % humFrequency) < notchWidth || (humFrequency - (frequencyHz % humFrequency)) < notchWidth;
        return isHarmonic ? new Complex(0, 0) : phasor;
      });

      const ifftInstance = new FFT(filteredFrequencyData);
      const filteredDataComplex = ifftInstance.ifft();
      return filteredDataComplex.map(complex => complex.real);
    } catch (error) {
      console.error('Error applying notch filter:', error);
      throw new Error('Failed to apply notch filter');
    }
  };

  try {
    const actualHumFrequency = humFrequency === HumFrequency.CUSTOM ? (humFrequency as number) : humFrequency;
    const actualNotchWidth = notchWidth === NotchWidth.CUSTOM ? (notchWidth as number) : notchWidth;

    if ('audioDataLeft' in audio && 'audioDataRight' in audio) {
      audio.audioDataLeft = applyNotchFilter(audio.audioDataLeft, sampleRate, actualHumFrequency, actualNotchWidth);
      audio.audioDataRight = applyNotchFilter(audio.audioDataRight, sampleRate, actualHumFrequency, actualNotchWidth);
    } else if ('audioData' in audio) {
      audio.audioData = applyNotchFilter(audio.audioData, sampleRate, actualHumFrequency, actualNotchWidth);
    } else {
      throw new Error('Invalid audio data format');
    }
    return audio;
  } catch (error) {
    console.error('Error removing hum noise:', error);
    throw new Error('Failed to remove hum noise');
  }
}