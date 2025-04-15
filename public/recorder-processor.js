// class RecorderProcessor extends AudioWorkletProcessor {
//     process(inputs) {
//       const input = inputs[0];
//       if (input.length > 0) {
//         // Mono channel (input[0] = [channel0, channel1, ...])
//         this.port.postMessage(input.map(ch => Float32Array.from(ch)));
//       }
//       return true;
//     }
//   }

// registerProcessor('recorder-processor', RecorderProcessor);

class RecorderProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super()

    // Use provided duration in seconds from main thread, fallback to 1 second
    const durationInSeconds = options.processorOptions?.duration || 1

    // Store the current sample rate (usually 44100)
    this.sampleRate = sampleRate

    // Compute buffer size: samples per second * duration
    this.bufferSize = this.sampleRate * durationInSeconds

    // Temp buffer to collect samples
    this.buffer = []
  }

  process(inputs) {
    const input = inputs[0][0] // mono channel

    if (input) {
      this.buffer.push(...input)

      if (this.buffer.length >= this.bufferSize) {
        const chunk = this.buffer.slice(0, this.bufferSize)
        this.buffer = this.buffer.slice(this.bufferSize)

        // Send chunk to main thread
        this.port.postMessage([new Float32Array(chunk)])
      }
    }

    return true // Keep processor alive
  }
}

registerProcessor('recorder-processor', RecorderProcessor)
