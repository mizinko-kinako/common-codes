import { Complex } from './Complex';

export class FFT {
  private N: number;
  private levels: number;
  private input: Complex[];
  private output: Complex[];

  constructor(input: Complex[]) {
    this.input = input;
    this.N = input.length;
    this.levels = Math.log2(this.N);
    this.output = input.slice();
  }

  fft(): Complex[] {
    if (this.N <= 1) return this.input;

    for (let i = 0; i < this.N; i++) {
      let j = 0;
      for (let bit = 0; bit < this.levels; bit++) {
        j = (j << 1) | ((i >> bit) & 1);
      }
      if (i < j) {
        [this.output[i], this.output[j]] = [this.output[j], this.output[i]];
      }
    }

    for (let size = 2; size <= this.N; size *= 2) {
      const halfSize = size / 2;
      const tableStep = this.N / size;
      for (let i = 0; i < this.N; i += size) {
        for (let j = 0; j < halfSize; j++) {
          const k = j * tableStep;
          const exp = new Complex(
            Math.cos((-2 * Math.PI * k) / this.N),
            Math.sin((-2 * Math.PI * k) / this.N)
          );
          const t = exp.mul(this.output[i + j + halfSize]);
          this.output[i + j + halfSize] = this.output[i + j].sub(t);
          this.output[i + j] = this.output[i + j].add(t);
        }
      }
    }

    return this.output;
  }

  ifft(): Complex[] {
    const conjugated = this.input.map(c => new Complex(c.real, -c.imag));
    const fftInstance = new FFT(conjugated);
    const transformed = fftInstance.fft();
    return transformed.map(c => new Complex(c.real / this.N, -c.imag / this.N));
  }
}
