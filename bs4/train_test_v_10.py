
# cleaning texts 
import pandas as pd 
import re 
import nltk 
from nltk.corpus import stopwords 
from nltk.stem.porter import PorterStemmer 
from sklearn.feature_extraction.text import CountVectorizer 
import csv  
dataset = [] 
               
fo=open("data/ag_news_test.csv","r")
csv_reader = csv.reader(fo, delimiter=',')

for row in csv_reader:
	dataset.append([(row[1]+row[2]).lower(),row[0]])
	
dataset = pd.DataFrame(dataset) 
dataset.columns = ["post", "category"] 

print(dataset)  
#nltk.download('stopwords') 
  
corpus = [] 
  
for i in range(0, 7600): 
    text = re.sub('[^a-zA-Z]', '', dataset['post'][i]) 
    text = text.lower() 
    text = text.split() 
    ps = PorterStemmer() 
    text = ''.join(text) 
    corpus.append(text) 
  
# creating bag of words model 
cv = CountVectorizer(max_features = 1500) 
  
X = cv.fit_transform(corpus).toarray() 
y = dataset.iloc[:, 1].values 

# splitting the data set into training set and test set 
from sklearn.model_selection import train_test_split 
  
X_train, X_test, y_train, y_test = train_test_split( 
           X, y, test_size = 0.25, random_state = 0) 



# fitting naive bayes to the training set 
from sklearn.naive_bayes import GaussianNB 
from sklearn.metrics import confusion_matrix 
  
classifier = GaussianNB(); 
classifier.fit(X_train, y_train) 
print(classifier)  
# predicting test set results 
y_pred = classifier.predict(X_test) 
for p in range(len(y_pred)):
	print(X_test[p]," expected: ",y_test[p]," preducted: ",y_pred[p]) 
# making the confusion matrix 
cm = confusion_matrix(y_test, y_pred)

print(cm) 