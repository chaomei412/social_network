from users.find_search_friend import *
from users.login_dignups import *
from users.profile import *
from users.account import *
from django.shortcuts import render, redirect  
import os
from django.contrib.staticfiles.storage import staticfiles_storage
import sqlite3 as db
import pymongo
from django.http import JsonResponse
from bson.objectid import ObjectId as object_id
def index(request):
	#entry point of site 127.0.0.1
	return render(request,'index.html')

def emojis(request):
	return render(request,'emojis.html')

def fmain(request):
	return render(request, 'main.html')

def fsignup(request):
	return render(request, 'signup.html')		

def main(request):
	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	users=mydb["users"]
	session = mydb["session"]

	mydb2 = myclient['webhost']
	my_ipv6=mydb2["my_ipv6"]

	
	if request.method == "POST":
		data={}
		data["username"]=request.POST.get('username')
		data["_id"]=object_id(request.POST.get('_id'))
		if(session.find_one(data)!=None):
			#found old session ok
			#data["username"]=username
			data["_id"]=str(data["_id"])	
			ipv6='['+my_ipv6.find().limit(1).sort("_id",-1)[0]["ipv6"]+']'
			data["websocket_ip"]=ipv6
			data["pic_url"]=users.find_one({"u_name":data["username"]})["pic_url"]
			data=json.dumps(data)
			return HttpResponse(data, content_type='application/json')
		else:
			#not found old session	
			#user is not login
			data={}
			data["_id"]=-1
			data=json.dumps(data)
			return HttpResponse(data, content_type='application/json')
	
	data={}
	if (not is_login(request)):#is user not login
		#user is not login
		data["_id"]=-1
		data=json.dumps(data)
		return HttpResponse(data, content_type='application/json')
	#user is loogin

	my_id = request.session['u_id']#object_id_of_mongo collection users if user is login

	username=users.find_one({"_id":object_id(my_id)})["u_name"]
	#return HttpResponse(username, content_type='application/json')
	#get inserted quey data in session to use for chatting and current session

	data=session.find_one({"username":username})
	if(data==None):
		data={}
		#use has no active session
		data["_id"]=-1	
		data=json.dumps(data)
		return HttpResponse(data, content_type='application/json')
	
	data["username"]=username
	data["_id"]=str(data["_id"])	
	ipv6='['+my_ipv6.find().limit(1).sort("_id",-1)[0]["ipv6"]+']'
	data["websocket_ip"]=ipv6
	data=json.dumps(data)
	return HttpResponse(data, content_type='application/json')

from bson.objectid import ObjectId as object_id

def logout(request):
	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	users=mydb["users"]
	session = mydb["session"]

	if(request.method=="POST"):
		query={}
		query["username"]=request.POST.get("username")
		query["_id"]=object_id(request.POST.get("_id"))
		session.remove(query)#delete session
		return render(request, 'index.html', {"username" : 0})		
	#websocket=mydb["websocket"]    removed websocket entry by websocket connection 

	query={"username":users.find_one({"_id":object_id(request.session['u_id'])})["u_name"]}
	session.remove(query)#delete session
	#websocket.remove(query)#clear from websocket objects
	request.session['u_id']=0#reset session variable
	return render(request, 'index.html', {"username" : 0})


def is_username_avail(request):
	u_name=request.POST.get('u_name')
	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	users=mydb["users"]

	q={"u_name":u_name}
	response_data={}
	response_data['count']=users.find(q).count()	
	
	return HttpResponse(json.dumps(response_data), content_type="application/json")

def is_email_avail(request):
	email=request.POST.get('email')
	conn=db.connect('sqlite3_manager/db')	
	c = conn.cursor()
	q="select count(id) from users where email='"+email+"'"
	count=0
	for row in c.execute(q):
		count=row[0]
	response_data = {}
	response_data['count'] = count
	return HttpResponse(json.dumps(response_data), content_type="application/json")	

def signup(request):  
	if request.method == "POST":
		data={}
		data["u_name"]=request.POST.get('username')
		data["pass_d"]=request.POST.get('password')
		data["email"]=request.POST.get('email')
		data["f_name"]=request.POST.get('f_name')
		data["l_name"]=request.POST.get('l_name')
		data["dob"]=request.POST.get('dob')

		myclient = pymongo.MongoClient('mongodb://localhost:27017/')
		mydb = myclient['social_network']
		mycol = mydb["users"]

		mycol.insert_one(data)#all post loaded directly we can use .limit()  insted to use next post function to load posts in bunch
		
		u_id=str(mycol.find_one(data)["_id"])




	
		#handle pic
		pic=request.FILES['pic']
		fs = FileSystemStorage()
		pic_name="users/"+str(u_id)+"."+pic.name.split(".")[-1]
		filename = fs.save(pic_name, pic)
		uploaded_file_url = fs.url(filename)
		
		mycol.find_one_and_update(data,{'$set':{"pic_url":filename}})


		return JsonResponse(json.dumps("{'error':0,'signup_ok':1}"),content_type=json,safe=False)
	return JsonResponse(json.dumps("{'error':1,'signup_ok':0}"),content_type=json,safe=False)
import time
from cryptography.fernet import Fernet
def get_id(request):
	return request.session['u_id']
	
	
def encode(data,key):
	cipher_suite = Fernet(key)
	return cipher_suite.encrypt(bytes(data, encoding='utf-8')).decode("utf-8") 

def decode(data,key):
	cipher_suite = Fernet(key)
	return cipher_suite.decrypt(data)	
	
def login_check(request):
	#url   /flogin
	#login form submit request handle by this
	if request.method == 'GET' and request.GET.get('x')=='1':#logout request
		request.session['u_id']=0
		return render(request, 'login.html', {"username" : 0})
		#LOGOUT
	elif request.method == 'POST':
		username=request.POST.get('username')
		password=request.POST.get('password')
		#LOGIN
		data=validate_login(request,username,password)
		if(data!=None):
		#login data is correct found entry in db
			#check is users session allready acive
			myclient = pymongo.MongoClient('mongodb://localhost:27017/')
			mydb = myclient['social_network']

			mydb2 = myclient['webhost']
			my_ipv6=mydb2["my_ipv6"]
			users=mydb["users"]
			session = mydb["session"]
			websocket=mydb["websocket"]
			query={"username":username}
			
			if(websocket.find_one({"username":username})!=None):
				#user is online in another device trying to login twice
				print("user has active websocket session on another device")
				data={}
				data["_id"]=-2#logein in another device	
				data=json.dumps(data)
				return HttpResponse(data, content_type='application/json')
			
			session.remove(query)#no active in any other device remove session from db
			#delete all previus session from all devices
			q={}
			q["username"]=request.POST.get("username")
			q["client_time_stamp"]=request.POST.get("time_stamp")
			q['server_time_stamp']=time.asctime(time.localtime(time.time()))

			session.insert(q)
			request.session['u_id'] = str(data["_id"])
			data={}
			#get inserted quey data in session to use for chatting and current session
			data=session.find_one({"username":request.POST.get("username")})
			data["_id"]=str(data["_id"])	
			ipv6='['+my_ipv6.find().limit(1).sort("_id",-1)[0]["ipv6"]+']'
			data["websocket_ip"]=ipv6
			data["pic_url"]=users.find_one({"u_name":request.POST.get("username")})["pic_url"]
			data=json.dumps(data)
			return HttpResponse(data, content_type='application/json')
		else:
			#invalid creditionals
			request.session['u_id']=0
			data={}
			data["_id"]=-1
			data=json.dumps(data)
			return HttpResponse(data, content_type='application/json')

	elif request.session.has_key('username'):
		if request.session['u_id']==0:		
				request.session['u_id']=0
				return render(request, 'login.html', {"username" : 0})

			#PRIVIUS LOGIN IS LOGED OUT
		else:
			#user still login
			request.session['u_id']=0
			return render(request, 'login.html', {"username" : 0})
	else:
		request.session['u_id']=0
		return render(request, 'login.html', {"username" : 0})

import pymongo		

def validate_login(request,u,p):

	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	mycol = mydb["users"]
	data={}
	data["u_name"]=request.POST.get('username')
	data["pass_d"]=request.POST.get('password')
	res=-1
	q={"u_name":u,"pass_d":p}
	res=mycol.find_one(q)
	#pic varchar(25),gender integer,religion_id integer,address_id integer)
	#print("login as ",res)
	return res

def is_login(request):
	if(request.session.has_key('u_id')):
		if request.session['u_id']==0:			
			#recently logout
			return 0
		else:
			#still login
			return 1
	else:
		
		#not login
		return 0
		
def brodcast(request):
	#instant chat
	if (not is_login(request)):
		#is user not login
		return render(request, 'login.html', {"username" : 0})
	#login
	id = request.session['u_id']
	conn=db.connect('sqlite3_manager/db')	
	c = conn.cursor()	
	q="select u.fname,u.lname,pc.pic_url from users u,passwords p,pics pc where u.id='"+str(id)+"' and u.id=p.u_id and u.id=pc.u_id"
	data=-1
	for i in c.execute(q):
		data=list(i)
	conn.close()
	return render(request,'brodcast.html',{"data":data})