import sqlite3 as db
import json
from django.http import HttpResponse , HttpResponseRedirect
from django.shortcuts import render, redirect 
from django.core.files.storage import FileSystemStorage

def logout(request):
	request.session['u_id']=0#reset session variable
	return render(request, 'login.html', {"logout" : 1})
def is_username_avail(request):
	u_name=request.POST.get('u_name')
	conn=db.connect('sqlite3_manager/db')	
	c = conn.cursor()
	q="select count(id) from users where u_id='"+u_name+"'"
	count=0
	for row in c.execute(q):
		count=row[0]
	response_data = {}
	response_data['count'] = count
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
		u_name=request.POST.get('username')
		pass_d=request.POST.get('password')
		email=request.POST.get('email')
		f_name=request.POST.get('f_name')
		l_name=request.POST.get('l_name')
		dob=request.POST.get('dob')
		conn=db.connect('sqlite3_manager/db')	
		c = conn.cursor()
		q="insert into users values(?,?,?,?,?,?,?,?,?)"
		q2=(None,u_name,"".join(dob.split("-")),f_name,l_name,'',1,0,0)
		print("values: ",q2)
		#pic varchar(25),gender integer,religion_id integer,address_id integer)
		c.execute(q,q2)
		conn.commit()
		q="SELECT id from users where u_id='"+u_name+"'"
		u_id=0
		for i in c.execute(q):
			u_id=i[0]
		print(u_id)
		
		
		#save password
		q="insert into passwords values(?,?,?,?)"
		q2=(None,u_id,pass_d,"date")
		c.execute(q,q2)
		conn.commit()		

		#handle pic
		pic=request.FILES['pic']
		fs = FileSystemStorage()
		pic_name=str(u_id)+"."+pic.name.split(".")[-1]
		filename = fs.save(pic_name, pic)
		uploaded_file_url = fs.url(filename)
		print(uploaded_file_url)

		print("pic new name",pic_name)
		
		#save pic data in db
		q="insert into pics values(?,?,?)"
		q2=(None,u_id,pic_name)
		c.execute(q,q2)
		conn.commit()		
		conn.close()
		#success		
        
		return render(request,'login.html',{'error':0,'signup_ok':1})
	return render(request,'signup.html',{'error':1,'signup_ok':0})  

def get_id(request):
	return request.session['u_id']
def login_check(request):
	if request.method == 'GET' and request.GET.get('x')=='1':#logout request
		request.session['u_id']=0
		return render(request, 'login.html', {"username" : 0})
		#LOGOUT
	elif request.method == 'POST':
		username=request.POST.get('username')
		password=request.POST.get('password')
		#LOGIN
		data=validate_login(request,username,password)
		if(data!=-1):
		#return if login success
			request.session['u_id'] = data[0]
			print("login success")
			return render(request, 'main.html', {"data" : data[1:]})
		else:
			request.session['u_id'] = 0
			return render(request, 'login.html', {"username" : 0,"invalid":1})
	elif request.session.has_key('username'):
		if request.session['u_id']==0:
			return render(request, 'login.html', {"username" : 0})
			#PRIVIUS LOGIN IS LOGED OUT
		else:
			#user still login
			username = request.session['u_id']
			return render(request, 'main.html', {"username" : username})
	else:
		return render(request, 'login.html', {"username" : 0})
def validate_login(request,u,p):
		conn=db.connect('sqlite3_manager/db')	
		c = conn.cursor()
		q="select u.id,u.fname,u.lname,pc.pic_url from users u,passwords p,pics pc where u.u_id='"+u+"' and p.password='"+p+"' and u.id=p.u_id and u.id=pc.u_id"
		#pic varchar(25),gender integer,religion_id integer,address_id integer)
		data=-1
		for i in c.execute(q):
			data=list(i)
		print("------",data,"===========")
		conn.close()
		return data
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