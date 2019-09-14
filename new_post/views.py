from users.find_search_friend import *
from users.login_dignups import *
from django.shortcuts import render
import sqlite3 as db
import os
import json
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
def upload_post_image(request):
	my_id=request.session['u_id']
	pic=request.FILES['fileToUpload']
	
	conn=db.connect('sqlite3_manager/db')	
	c = conn.cursor()

	#save image with user id in db so we can identify which image is of witch user
	q="insert into ppics values(null,"+str(my_id)+",'"+pic.name.split(".")[-1]+"')"
	c.execute(q)
	conn.commit()

	qq="select last_insert_rowid()"
	id=0
	for row in c.execute(qq):
		id=row[0]

	#handle pic

	fs = FileSystemStorage()
	pic_name=str(id)+str(my_id)+"."+pic.name.split(".")[-1]
	filename = fs.save(pic_name, pic)
	uploaded_file_url = fs.url(filename)
	print(uploaded_file_url)
	print("pic new name",pic_name)
	
	conn.commit()
	conn.close()
	return HttpResponse("/media/"+pic_name)




def share(request):
	my_id=request.session['u_id']
	
	date=request.POST.get("date");
	content=request.POST.get("content")
	
	conn=db.connect('sqlite3_manager/db')	
	c = conn.cursor()
	
	q="insert into post values(null,"+str(my_id)+",'"+content+"','"+date+"',0,0)"
	c.execute(q)
	conn.commit()
	conn.close()
	data=[]
	data['date']=date
	data['content']=content
	return HttpResponse(json.dumps(data), content_type="application/json")

























	