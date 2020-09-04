from users.find_search_friend import *
from users.login_dignups import *
from django.shortcuts import render
import sqlite3 as db
import time
import os
import json
import pymongo
# Create your views here.
from django.http import HttpResponse , HttpResponseRedirect

def new_post(request):
	if (not is_login(request)):#is user not login
		return render(request, 'login.html', {"username" : 0})
	#user is loogin
	conn=db.connect('sqlite3_manager/db')	
	c = conn.cursor()
	id = request.session['u_id']
	q="select u.fname,u.lname,pc.pic_url from users u,passwords p,pics pc where u.id='"+str(id)+"' and u.id=p.u_id and u.id=pc.u_id"
	#pic varchar(25),gender integer,religion_id integer,address_id integer)
	data=-1
	for i in c.execute(q):
		data=list(i)
	conn.close()
	return render(request,'controls.html',{"data":data})	
	#return HttpResponse("ok new post")
import uuid
def upload_post_image(request):

	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	mycol = mydb["images"]
	session=mydb["session"]
	users=mydb["users"]

	data_={}
	data_["request_method"]=request.method
	if request.method == "POST":
		data={}

		data["username"]=data_["username"]=request.POST.get('username')
		data["_id"]=data_["_id"]=object_id(request.POST.get('_id'))
		if(session.find_one(data)!=None):
			my_id=str(users.find_one({"u_name":data["username"]})['_id'])
			pic=request.FILES['fileToUpload']
			#save image with user id in db so we can identify which image is of witch user

			extension=pic.name.split(".")[-1]
			img_id=uuid.uuid1().hex #it can be int bytes to

			img_url=img_id+"."+extension

			q={"user_id":my_id,"pic_url":img_url}
			mycol.insert_one(q)


			#handle pic

			fs = FileSystemStorage()
			filename = fs.save(img_url, pic)
			uploaded_file_url = fs.url(filename)
			print(uploaded_file_url)
			print("pic new name",img_url)

			return HttpResponse("http://social.ulti.in/media/"+img_url)
	return HttpResponse(json.dumps(data_), content_type="application/json")

def share(request):
	
	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	mycol = mydb["post"]
	q={}
	q['user_id']=request.session['u_id'] #str ob user _id
	q['server_time_stamp']=time.asctime(time.localtime(time.time()))
	q['content']=request.POST.get("content").replace("'","''")
	q['user_time_stamp']=request.POST.get("date")
	q['privacy']=0 #currently temp later on 
	q['status']=0 #published not published block
	q['category']={}

	mycol.insert_one(q)
	post_class={"id":mycol.find_one(q)["_id"],"content":mycol.find_one(q)["content"]}
	cat_col=mydb["post_category"]
	cat_col.insert_one(post_class)

	data={}
	data['date']=time.asctime(time.localtime(time.time()))
	data['content']=request.POST.get("content").replace("'","''")
	return HttpResponse(json.dumps(data), content_type="application/json")
























	