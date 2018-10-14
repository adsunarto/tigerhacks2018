# python [thisFile].py [src_lang] [targ_lang] [inputFile].txt

import sys, os, re
from urllib.parse import quote_plus as urlencode
import urllib.parse
from google.cloud import translate # Imports the Google Cloud client library
# GOOGLE_APPLICATION_CREDENTIALS requirement for Google Translation API
credential_path = "service_account_tt.json"
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = credential_path

if __name__ == '__main__':
    translate_client = translate.Client() # Instantiates a client

    args = sys.argv[1:]
    src = args[0] # src language
    target =  args[1]# target language
    inputFile = args[2] # input file

    file = open(inputFile, 'r')
    text = file.read()
    file.close()

    # Create a dictionary containing 'translatedText' and 'input'
    result = translate_client.translate(
        text, source_language=src, target_language=target)

    #print(result['input'])) # Print the input
    urltxt = (urlencode(result['translatedText'])) # Print the translation
    print(urltxt.replace('+','%20'))
    # print(re.sub(r'\+', ' ', urltxt))

    # Write to a file
      '''outputFile = 'out.txt'
      with open(outputFile, 'w', encoding='utf-8') as f:
        f.write(result['translatedText'])'''
