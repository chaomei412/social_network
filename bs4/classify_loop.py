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
import pymongo
import cv2 
import pytesseract
import re
html_doc = open("parse.html","r").read()
from bs4 import BeautifulSoup

from PIL import Image
import urllib.request

def img_to_str(path):
	print(path)
	img=''
	if(path.count("http")==1 or path.count("https")==1):
		img = Image.open(urllib.request.urlopen(path))
	else:
		img = Image.open(".."+path)
	custom_config = '--l hin --oem 3 --psm 6'
	txt=pytesseract.image_to_string(img, config=custom_config)
	return txt

def remove_html_tags(text):
    """Remove html tags from a string"""
    clean = re.compile('<.*?>')
    return re.sub(clean, '', text)


	

myclient = pymongo.MongoClient('mongodb://localhost:27017/')
mydb = myclient['social_network']
clasify = mydb["post_category"]
posts=mydb["post"]
train=mydb["train"]

import os
classes = os.listdir('trained')
print("classes:",classes)
import time
while(True):
    x=clasify.find_one({})
    if(not x):
        continue
    post_id=x["id"]
    print(post_id)
    clasify.find_one_and_delete({"_id":x["_id"]})

    soup = BeautifulSoup(x["content"], features='html.parser')
    images = {}
    txt=""
    for img in soup.findAll('img'):
        tmp=img_to_str(img.get('src'))
        images[img.get('src').split("/")[-1]]=tmp
        txt+=tmp
    print("image text:",txt)       
    test=(remove_html_tags(x["content"])+txt).lower()
    print("classify post content:",test)

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






    result={}

    #{"a":10,"b":20,"c":4}
    for clas in classes:
        count=0
        occurances=0
        tokens = json.loads(open("trained/"+clas,"r").read())
        for key in tokens:
            if(key in filtered_sentence and tokens[key]>1):
                count+=1
        print("class ",clas," match ",count)
        result[clas]=count
    print("before: ",result)
    print("sorted_count_match: ",sorted(result.items(), key = lambda kv:(kv[1], kv[0])))

    result=sorted(result.items(), key = lambda kv:(kv[1], kv[0]))     
    max_class=[]
    if(result[-1][1]>=20):        
        max_class.append(result[-1][0])
        #multiple class possible
        for i in [-1,-2,-3,-4,-5,-6]:
            if((result[i][1]-result[i-1][1])<=3):
                max_class.append(result[i-1][0])
            else:
                break
    else:
        #asign only single class
        max_class=[result[-1][0]]
    print("predicted class",max_class)
    
    #print("using id :"+ str(post_id)+ " modifing post of id: "+str(posts.find_one({"_id":post_id})))
    posts.find_one_and_update({"_id":post_id},{"$set":{"category":max_class}})

    for Class in max_class:
        temp_word_list=''
        try:
            temp_word_list=json.loads(open("trained/"+Class,"r").read())
        except:
            temp_word_list={}

        #print("old_word_count",temp_word_list)
        
        for word in list(set(filtered_sentence)):
            if word in temp_word_list.keys(): 	
                temp_word_list[word]+=filtered_sentence.count(word)
            else:
                temp_word_list[word]=filtered_sentence.count(word)
        #print("new ",temp_word_list)
        open("trained/"+Class,"w").write(json.dumps(temp_word_list))
        print("class ",Class," trained")