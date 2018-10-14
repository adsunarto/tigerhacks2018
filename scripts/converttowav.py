from pydub import AudioSegment
from sys import argv


def convertToWav(fileName):
    sound = AudioSegment.from_file(fileName, fileName.split('.')[-1])
    sound = sound.set_channels(1)
    sound.export(str(fileName) + '.wav', format="wav")
    return str(fileName) + '.wav'


if __name__ == '__main__':
    print(convertToWav(argv[1]))
