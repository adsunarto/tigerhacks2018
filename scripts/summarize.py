#!/usr/bin/python3
import spacy
import sys


#setting up spacy and grabbing text
nlp = spacy.load('en_core_web_sm')
args = sys.argv
num_of_sen = int(args[1])
file_name = args[2]
fin = open(file_name, 'r')
text_input = fin.read()
doc = nlp(text_input)

# Adds an occurence of a word to the map of occurences
occurences = {}
def occurence(word):
        lemma = word.lemma_
        count = occurences.get(lemma, 0)
        count += 1
        occurences[lemma] = count

# Parses through all words in document and applies function to them.
def word_parse(words, func):
    for word in words:
        if word.pos_ is "PUNCT":
            continue

        func(word)
# Acesses The number of occurences for the word in dictionary occurences
def point(word):
    return occurences.get(word,0)

# A class of substrings containing points
class sentence(object):
    def __init__(self, ss, points):
        self.ss = ss
        self.points = points

    def __lt__(self, other):
        return self.points < other.points

    def get_ss(self):
        return self.ss

    def get_points(self):
        return self.points
# Retrieves all sentences from the file and ranks them according to points.
sentences = []
def get_sentences(words):
    for sent in words.sents:
        points = 0
        s = sent.text
        ss = nlp(s)
        for p in ss:
            lemma = p.lemma_
            points += point(lemma)
        sentences.append(sentence(s,points))
# Outputs x number of top sentences.
def summary(sentences, x):
    if x >= len(sentences) or x == 0:
        print (' '.join([s.get_ss() for s in sentences[::-1]]))
    else:
        print (' '.join([s.get_ss() for s in sentences[::-1][:x]]))



word_parse(doc, occurence)
get_sentences(doc)
sentences.sort()
summary(sentences, num_of_sen)
