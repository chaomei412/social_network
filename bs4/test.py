import nltk
#nltk.download('punkt')
#nltk.download('stopwords')
#nltk.download('wordnet')
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



fo=open("data/test.csv","r")
csv_reader = csv.reader(fo, delimiter=',')
test_count=0
accurate=0
classes=["World","Sports","Business","Sci_Tech"]
for row in csv_reader:
	test_count+=1
	class_label_known=classes[int(row[0])-1]
	test=(row[1]+row[2]).lower()
	


	
	#print("cleaned string: ",text)
	stop_words = set(stopwords.words('english'))




	stop_words = set(stopwords.words('english'))

	word_tokens = word_tokenize(test)
	#print("tokens: ",word_tokens)
	#print("original_token_count: ",len(word_tokens))

	unique_words = list(set(word_tokens))
	#print("unique_token_count: ",len(unique_words))

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
	'''	print("lamitized_words: ",lmtz)


	print("stpwords count: ",len(word_tokens)-len(filtered_sentence))
	print("dataset of word decreses from  ",len(word_tokens), "to", len(filtered_sentence))
	print("eliminated word ",len(word_tokens)-len(filtered_sentence),"  ", 100-(len(filtered_sentence)/(len(word_tokens)))*100 ,"%")
	'''





	print("@expected", class_label_known)
	result={}
	for clas in classes:
		count=0
		tokens = json.loads(open(clas,"r").read())
		for key in tokens:
			if(key in filtered_sentence):
				count+=1
		print("			class ",clas," match ",count)
		result[clas]=count
	max=result[classes[0]]
	max_class=classes[0]
	for k in result:
		if(result[k]>max):
			max=result[k]
			max_class=k
	if(max_class==class_label_known):
		print("predicted correct",class_label_known,max_class)
		accurate+=1
	print("tested ",test_count," accuracy",(accurate/test_count)*100)	