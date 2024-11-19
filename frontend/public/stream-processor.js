class StreamProcessor extends AudioWorkletProcessor {
    process(inputs, outputs) {
      const output = outputs[0];
      const input = inputs[0];
  
      for (let channel = 0; channel < output.length; ++channel) {
        const outputChannel = output[channel];
        const inputChannel = input[channel];
        for (let i = 0; i < outputChannel.length; ++i) {
          outputChannel[i] = inputChannel[i];
        }
      }
      return true;
    }
  }
  
  registerProcessor('stream_processor', StreamProcessor);