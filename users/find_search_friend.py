import sqlite3 as db
import json
from django.http import HttpResponse , HttpResponseRedirect
print("import success !!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
def find_friend(request):
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
			if t not in data and t[0] != my_id:#avoid repetaion of result
				data.append(t[1:])
	conn.close()
	print(data)
	return HttpResponse(json.dumps(data), content_type="application/json")
def search_friend(request):
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
		q2="select u.id,u.fname,u.lname,pc.pic_url from users u,passwords p,pics pc where  u.id=p.u_id and u.id=pc.u_id	and (u.fname like '"+str(q)+"%' or u.lname like '"+str(q)+"%') limit 50"
		for i in c.execute(q2):
			t=list(i)
			if t not in data and t[0] != my_id:#avoid repetaion of result
				data.append(t)
	conn.close()
	print(data)
	return HttpResponse(json.dumps(data), content_type="application/json")
	
def my_friends(request):
	my_id=str(request.session['u_id'])
	conn=db.connect('sqlite3_manager/db')	
	c = conn.cursor()
	data=[]
	q1="select u.id,u.fname,u.lname,p.pic_url from users u,pics p,friend f  where u.id=f.f_id and f.t_id="+my_id+" and u.id=p.u_id order by f.status asc"

	for i in c.execute(q1):
		t=list(i)
		data.append(t+[3])
	q2="select u.id,u.fname,u.lname,p.pic_url,f.status from users u,pics p,friend f  where u.id=f.t_id and f.f_id="+my_id+" and u.id=p.u_id order by f.status asc"
	for i in c.execute(q2):
		t=list(i)
		data.append(t)
	conn.close()
	print(data)
	return HttpResponse(json.dumps(data), content_type="application/json")
	
def add_friend(request):
	my_id=str(request.session['u_id'])
	to=request.POST.get('id')
	conn=db.connect('sqlite3_manager/db')	
	c = conn.cursor()
	data=[]
	q2="insert into friend values(null,"+my_id+","+to+",0)"
	print(q2)
	c.execute(q2)
	conn.commit()
	conn.close()
	return HttpResponse(json.dumps(data), content_type="application/json")



