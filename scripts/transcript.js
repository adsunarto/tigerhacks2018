const fs = require('fs')

const speech = require('@google-cloud/speech')
const client = new speech.SpeechClient()

const encoding = 'LINEAR16'
const sampleRateHertz = 16000
const languageCode = 'en-US'


module.exports = function transcribeFromWav(wavFile) {
  return new Promise((resolve, reject) => {
    let finalTranscript = ''
    fs.createReadStream(wavFile).pipe(
      client.streamingRecognize({
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 44100,
          languageCode: languageCode,
        },
        interimResults: false
      }).on('error', error => {
        console.error('transcribe error', error)
        return reject(error)
      }).on('data', data => {
        finalTranscript += data.results[0].alternatives[0].transcript
      }).on('finish', () => {
        return resolve(finalTranscript)
      }))
  })
}