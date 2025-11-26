// Global Audio Manager to share audio context across components
let audioContext = null;
let analyser = null;
let sourceNode = null;

export function setupAudioAnalyser(audioElement) {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (sourceNode) {
    sourceNode.disconnect();
  }

  analyzer = audioContext.createAnalyser();
  analyzer.fftSize = 256;

  sourceNode = audioContext.createMediaElementSource(audioElement);
  sourceNode.connect(analyzer);
  analyzer.connect(audioContext.destination);

  return analyzer;
}

export function getFrequencyData() {
  if (!analyser) return null;

  const buffer = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(buffer);
  return buffer;
}
