export interface AudioData {
  audioData: number[];
}

export interface StereoAudioData extends AudioData {
  audioDataLeft: number[];
  audioDataRight: number[];
}