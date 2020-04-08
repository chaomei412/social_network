import re
html_doc = open("parse.html","r").read()
from bs4 import BeautifulSoup
soup = BeautifulSoup(html_doc, 'html.parser')
from PIL import Image
import cv2 
import urllib.request
import pytesseract
def img_to_str(path):
	print(path)
	img=''
	if(path.count("http")==1 or path.count("https")==1):
		img = Image.open(urllib.request.urlopen(path))
	else:
		img = Image.open(path)
	custom_config = '--l hin --oem 3 --psm 6'
	txt=pytesseract.image_to_string(img, config=custom_config)
	return txt

def remove_html_tags(text):
    """Remove html tags from a string"""
    clean = re.compile('<.*?>')
    return re.sub(clean, '', text)
	
images = {}
txt=""
for img in soup.findAll('img'):
	tmp=img_to_str(img.get('src'))
	images[img.get('src').split("/")[-1]]=tmp
	txt+=tmp
text=remove_html_tags(html_doc)+txt	