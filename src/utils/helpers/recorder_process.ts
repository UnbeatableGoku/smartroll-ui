// export const startRecording = async (duration = 10000) => {
//     return new Promise(async (resolve) => {
//       const audioContext = new AudioContext();
//       const sampleRate = audioContext.sampleRate;
//       try {
//         await audioContext.audioWorklet.addModule('recorder-processor.js');
//       } catch (err) {
//         resolve({
//           error: true,
//           message: `Failed to load AudioWorklet module: ${err}`,
//           blob: null
//         });
//         return;
//       }

//       let mic: MediaStream;
//       try {
//         mic = await navigator.mediaDevices.getUserMedia({
//           audio: {
//             echoCancellation: false,
//             noiseSuppression: false,
//             autoGainControl: false
//           }
//         });
//       } catch (err) {
//         resolve({
//           error: true,
//           message: 'Microphone permission denied or not available, Please allow it from site settings',
//           blob: null
//         });
//         return;
//       }

//       const recorderNode = new AudioWorkletNode(audioContext, 'recorder-processor');
//       const source = audioContext.createMediaStreamSource(mic);
//       source.connect(recorderNode);

//       let recordedData: any[] = [];

//       recorderNode.port.onmessage = (event) => {
//         recordedData.push(event.data[0]);
//       };

//       recorderNode.connect(audioContext.destination); // optional

//       setTimeout(() => {
//         recorderNode.disconnect();
//         source.disconnect();
//         audioContext.close();

//         const audioBuffer = flattenChunks(recordedData);
//         const wavBlob = createWavBlob(audioBuffer, sampleRate);

//         resolve({
//           error: false,
//           message: 'Recording successful.',
//           blob: wavBlob
//         });
//       }, duration);

//       function flattenChunks(chunks: any[]) {
//         const length = chunks.reduce((acc, cur) => acc + cur.length, 0);
//         const result = new Float32Array(length);
//         let offset = 0;
//         chunks.forEach(chunk => {
//           result.set(chunk, offset);
//           offset += chunk.length;
//         });
//         return result;
//       }

//       function createWavBlob(float32Array: Float32Array, sampleRate: number) {
//         const buffer = new ArrayBuffer(44 + float32Array.length * 2);
//         const view = new DataView(buffer);

//         function writeString(view: DataView, offset: number, str: string) {
//           for (let i = 0; i < str.length; i++) {
//             view.setUint8(offset + i, str.charCodeAt(i));
//           }
//         }

//         function floatTo16BitPCM(output: DataView, offset: number, input: Float32Array) {
//           for (let i = 0; i < input.length; i++, offset += 2) {
//             let s = Math.max(-1, Math.min(1, input[i]));
//             s = s < 0 ? s * 0x8000 : s * 0x7FFF;
//             output.setInt16(offset, s, true);
//           }
//         }

//         writeString(view, 0, 'RIFF');
//         view.setUint32(4, 36 + float32Array.length * 2, true);
//         writeString(view, 8, 'WAVE');
//         writeString(view, 12, 'fmt ');
//         view.setUint32(16, 16, true);
//         view.setUint16(20, 1, true);
//         view.setUint16(22, 1, true);
//         view.setUint32(24, sampleRate, true);
//         view.setUint32(28, sampleRate * 2, true);
//         view.setUint16(32, 2, true);
//         view.setUint16(34, 16, true);
//         writeString(view, 36, 'data');
//         view.setUint32(40, float32Array.length * 2, true);

//         floatTo16BitPCM(view, 44, float32Array);

//         return new Blob([view], { type: 'audio/wav' });
//       }
//     });
//   };import { Socket } from 'socket.io-client'

export const flattenChunks = (chunks: Float32Array[]) => {
  const length = chunks.reduce((acc, cur) => acc + cur.length, 0)
  const result = new Float32Array(length)
  let offset = 0
  chunks.forEach((chunk) => {
    result.set(chunk, offset)
    offset += chunk.length
  })
  return result
}

export const createWavBlob = (
  float32Array: Float32Array,
  sampleRate: number,
) => {
  const buffer = new ArrayBuffer(44 + float32Array.length * 2)
  const view = new DataView(buffer)

  const writeString = (view: DataView, offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i))
    }
  }

  const floatTo16BitPCM = (
    output: DataView,
    offset: number,
    input: Float32Array,
  ) => {
    for (let i = 0; i < input.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, input[i]))
      s = s < 0 ? s * 0x8000 : s * 0x7fff
      output.setInt16(offset, s, true)
    }
  }

  writeString(view, 0, 'RIFF')
  view.setUint32(4, 36 + float32Array.length * 2, true)
  writeString(view, 8, 'WAVE')
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeString(view, 36, 'data')
  view.setUint32(40, float32Array.length * 2, true)

  floatTo16BitPCM(view, 44, float32Array)
  return new Blob([view], { type: 'audio/wav' })
}

export const createPCMBlob = (float32Array: any) => {
  const buffer = new ArrayBuffer(float32Array.length * 2) // 2 bytes per sample (16-bit)
  const view = new DataView(buffer)

  for (let i = 0; i < float32Array.length; i++) {
    let sample = Math.max(-1, Math.min(1, float32Array[i]))
    sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff
    view.setInt16(i * 2, sample, true) // Little-endian
  }

  return new Blob([view], { type: 'application/octet-stream' })
}

export const downloadBlob = (blob: any, filename: any) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
}
