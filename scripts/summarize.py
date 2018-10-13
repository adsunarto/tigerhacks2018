#!/usr/bin/python3
import spacy
import sys


#setting up spacy and grabbing text
nlp = spacy.load('en_core_web_sm')
text_input = """spaCy's models are statistical and every "decision" they make – for example, which part-of-speech tag to assign, or whether a word is a named entity – is a prediction. This prediction is based on the examples the model has seen during training. To train a model, you first need training data – examples of text, and the labels you want the model to predict. This could be a part-of-speech tag, a named entity or any other information.

The model is then shown the unlabelled text and will make a prediction. Because we know the correct answer, we can give the model feedback on its prediction in the form of an error gradient of the loss function that calculates the difference between the training example and the expected output. The greater the difference, the more significant the gradient and the updates to our model."""
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

def summary(sentences, x):
    if x >= len(sentences) or x == 0:
        print (' '.join([s.get_ss() for s in sentences[::-1]]))
    else:
        print (' '.join([s.get_ss() for s in sentences[::-1][:x]]))



word_parse(doc, occurence)
get_sentences(doc)
sentences.sort()
summary(sentences, 2)
