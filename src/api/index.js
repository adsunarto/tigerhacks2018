const { exec } = require('child_process')
const { promisify } = require('util')
const path = require('path')
const multer = require('multer')
const textract = require('textract')
const mime = require('mime-types')
const bodyParser = require('body-parser')
const log = require('npmlog')
const isoLang = require('iso-639-1')
const transcribeFromWav = require('../../scripts/transcript')
const translate = require('../../scripts/translate')

const app = require('express').Router()

const audioMimes = [
  'audio/wav',
  'audio/aac',
  'audio/flacc',
  'audio/mpeg'
]

// Anything parsable by textract
const documentMimes = [
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.oasis.opendocument.text',
  'application/pdf',
  'application/rtf',
  'text/plain'
]

const acceptedMimes = [...audioMimes, ...documentMimes]

const maxFileSize = 128 * 1024 * 1024

const extensions = {
  'audio/mpeg': 'mp3'
}

const upload = multer({
  storage: multer.diskStorage({
    filename: (req, file, cb) => {
      const name = Date.now() + '-' + file.originalname + '.' + (extensions[file.mimetype] || mime.extension(file.mimetype))
      return cb(null, name)
    }
  }),
  limits: {
    fileSize: maxFileSize
  },
  fileFilter: (req, file, cb) => {
    return cb(null, acceptedMimes.includes(file.mimetype))
  }
})

function convertToWav(audioFile, type) {
  return new Promise((resolve, reject) => {
    exec(`python3 ${path.join(__dirname, '../../scripts/converttowav.py')} ${audioFile.path}`, (err, wavFile) => {
      if (err) return reject(err)
      return resolve(wavFile)
    })
  })
}

function extractText(documentFile) {
  console.log('P', documentFile.path)
  return new Promise((resolve, reject) => {
    textract.fromFileWithPath(documentFile.path, (err, text) => {
      console.log('ERR', err, text);
      if (err) return reject(err)
      return resolve(text)
    })
  })
}

app.post('/transcribe', upload.array('uploads[]'), async (req, res) => {
  log.verbose('transcribe', req.files.length + ' files uploaded')
  let audioFiles = req.files.filter(f => audioMimes.includes(f.mimetype))
  let documentFiles = req.files.filter(f => documentMimes.includes(f.mimetype))

  // Handle audio files
  let r = []
  try {
    let wavFiles = (await Promise.all(audioFiles.map(convertToWav))).map(s => s.trim().replace('\n', '').replace('\r', ''))
    try {
      let transcriptions = await Promise.all(wavFiles.map(transcribeFromWav))
      r = [...r, ...transcriptions.map((transcript, i) => {
        let m = {}
        m[audioFiles[i].originalname] = transcript
        return m
      })]
    } catch (e) {
      log.warn('transcribe', 'unable to transcribe', e.message)
      res.status(500).json({
        error: 'Unable to transcribe audio file.'
      })
    }
  } catch (e) {
    log.error(e)
    res.status(500).json({
      error: 'Unable to convert audio files to waveform.'
    })
  }

  try {
    let contents = await Promise.all(documentFiles.map(extractText))
    r = [...r, ...contents.map((value, i) => {
      console.log('MAMM', value, i);
      let m = {}
      m[documentFiles[i].originalname] = value
      return m
    })]
  } catch (e) {
    log.warn('textract', 'unable to extract from file', e.message)
    res.status(500).json({
      error: 'Unable to extract text from file'
    })
  }

  res.json(r)
})

app.post('/translate/:language', bodyParser.text(), async (req, res) => {
  let target = req.params['language']
  if (!isoLang.validate(target)) return res.status(400).send('Invalid target language')
  console.log('BODY', req.body.text)
  try {
    let translated = await translate(req.body.text, target)
    return res.send(translated)
  } catch (e) {
    log.warn('translate', 'error translating to ' + target, e.message)
    res.status(400).send('Error translating...')
  }
})

app.post('/summary/:length', (req, res) => {
  let sentences = req.params['length']
})

module.exports = app