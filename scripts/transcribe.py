import io
import os
from pydub import AudioSegment
from urllib.parse import quote_plus as urlencode

# Imports the Google Cloud client library
from google.cloud import speech
from google.cloud.speech import enums
from google.cloud.speech import types

# GOOGLE_APPLICATION_CREDENTIALS requirement to use Google Translation API
credential_path = "D:/Desktop/translate/service_account_sr.json"
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = credential_path

# Instantiates a client
client = speech.SpeechClient()

# The name of the audio file to transcribe
file_name = 'IYAGI.wav'
file_name_single = 'test_single.wav'
sound = AudioSegment.from_wav(file_name)
sound = sound.set_channels(1)
sound.export(file_name_single, format="wav")

# Loads the audio into memory
# with io.open(file_name_single, 'rb') as audio_file:
#     content = audio_file.read()
# audio = types.RecognitionAudio(content=content)

# Loads the audio from Google Cloud Storage
audio = types.RecognitionAudio(uri='gs://transcript-audio-tigerhacks/IYAGI.wav')

config = types.RecognitionConfig(
    # encoding=enums.RecognitionConfig.AudioEncoding.LINEAR16,
    # sample_rate_hertz=16000,
    language_code='ko-KR')

# Detects speech in the audio file
# response = client.recognize(config, audio)
operation = client.long_running_recognize(config, audio)
response = operation.result(timeout=90)

transcript = ""
for result in response.results:
    transcript += result.alternatives[0].transcript

outputFile = 'out.txt'
with open(outputFile, 'w', encoding='utf-8') as f:
    f.write(transcript)
f.close()

# for result in response.results:
#     print('Transcript: {}'.format(urlencode(result.alternatives[0].transcript)))
