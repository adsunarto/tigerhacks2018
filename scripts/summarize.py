#!/usr/bin/python3
import spacy
import sys


#setting up spacy and grabbing text
nlp = spacy.load('en_core_web_sm')
args = sys.argv
num_of_sen = int(args[1])
file_name = args[2]
with open(file_name, 'r') as fin:
    text_input = fin.read()
    text_input = text_input.replace('\n', '').replace('\r', '')
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
        if word.pos_ is "PUNCT" or word.pos_ == "SPACE" or word.pos_ == "SYM":
            continue

        func(word)
# Acesses The number of occurences for the word in dictionary occurences
def point(word):
    return occurences.get(word, 0)

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
            if p.pos_ == "PUNCT" or p.pos_ == "SPACE" or p.pos_ == "SYM":
                continue
            lemma = p.lemma_
            points += point(lemma)
        sentences.append(sentence(s,points))
# Maps the sentences to all of it's original index for relevance
originals = {}
def original_pos(sentences):
    for index, sent in enumerate(sentences):
        originals[sent.get_ss()] = index


# Outputs x number of top sentences.
def summary(sentences, x):
    if x >= len(sentences) or x == 0:
        print (' '.join([s.get_ss() for s in sentences]))
    else:
        ss = sorted(sentences)
        final_s = []
        for s in ss[::-1][:x]:
            final_s.append(originals.get(s.get_ss()))
        final_s.sort()
        print (' '.join([sentences[s].get_ss() for s in final_s]))



word_parse(doc, occurence)
get_sentences(doc)
original_pos(sentences)
summary(sentences, num_of_sen)
