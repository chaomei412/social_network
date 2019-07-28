from django.shortcuts import render
from random import randint
import datetime
from django.http import HttpResponse , HttpResponseRedirect  
from django.shortcuts import render, redirect  
import os
from django.conf import settings
from django.contrib.staticfiles.storage import staticfiles_storage
from django.core.files import File
import datetime  
import sqlite3 as db

def main(request):
		if (is_login(request)):#is user not login
			return render(request, 'login.html', {"username" : 0})
		User=get_username(request) 
		conn=db.connect('hos_data.db')
		id=get_id(request);
		c=conn.cursor()
		data=[]
		q='select * from users where id='+id
		for row in c.execute(q):
			data.append(row[1]);data.append(row[3]);data.append(row[2]);data.append(row[4])
		q='select * from hospital where id='+str(data[3])
		for row in c.execute(q):
			data[3]=row[1]
			data.append(row[2])
		conn.close()
		help='this is information about login creditional contact and address'
		return render(request,'profile.html',{'User':User,'data':data,'help':help})	
	#return HttpResponse("hi"+str(username))
def signup(request):  
	if request.method == "POST":  
		u=request.POST.get('username')
		p=request.POST.get('password')	
		e=request.POST.get('email')	
		conn = db.connect('hos_data.db')
		#con.isolation_level = None
		c = conn.cursor()
		#create table for store hospitals data
		q='select * from users where username="'+u+'"'
		count=0
		for row in c.execute(q):
			count=count+1
		if count==0:
			#not same username user present
			q="insert into users(username,email,password) values(?,?,?)"
			q2=(u,e,p)
			c.execute(q,q2)
			print("signup success as username and email ",u,e)
			id=0
			for row in c.execute(q):
				id=row[0]
			request.session['signup_id']=id
			conn.commit()	
			conn.close()
			#success		
			return render(request,'add_new_hospital.html',{'error':0})
		else:
			return render(request,'signup.html',{'email':1})
	return render(request,'signup.html',{})  


def login_check(request):
	if request.method == 'GET' and request.GET.get('x')=='1':
		request.session['username']=0
		return render(request, 'login.html', {"username" : 0})
		#LOGOUT
	elif request.method == 'POST':
		username=request.POST.get('username')
		password=request.POST.get('password')
		#LOGIN
		if(validate_login(request,username,password)):
		#return if login success
			request.session['username'] = username
			return render(request, 'profile.html', {"username" : username})
		else:
			request.session['username'] = 0
			return render(request, 'login.html', {"username" : 0,"invalid":1})
	elif request.session.has_key('username'):
		if request.session['username']==0:
			return render(request, 'login.html', {"username" : 0})
			#PRIVIUS LOGIN IS LOGED OUT
		else:
			#user still login
			username = request.session['username']
			return render(request, 'profile.html', {"username" : username})
	else:
		return render(request, 'login.html', {"username" : 0})
def validate_login(request,u,p):
		return 1
		conn = db.connect('hos_data.db')
		#con.isolation_level = None
		c = conn.cursor()

		q ="select * from users where username = '"+str(u)+"' and password = '"+str(p)+"'";
		count=0
		id=0
		hos_id=0
		for row in c.execute(q):
			count=count+1
			hos_id=row[4]
			id=row[0]
		request.session['id'] = id		
		request.session['hos_id'] = hos_id
		print('login success as ',id,hos_id);
		conn.close()	
		if(count==0):
			return 0
		else:
			return 1
			
			
def is_login(request):
	if(request.session.has_key('username')):
		if request.session['username']==0:
			#recently logout
			return 1
		else:
			#still login
			return 0
	else:
		#not login
		return 1