class RecorderProcessor extends AudioWorkletProcessor {
    process(inputs) {
      const input = inputs[0];
      if (input.length > 0) {
        // Mono channel (input[0] = [channel0, channel1, ...])
        this.port.postMessage(input.map(ch => Float32Array.from(ch)));
      }
      return true;
    }
  }

registerProcessor('recorder-processor', RecorderProcessor);