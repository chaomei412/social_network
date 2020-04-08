import nltk
#nltk.download('punkt')
#nltk.download('stopwords')
nltk.download('wordnet')
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from autocorrect import Speller
import re
from nltk.stem import PorterStemmer
from nltk.tokenize import sent_tokenize
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfTransformer
import csv
import json 

ps = PorterStemmer()
spel = Speller(lang='en',threshold=0.7)
lemmatizer = WordNetLemmatizer()

def text_cleaner(text):
	rules = [
		{r'>\s+': u'>'},  # remove spaces after a tag opens or closes
		{r'\s+': u' '},  # replace consecutive spaces
		{r'\s*<br\s*/?>\s*': u'\n'},  # newline after a <br>
		{r'</(div)\s*>\s*': u'\n'},  # newline after </p> and </div> and <h1/>...
		{r'</(p|h\d)\s*>\s*': u'\n\n'},  # newline after </p> and </div> and <h1/>...
		{r'<head>.*<\s*(/head|body)[^>]*>': u''},  # remove <head> to </head>
		{r'<a\s+href="([^"]+)"[^>]*>.*</a>': r'\1'},  # show links instead of texts
		{r'[ \t]*<[^<]*?/?>': u''},  # remove remaining tags
		{r'^\s+': u''}  # remove spaces at the beginning
	]
	for rule in rules:
		for (k, v) in rule.items():
			regex = re.compile(k)
			text = regex.sub(v, text)
	text = text.rstrip()
	return text.lower()

def spell(text):
	for i in range(0,len(text)):
		text[i]=spel.autocorrect_word(text[i])
	return text
def steam(words):
	for i in range(0,len(words)):
		words[i]=ps.stem(words[i])	
	return words
	
def lemitzr(words):
	for i in range(0,len(words)):
		words[i]=lemmatizer.lemmatize(words[i])	
	return words


#from parse import *
#print("original string: ",text)

classes=["World","Sports","Business","Sci_Tech"]

for file in classes:
	open(file,"w").write("{}")
fo=open("data/train.csv","r")
csv_reader = csv.reader(fo, delimiter=',')
train_count=0
for row in csv_reader:
	train_count+=1
	print("train_no_",train_count)
	Class=int(row[0])-1
	text=(row[1]+row[2]).lower()
	#print("cleaned string: ",text)
	stop_words = set(stopwords.words('english'))

	word_tokens = word_tokenize(text)
	#print("tokens: ",word_tokens)
	print("original_token_count: ",len(word_tokens))

	unique_words = list(set(word_tokens))
	print("unique_token_count: ",len(unique_words))

	spelled_words=spell(unique_words)
	#print("spell words: ",spelled_words)

	filtered_sentence = [w for w in word_tokens if not w in stop_words]
	filtered_sentence = []
	for w in spelled_words:
		if w not in stop_words:
			filtered_sentence.append(w)
	#print("filtered_words: ",filtered_sentence)	

	#stm=steam(filtered_sentence)
	#print("steamed_words: ",stm)#not to accurate only remove er ing ed from each word	

	lmtz=lemitzr(filtered_sentence)
	print("lamitized_words: ",lmtz)


	print("stpwords count: ",len(word_tokens)-len(filtered_sentence))
	print("dataset of word decreses from  ",len(word_tokens), "to", len(filtered_sentence))
	print("eliminated word ",len(word_tokens)-len(filtered_sentence),"  ", 100-(len(filtered_sentence)/(len(word_tokens)))*100 ,"%")
	
	
	
	temp_word_list=json.loads(open(classes[Class],"r").read())
	#print("old_word_count",temp_word_list)
	
	for word in list(set(filtered_sentence)):
		if word in temp_word_list.keys(): 	
			temp_word_list[word]+=filtered_sentence.count(word)
		else:
			temp_word_list[word]=filtered_sentence.count(word)
	#print("new ",temp_word_list)
	open(classes[Class],"w").write(json.dumps(temp_word_list))