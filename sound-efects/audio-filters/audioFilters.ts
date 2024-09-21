import { Complex } from '../Complex';
import { FFT } from '../FFT';
import { AudioData, StereoAudioData } from '../AudioDataInterfaces';

export interface AudioFilter {
  apply(data: number[], sampleRate: number): number[];
}

export class HighPassFilter implements AudioFilter {
  constructor(private cutoffFrequency: number) {}

  apply(data: number[], sampleRate: number): number[] {
    const complexData = data.map(value => new Complex(value, 0));
    const fftInstance = new FFT(complexData);
    const frequencyData = fftInstance.fft();

    const filteredFrequencyData = frequencyData.map((phasor, index) => {
      const frequencyHz = (index * sampleRate) / data.length;
      return frequencyHz < this.cutoffFrequency ? new Complex(0, 0) : phasor;
    });

    const ifftInstance = new FFT(filteredFrequencyData);
    const filteredDataComplex = ifftInstance.ifft();
    return filteredDataComplex.map(complex => complex.real);
  }
}

export class LowPassFilter implements AudioFilter {
  constructor(private cutoffFrequency: number) {}

  apply(data: number[], sampleRate: number): number[] {
    const complexData = data.map(value => new Complex(value, 0));
    const fftInstance = new FFT(complexData);
    const frequencyData = fftInstance.fft();

    const filteredFrequencyData = frequencyData.map((phasor, index) => {
      const frequencyHz = (index * sampleRate) / data.length;
      return frequencyHz > this.cutoffFrequency ? new Complex(0, 0) : phasor;
    });

    const ifftInstance = new FFT(filteredFrequencyData);
    const filteredDataComplex = ifftInstance.ifft();
    return filteredDataComplex.map(complex => complex.real);
  }
}

export class BandPassFilter implements AudioFilter {
  constructor(private lowCutoff: number, private highCutoff: number) {}

  apply(data: number[], sampleRate: number): number[] {
    const complexData = data.map(value => new Complex(value, 0));
    const fftInstance = new FFT(complexData);
    const frequencyData = fftInstance.fft();

    const filteredFrequencyData = frequencyData.map((phasor, index) => {
      const frequencyHz = (index * sampleRate) / data.length;
      return (frequencyHz < this.lowCutoff || frequencyHz > this.highCutoff) ? new Complex(0, 0) : phasor;
    });

    const ifftInstance = new FFT(filteredFrequencyData);
    const filteredDataComplex = ifftInstance.ifft();
    return filteredDataComplex.map(complex => complex.real);
  }
}

export class BandStopFilter implements AudioFilter {
  constructor(private lowCutoff: number, private highCutoff: number) {}

  apply(data: number[], sampleRate: number): number[] {
    const complexData = data.map(value => new Complex(value, 0));
    const fftInstance = new FFT(complexData);
    const frequencyData = fftInstance.fft();

    const filteredFrequencyData = frequencyData.map((phasor, index) => {
      const frequencyHz = (index * sampleRate) / data.length;
      return (frequencyHz >= this.lowCutoff && frequencyHz <= this.highCutoff) ? new Complex(0, 0) : phasor;
    });

    const ifftInstance = new FFT(filteredFrequencyData);
    const filteredDataComplex = ifftInstance.ifft();
    return filteredDataComplex.map(complex => complex.real);
  }
}

export class PeakingFilter implements AudioFilter {
  constructor(private centerFrequency: number, private gainDb: number, private bandwidth: number) {}

  apply(data: number[], sampleRate: number): number[] {
    const complexData = data.map(value => new Complex(value, 0));
    const fftInstance = new FFT(complexData);
    const frequencyData = fftInstance.fft();

    const gain = Math.pow(10, this.gainDb / 20);
    const filteredFrequencyData = frequencyData.map((phasor, index) => {
      const frequencyHz = (index * sampleRate) / data.length;
      const distance = Math.abs(frequencyHz - this.centerFrequency);
      const factor = distance <= this.bandwidth / 2 ? gain : 1;
      return new Complex(phasor.real * factor, phasor.imag * factor);
    });

    const ifftInstance = new FFT(filteredFrequencyData);
    const filteredDataComplex = ifftInstance.ifft();
    return filteredDataComplex.map(complex => complex.real);
  }
}

export class ShelvingFilter implements AudioFilter {
  constructor(private cutoffFrequency: number, private gainDb: number, private type: 'low' | 'high') {}

  apply(data: number[], sampleRate: number): number[] {
    const complexData = data.map(value => new Complex(value, 0));
    const fftInstance = new FFT(complexData);
    const frequencyData = fftInstance.fft();

    const gain = Math.pow(10, this.gainDb / 20);
    const filteredFrequencyData = frequencyData.map((phasor, index) => {
      const frequencyHz = (index * sampleRate) / data.length;
      const factor = (this.type === 'low' && frequencyHz <= this.cutoffFrequency) || (this.type === 'high' && frequencyHz >= this.cutoffFrequency) ? gain : 1;
      return new Complex(phasor.real * factor, phasor.imag * factor);
    });

    const ifftInstance = new FFT(filteredFrequencyData);
    const filteredDataComplex = ifftInstance.ifft();
    return filteredDataComplex.map(complex => complex.real);
  }
}

export class AllPassFilter implements AudioFilter {
  constructor(private phaseShift: number) {}

  apply(data: number[], sampleRate: number): number[] {
    const complexData = data.map(value => new Complex(value, 0));
    const fftInstance = new FFT(complexData);
    const frequencyData = fftInstance.fft();

    const filteredFrequencyData = frequencyData.map(phasor => {
      const magnitude = Math.sqrt(phasor.real * phasor.real + phasor.imag * phasor.imag);
      const phase = Math.atan2(phasor.imag, phasor.real) + this.phaseShift;
      return new Complex(magnitude * Math.cos(phase), magnitude * Math.sin(phase));
    });

    const ifftInstance = new FFT(filteredFrequencyData);
    const filteredDataComplex = ifftInstance.ifft();
    return filteredDataComplex.map(complex => complex.real);
  }
}

export class FilterHandler {
  private filter: AudioFilter;

  constructor(filter: AudioFilter) {
    this.filter = filter;
  }

  setFilter(filter: AudioFilter) {
    this.filter = filter;
  }

  applyFilter(audio: AudioData | StereoAudioData, sampleRate: number): AudioData | StereoAudioData {
    if ('audioDataLeft' in audio && 'audioDataRight' in audio) {
      audio.audioDataLeft = this.filter.apply(audio.audioDataLeft, sampleRate);
      audio.audioDataRight = this.filter.apply(audio.audioDataRight, sampleRate);
    } else {
      audio.audioData = this.filter.apply(audio.audioData, sampleRate);
    }
    return audio;
  }
}
