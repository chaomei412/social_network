import sqlite3 as db
import json
from django.http import HttpResponse , HttpResponseRedirect
from bson.objectid import ObjectId as object_id
def find_friend(request):
	#show sugestions while typing query in search box

	q=request.POST.get('query')
	q1=q.split(" ")

	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	mycol = mydb["users"]

	data=[]
	for q in q1:
		if(q==""):
			continue
		q2={'$or':[{'f_name':{'$regex':'^'+q}},{'l_name':{'$regex':'^'+q}}]}
		q2=mycol.find(q2)
		for i in q2:
			i["_id"]=str(i["_id"])
			data.append(i)

	return HttpResponse(json.dumps(data), content_type="application/json")


import pymongo

def search_friend(request):
	#search for actual query or seected suggested query by user in db and show users with full name and icons and buttons

	my_id=request.session['u_id']
	q=request.POST.get('query')
	q1=q.split(" ")
	
	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	mycol = mydb["users"]
	friends=mydb["friends"]

	data=[]
	for q in q1:
		if(q==""):
			continue
		status=-1
		q2={'$or':[{'f_name':{'$regex':'^'+q}},{'l_name':{'$regex':'^'+q}}]}
		for i in mycol.find(q2):
			status=4#initially not friend "add friend"
			q3={"user_id":object_id(my_id),"friend_id":i["_id"]} #from me
			for j in friends.find(q3):
				status=j["status"]
				if(status==0):
					status=0;#requested by me not accepted yet by him "requested"
				if(status==1):
					status=1;#accepted by him "friends"
				if(status==2):
					status=2#i block him "unblock"
				
			q3={"friend_id":object_id(my_id),"user_id":i["_id"]} #from him	
			for j in friends.find(q3):
				status=j[0]
				if(status==0):
					status=3;#requested by him not accepted  by me "accept"
				if(status==1):
					status=1;#accepted by me allready "friends"
				if(status==2):
					#second useer block me so i cant see him ""
					continue;#skip to show this user
			i["status"]=status#add that user status
			if i not in data:#avoid repetition of result
				i["_id"]=str(i["_id"])
				data.append(i)
	return HttpResponse(json.dumps(data), content_type="application/json")
	
def my_friends(request):
	my_id=request.session['u_id']
	
	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	mycol = mydb["users"]
	friends=mydb["friends"]
	
	data=[]

	#friend made by me
	q1={"user_id":object_id(my_id)} #from m
	
	for i in friends.find(q1):
		status=i["status"]
		if(status==0):
			status=3;#requested by him not accepted  by me "accept"
		if(status==1):
			status=1;#accepted by me allready "friends"
		if(status==2):
			#second useer block me so i cant see him ""
			continue;#skip to show this user
		i["status"]=status
		data.append(i)

	#friend made  me a friend	
	q2={"friend_id":object_id(my_id)} #from m
	for i in friends.find(q2):
		status=i["status"]
		if(status==0):
			status=0;#requested by me not accepted yet by him "requested"
		if(status==1):
			status=1;#accepted by him "friends"
		if(status==2):
			status=2#i block him "unblock"
		i["status"]=status
		data.append(i)

	return HttpResponse(json.dumps(data), content_type="application/json")
	
def add_friend(request):
	#send friend request
	my_id=str(request.session['u_id'])
	to=request.POST.get('id')
	if(my_id==to):
		return HttpResponse(json.dumps({}), content_type="application/json")#error of self request
	
	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	mycol = mydb["users"]
	friends=mydb["friends"]

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
	
	
	
	
	
	
	
	
	
	
	
	