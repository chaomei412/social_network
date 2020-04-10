import sqlite3 as db
import json
from django.http import HttpResponse , HttpResponseRedirect
from bson.objectid import ObjectId as object_id
def find_friend(request):
	#mongo update success
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
	#mongo update success
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
			q3={"user_id":my_id,"friend_id":str(i["_id"])} #from me

			#check is entry exist in process
			for j in friends.find(q3):
				status=j["status"]
				if(status==0):
					status=0;#requested by me not accepted yet by him "requested"
				if(status==1):
					status=1;#accepted by him "friends"
				if(status==2):
					status=2#i block him "unblock"
				
			q3={"friend_id":my_id,"user_id":str(i["_id"])} #from him	
			for j in friends.find(q3):
				status=j["status"]
				if(status==0):
					status=3;#requested by him not accepted  by me "accept"
				if(status==1):
					status=1;#accepted by me allready "friends"
				if(status==2):
					#second useer block me so i cant see him ""
					continue;#skip to show this user
			i["status"]=status#add that user status
			
			
			i["_id"]=str(i["_id"])
			
			if i not in data:#avoid repetition of result	
				data.append(i)
	
	return HttpResponse(json.dumps(data), content_type="application/json")
	
def my_friends(request):
	#mongodb update success
	#load friend who are friend or requested me or requested by or blocked by me
	my_id=request.session['u_id']
	
	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	mycol = mydb["users"]
	friends=mydb["friends"]
	data=[]

	#friend made by me
	print("my id: ",my_id)

	q2={"user_id":my_id} #from m
	select={"_id":1,"friend_id":1,"status":1}
	for i in friends.find(q2,select):
		status=i["status"]
		if(status==0):
			status=0;#requested by me
		if(status==1):
			status=1;#accepted by me allready "friends"
		if(status==2):
			#second useer block me so i cant see him ""
			status=2

		user=mycol.find_one({"_id":object_id(i["friend_id"])})
		user["friend_id"]=str(i["friend_id"])
		user["status"]=i["status"]
		user["_id"]=str(user["_id"])
		data.append(user)

	#friend made  me a friend	
	q1={"friend_id":my_id} #from m
	select={"_id":1,"user_id":1,"status":1}
	for i in friends.find(q1,select):
		status=i["status"]
		if(status==0):
			status=3;#requested by me not accepted yet by him "requested"
		if(status==1):
			status=1;#accepted by me"
		if(status==2):
			status=2#i block by him
			continue
		i["_id"]=str(i["_id"])	
		i["status"]=status
		user=mycol.find_one({"_id":object_id(i["user_id"])})
		user["friend_id"]=str(i["user_id"])
		user["status"]=i["status"]
		user["_id"]=str(user["_id"])
		data.append(user)

	return HttpResponse(json.dumps(data), content_type="application/json")
import time	

def add_friend(request):
	#some bug as duplication on cross sc 
	#mongo update success
	#send friend request
	my_id=request.session['u_id'] #str of _id
	to=request.POST.get('id')
	if(my_id==to):
		return HttpResponse(json.dumps({}), content_type="application/json")#error of self request
	
	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	#mycol = mydb["users"]
	friends=mydb["friends"]

	q3={"$or":[{"user_id":my_id,"friend_id":to},{"user_id":to,"friend_id":my_id}]}
	select={"status:":1}
	i=friends.find(q3,select).count()
	if(i!=0):
		#allready requested be me or h or i block him or he block me or allready friend
		# not a valid request for add friend 
		return HttpResponse(json.dumps({"requested":0}), content_type="application/json")

	#add new entry as add friend as requested by me
	now = time.ctime(1586328464)
	# Wed Apr  8 08:47:44 2020
	q2={"user_id":my_id,"friend_id":to,"date":now,"status":0}
	friends.insert_one(q2)


	return HttpResponse(json.dumps({"requested":1}), content_type="application/json")
	
def	cancle_frindship(request):

	#remove frind or reject request
	my_id=request.session['u_id']   #str of users._id
	friend_id=request.POST.get('id')  #str of friends._id

	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	#mycol = mydb["users"]
	friends=mydb["friends"]

	q3={"$or":[{"friend_id":friend_id,"user_id": my_id},{"friend_id": my_id,"user_id":friend_id}]} # user id to modify only those entries made by me from me
	
	
	friends.remove(q3)

	return HttpResponse(json.dumps({"canceld":1}), content_type="application/json")



def accept_frindship(request):
	#accept friend request

	my_id=request.session['u_id']   #str of users._id
	friend_id=request.POST.get('id')  #str of friends._id

	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	#mycol = mydb["users"]
	friends=mydb["friends"]


	q3={"user_id":friend_id,"friend_id":my_id} #from me
	update={"status":1}

	friends.update_one(q3,{"$set":update})
	return HttpResponse(json.dumps({"accepted":1}), content_type="application/json")
	
	
	
	
	
	
	
	
	
	
	
	