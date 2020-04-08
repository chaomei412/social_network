from django.shortcuts import render, redirect  
import os
from django.contrib.staticfiles.storage import staticfiles_storage
import sqlite3 as db
import pymongo
from django.http import JsonResponse
def index(request):
	#entry point of site 127.0.0.1
	return render(request,'chat_categories.html')

def main(request):
    pass