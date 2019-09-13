import sqlite3 as db
import json
from django.http import HttpResponse , HttpResponseRedirect
def find_friend(request):
	#show sugestions while typing query in search box
	print("find_friend called")
	my_id=request.session['u_id']
	q=request.POST.get('query');
	print(q)
	q1=q.split(" ")
	conn=db.connect('sqlite3_manager/db')	
	c = conn.cursor()
	data=[]
	for q in q1:
		if(q==""):
			continue
		q2="select id,fname,lname from users where fname like '"+str(q)+"%' or lname like '"+str(q)+"%' limit 50"
		for i in c.execute(q2):
			t=list(i)
			if t[1:] not in data and t[0] != my_id:#avoid repetaion of result	
				data.append(t[1:])
	conn.close()
	print(data)
	return HttpResponse(json.dumps(data), content_type="application/json")
def search_friend(request):
	#search for actual query or seected suggested query by user in db and show users with full name and icons and buttons
	print("search_friend called");
	my_id=request.session['u_id']
	q=request.POST.get('query');
	q1=q.split(" ")
	conn=db.connect('sqlite3_manager/db')	
	c = conn.cursor()
	data=[]
	for q in q1:
		if(q==""):
			continue
		q2="select u.id,u.fname,u.lname,pc.pic_url from users u,passwords p,pics pc where  u.id=p.u_id and u.id=pc.u_id	and (u.fname like '"+str(q)+"%' or u.lname like '"+str(q)+"%') limit 50"
		for i in c.execute(q2):
			t=list(i)
			status=4#initially not friend "add friend"
			q3="select status from friend where f_id="+str(my_id)+" and t_id ="+str(t[0]) #from me
			for j in c.execute(q3):
				status=j[0]
				if(status==0):
					status=0;#requested by me not accepted yet by him "requested"
				if(status==1):
					status=1;#accepted by him "friends"
				if(status==2):
					status=2#i block him "unblock"
				
			q3="select status from friend where f_id="+str(t[0])+" and t_id ="+str(my_id) #from him	
			for j in c.execute(q3):
				status=j[0]
				if(status==0):
					status=3;#requested by him not accepted  by me "accept"
				if(status==1):
					status=1;#accepted by me allready "friends"
				if(status==2):
					#second useer block me so i cant see him ""
					continue;#skip to show this user
			t.append(status)#add that user status
			print("#",t)
			if t not in data and t[0] != my_id:#avoid repetition of result
				data.append(t)
	conn.close()
	return HttpResponse(json.dumps(data), content_type="application/json")
	
def my_friends(request):
	print("my_friends called")
	my_id=str(request.session['u_id'])
	conn=db.connect('sqlite3_manager/db')	
	c = conn.cursor()
	data=[]
	q1="select u.id,u.fname,u.lname,p.pic_url,f.status from users u,pics p,friend f  where u.id=f.f_id and f.t_id="+my_id+" and u.id=p.u_id order by f.status asc" #from others to me
	for i in c.execute(q1):
		t=list(i)
		status=t[-1]
		if(status==0):
			status=3;#requested by him not accepted  by me "accept"
		if(status==1):
			status=1;#accepted by me allready "friends"
		if(status==2):
			#second useer block me so i cant see him ""
			continue;#skip to show this user
		t[-1]=status
		data.append(t)
	q2="select u.id,u.fname,u.lname,p.pic_url,f.status from users u,pics p,friend f  where u.id=f.t_id and f.f_id="+my_id+" and u.id=p.u_id order by f.status asc"
	for i in c.execute(q2):
		t=list(i)
		status=t[-1]
		if(status==0):
			status=0;#requested by me not accepted yet by him "requested"
		if(status==1):
			status=1;#accepted by him "friends"
		if(status==2):
			status=2#i block him "unblock"
		t[-1]=status	
		data.append(t)
	conn.close()
	print(data)
	return HttpResponse(json.dumps(data), content_type="application/json")
	
def add_friend(request):
	#send friend request
	my_id=str(request.session['u_id'])
	to=request.POST.get('id')
	if(my_id==to):
		return HttpResponse(json.dumps({}), content_type="application/json")#error of self request
	conn=db.connect('sqlite3_manager/db')	
	c = conn.cursor()
	q3="select status from friend where (f_id="+str(my_id)+" and t_id ="+str(to)+") or (f_id="+str(to)+" and t_id ="+str(my_id)+")"
	for i in c.execute(q3):
		#if allready requested
		return HttpResponse(json.dumps({}), content_type="application/json")
	q2="insert into friend values(null,"+my_id+","+to+",0)"
	c.execute(q2)
	conn.commit()
	conn.close()
	return HttpResponse(json.dumps({}), content_type="application/json")
	
def	cancle_frindship(request):
	#remove frind or reject request
	my_id=str(request.session['u_id'])
	to=request.POST.get('id')
	if(my_id==to):
		return HttpResponse(json.dumps({}), content_type="application/json")#error of self request

	conn=db.connect('sqlite3_manager/db')	
	c = conn.cursor()
	q3="delete from friend where (f_id="+str(my_id)+" and t_id ="+str(to)+") or (f_id="+str(to)+" and t_id ="+str(my_id)+")" #from me
	c.execute(q3)
	conn.commit()
	conn.close()
	return HttpResponse(json.dumps({}), content_type="application/json")
def accept_frindship(request):
	#accept friend request
	my_id=str(request.session['u_id'])
	to=request.POST.get('id')
	if(my_id==to):
		return HttpResponse(json.dumps({}), content_type="application/json")#error of self request

	conn=db.connect('sqlite3_manager/db')	
	c = conn.cursor()
	q3="update friend set status= 1 where f_id="+str(to)+" and t_id ="+str(my_id) #from me
	c.execute(q3)
	conn.commit()
	conn.close()
	return HttpResponse(json.dumps({}), content_type="application/json")
	
	
	
	
	
	
	
	
	
	
	
	