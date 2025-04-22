class RecorderProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super()

    const durationInSeconds = options.processorOptions?.duration || 1
    this.sampleRate = globalThis.sampleRate
    this.bufferSize = this.sampleRate * durationInSeconds
    this.buffer = []
    this.silentFrameCount = 0
    this.maxSilentFrames = this.sampleRate * 0.5 // Report after 0.5s of silence
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0][0] // Mono input

    // Check if received a message from main thread
    if (this.flushBuffer) {
      this.flushBuffer = false
      if (this.buffer.length > 0) {
        // Send any remaining audio data
        this.port.postMessage([new Float32Array(this.buffer)])
        this.buffer = []
      }
    }

    // Handle silent inputs - this ensures we register activity even when silent
    if (!input || input.length === 0) {
      this.silentFrameCount += 128 // Standard audio processing frame size

      // If we have extended silence, send an empty buffer periodically
      if (this.silentFrameCount >= this.maxSilentFrames) {
        this.silentFrameCount = 0
        this.port.postMessage([new Float32Array(0)]) // Empty buffer as heartbeat
      }
      return true
    }

    // Reset silent frame counter when we have input
    this.silentFrameCount = 0

    // Add input samples to buffer
    this.buffer.push(...input)

    // If buffer is full, send it and clear
    if (this.buffer.length >= this.bufferSize) {
      const chunk = this.buffer.slice(0, this.bufferSize)
      this.port.postMessage([new Float32Array(chunk)])
      this.buffer = this.buffer.slice(this.bufferSize)
    }

    return true
  }

  // Handle messages from the main thread
  onmessage(event) {
    if (event.data.command === 'flush') {
      this.flushBuffer = true
    }
  }
}

registerProcessor('recorder-processor', RecorderProcessor)
