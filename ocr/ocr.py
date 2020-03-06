'''
The languages currently covered are

    Bengali (ben)
    Gujarati (guj)
    Hindi (hin)
    Kannada (kan)
    Malayalam (mal)
    Meetei Meyak (mni)
    Oriya (ori)
    Punjabi (pan)
    Santali (sat)
    Tamil (tam)
    Telugu (tel)

'''
import cv2 
import pytesseract
def img_to_str(path):
	img = cv2.imread(path)
	custom_config = '--l hin --oem 3 --psm 6'
	txt=pytesseract.image_to_string(img, config=custom_config)
	return txt