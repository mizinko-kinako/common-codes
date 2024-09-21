import { Complex } from '../Complex';
import { FFT } from '../FFT';
import { AudioData, StereoAudioData } from '../AudioDataInterfaces';

export enum NoiseReductionMethod {
  Amplitude,
  Power,
  Decibel,
  AbsoluteValue
}

interface NoiseFilter {
  setNext(filter: NoiseFilter): NoiseFilter;
  filter(freq: Complex): Complex;
}

abstract class AbstractNoiseFilter implements NoiseFilter {
  private nextFilter: NoiseFilter | null = null;

  public setNext(filter: NoiseFilter): NoiseFilter {
    this.nextFilter = filter;
    return filter;
  }

  public filter(freq: Complex): Complex {
    if (this.nextFilter) {
      return this.nextFilter.filter(freq);
    }
    return freq;
  }

  protected abstract shouldFilter(freq: Complex): boolean;

  protected abstract getFilteredValue(): Complex;

  protected applyFilter(freq: Complex): Complex {
    if (this.shouldFilter(freq)) {
      return this.getFilteredValue();
    }
    return freq;
  }
}

class AmplitudeFilter extends AbstractNoiseFilter {
  private threshold: number;

  constructor(threshold: number) {
    super();
    this.threshold = threshold;
  }

  protected shouldFilter(freq: Complex): boolean {
    const amplitude = Math.sqrt(freq.real * freq.real + freq.imag * freq.imag);
    return amplitude < this.threshold;
  }

  protected getFilteredValue(): Complex {
    return new Complex(0, 0);
  }

  public filter(freq: Complex): Complex {
    return this.applyFilter(freq);
  }
}

class PowerFilter extends AbstractNoiseFilter {
  private threshold: number;

  constructor(threshold: number) {
    super();
    this.threshold = threshold;
  }

  protected shouldFilter(freq: Complex): boolean {
    const power = freq.real * freq.real + freq.imag * freq.imag;
    return power < this.threshold;
  }

  protected getFilteredValue(): Complex {
    return new Complex(0, 0);
  }

  public filter(freq: Complex): Complex {
    return this.applyFilter(freq);
  }
}

class DecibelFilter extends AbstractNoiseFilter {
  private threshold: number;

  constructor(threshold: number) {
    super();
    this.threshold = threshold;
  }

  private amplitudeToDb(amplitude: number): number {
    return 20 * Math.log10(amplitude);
  }

  protected shouldFilter(freq: Complex): boolean {
    const amplitude = Math.sqrt(freq.real * freq.real + freq.imag * freq.imag);
    const db = this.amplitudeToDb(amplitude);
    return db < this.threshold;
  }

  protected getFilteredValue(): Complex {
    return new Complex(0, 0);
  }

  public filter(freq: Complex): Complex {
    return this.applyFilter(freq);
  }
}

class AbsoluteValueFilter extends AbstractNoiseFilter {
  private threshold: number;

  constructor(threshold: number) {
    super();
    this.threshold = threshold;
  }

  protected shouldFilter(freq: Complex): boolean {
    return Math.abs(freq.real) < this.threshold && Math.abs(freq.imag) < this.threshold;
  }

  protected getFilteredValue(): Complex {
    return new Complex(0, 0);
  }

  public filter(freq: Complex): Complex {
    return this.applyFilter(freq);
  }
}

interface NoiseReductionHandler {
  setNext(handler: NoiseReductionHandler): NoiseReductionHandler;
  handle(audioData: AudioData | StereoAudioData): AudioData | StereoAudioData;
}

abstract class AbstractNoiseReductionHandler implements NoiseReductionHandler {
  private nextHandler: NoiseReductionHandler | null = null;

  public setNext(handler: NoiseReductionHandler): NoiseReductionHandler {
    this.nextHandler = handler;
    return handler;
  }

  public handle(audioData: AudioData | StereoAudioData): AudioData | StereoAudioData {
    if (this.nextHandler) {
      return this.nextHandler.handle(audioData);
    }
    return audioData;
  }

  protected abstract process(audioData: AudioData | StereoAudioData): AudioData | StereoAudioData;
}

class MonoNoiseReductionHandler extends AbstractNoiseReductionHandler {
  private filterChain: NoiseFilter;

  constructor(filterChain: NoiseFilter) {
    super();
    this.filterChain = filterChain;
  }

  protected process(audioData: AudioData): AudioData {
    const complexData = audioData.audioData.map(value => new Complex(value, 0));
    const fft = new FFT(complexData);
    const frequencyData = fft.fft();

    // Apply noise reduction filter
    const filteredData = frequencyData.map(freq => this.filterChain.filter(freq));

    const ifft = new FFT(filteredData);
    const timeDomainData = ifft.ifft();

    return {
      audioData: timeDomainData.map(complex => complex.real)
    };
  }

  public handle(audioData: AudioData | StereoAudioData): AudioData | StereoAudioData {
    if ('audioDataLeft' in audioData && 'audioDataRight' in audioData) {
      return super.handle(audioData);
    }
    return this.process(audioData as AudioData);
  }
}

class StereoNoiseReductionHandler extends AbstractNoiseReductionHandler {
  private filterChain: NoiseFilter;

  constructor(filterChain: NoiseFilter) {
    super();
    this.filterChain = filterChain;
  }

  protected process(audioData: StereoAudioData): StereoAudioData {
    const leftChannel = new MonoNoiseReductionHandler(this.filterChain).handle({ audioData: audioData.audioDataLeft }) as AudioData;
    const rightChannel = new MonoNoiseReductionHandler(this.filterChain).handle({ audioData: audioData.audioDataRight }) as AudioData;

    return {
      audioData: audioData.audioData,
      audioDataLeft: leftChannel.audioData,
      audioDataRight: rightChannel.audioData
    };
  }

  public handle(audioData: AudioData | StereoAudioData): AudioData | StereoAudioData {
    if ('audioDataLeft' in audioData && 'audioDataRight' in audioData) {
      return this.process(audioData as StereoAudioData);
    }
    return super.handle(audioData);
  }
}

export class NoiseReduction {
  private handlerChain: NoiseReductionHandler;

  constructor(methodThresholdPairs: { method: NoiseReductionMethod, threshold: number }[]) {
    let filterChain: NoiseFilter | null = null;

    methodThresholdPairs.forEach(pair => {
      let filter: NoiseFilter;
      switch (pair.method) {
        case NoiseReductionMethod.Amplitude:
          filter = new AmplitudeFilter(pair.threshold);
          break;
        case NoiseReductionMethod.Power:
          filter = new PowerFilter(pair.threshold);
          break;
        case NoiseReductionMethod.Decibel:
          filter = new DecibelFilter(pair.threshold);
          break;
        case NoiseReductionMethod.AbsoluteValue:
          filter = new AbsoluteValueFilter(pair.threshold);
          break;
        default:
          throw new Error('Unsupported noise reduction method');
      }

      if (filterChain) {
        filterChain.setNext(filter);
      } else {
        filterChain = filter;
      }
    });

    if (!filterChain) {
      throw new Error('No filters provided');
    }

    const monoHandler = new MonoNoiseReductionHandler(filterChain);
    const stereoHandler = new StereoNoiseReductionHandler(filterChain);
    stereoHandler.setNext(monoHandler);

    this.handlerChain = stereoHandler;
  }

  reduceNoise(audioData: AudioData | StereoAudioData): AudioData | StereoAudioData {
    const startTime = performance.now(); // 計測開始

    const result = this.handlerChain.handle(audioData);

    const endTime = performance.now(); // 計測終了
    console.log(`Noise reduction took ${endTime - startTime} milliseconds.`);

    return result;
  }
}