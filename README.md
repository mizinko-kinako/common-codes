# mizinko-kinako の汎用クラス
## WavReader クラス

`WavReader` クラスは、WAVファイルを読み込み、そのヘッダー情報と音声データを解析するためのクラスです。モノラルおよびステレオの音声データに対応しています。

### 特徴

- WAVファイルのヘッダー情報を解析
- モノラルおよびステレオの音声データを読み込み
- 音声データを `AudioData` および `StereoAudioData` インターフェースとして提供

### 使い方

`WavReader.ts` をプロジェクトに追加し、インポートします。

```typescript
import { WavFile } from './WavReader';
```

#### コンストラクタ

`WavFile` クラスのコンストラクタは、WAVファイルのパスを受け取ります。

```typescript
constructor(filePath: string)
```

#### メソッド

- `readWavFile()` WAVファイルを読み込み、ヘッダー情報と音声データを解析します。
- `parseHeader(buffer: Buffer)` バッファからヘッダー情報を解析します。
- `parseAudioData(buffer: Buffer)` バッファから音声データを解析します。

#### 例

以下に、`WavFile` クラスを使用してWAVファイルを読み込み、ヘッダー情報と音声データを取得する例を示します。

```typescript
import { WavFile } from './WavReader';

// WAVファイルのパスを指定
const filePath = 'path/to/your/file.wav';

// WavFile クラスのインスタンスを作成
const wavFile = new WavFile(filePath);

// ヘッダー情報を取得
console.log(wavFile.header);

// 音声データを取得
console.log(wavFile.audioData);
console.log(wavFile.audioDataLeft);
console.log(wavFile.audioDataRight);
```

### インターフェース

#### AudioData

モノラル音声データを表します。

```typescript
export interface AudioData {
  audioData: number[];
}
```

#### StereoAudioData

ステレオ音声データを表します。

```typescript
export interface StereoAudioData extends AudioData {
  audioDataLeft: number[];
  audioDataRight: number[];
}
```

## NoiseReduction クラス

`NoiseReduction` クラスは、音声データに対してノイズ除去を行うためのクラスです。
モノラルおよびステレオの音声データに対応しており、
複数のノイズ除去方法をチェイン・オブ・レスポンシビリティパターンで適用することができます。

### 特徴

- モノラルおよびステレオの音声データに対応
- 複数のノイズ除去方法をチェインとして適用可能
- ノイズ除去方法として以下をサポート
  - 振幅（Amplitude）
    - 振幅が小さい値はノイズとみなされることが多いです。0.01 〜 0.1の範囲が一般的な閾値です。
  - パワー（Power）
    - パワーは振幅の二乗です。振幅の閾値を基に計算すると、0.0001 〜 0.01の範囲が一般的です。
  - デシベル（Decibel）
    - デシベルは対数スケールで表されるため、-60dB 〜 -20dBの範囲が一般的な閾値です。-60dBは非常に小さい音、-20dBは比較的小さい音を意味します。
  - 絶対値（AbsoluteValue）
    - 絶対値も振幅と同様に扱われます。0.01 〜 0.1の範囲が一般的です。

### 使い方

1. `NoiseReduction` クラスをインポートします。

```typescript
import { NoiseReduction, NoiseReductionMethod } from './NoiseReduction';
```

### コンストラクタ

`NoiseReduction` クラスのコンストラクタは、ノイズ除去方法と閾値のペアの配列を受け取ります。

```typescript
constructor(methodThresholdPairs: { method: NoiseReductionMethod, threshold: number }[])
```

### メソッド

- `reduceNoise(audioData: AudioData | StereoAudioData): AudioData | StereoAudioData`

  音声データに対してノイズ除去を行います。

### 例

以下に、`NoiseReduction` クラスを使用して音声データにノイズ除去を適用する例を示します。

```typescript
import { NoiseReduction, NoiseReductionMethod } from './NoiseReduction';
import { AudioData, StereoAudioData } from './AudioDataInterfaces';

// 1分間のモノラル音声データを生成
const samplingRate = 44100; // 44.1kHz
const durationInSeconds = 60; // 1分間
const numSamples = samplingRate * durationInSeconds;
const audioData: AudioData = {
  audioData: new Array(numSamples).fill(0).map(() => Math.random() * 2 - 1) // ランダムな音声データ
};

// ノイズ除去方法と閾値のペアを指定
const methodThresholdPairs = [
  { method: NoiseReductionMethod.Amplitude, threshold: 0.1 },
  { method: NoiseReductionMethod.Decibel, threshold: -20 }
];

// NoiseReduction クラスのインスタンスを作成
const noiseReduction = new NoiseReduction(methodThresholdPairs);

// ノイズ除去を適用
const filteredAudioData = noiseReduction.reduceNoise(audioData);
console.log(filteredAudioData);
```

### インターフェース

#### AudioData

モノラル音声データを表します。

```typescript
export interface AudioData {
  audioData: number[];
}
```

#### StereoAudioData

ステレオ音声データを表します。

```typescript
export interface StereoAudioData extends AudioData {
  audioDataLeft: number[];
  audioDataRight: number[];
}
```

### ノイズ除去方法

#### NoiseReductionMethod

ノイズ除去方法を列挙型で定義しています。

```typescript
export enum NoiseReductionMethod {
  Amplitude,
  Power,
  Decibel,
  AbsoluteValue
}
```
