from users.find_search_friend import *
from users.login_dignups import *
from django.shortcuts import render
import sqlite3 as db
import os
import json
import pprint
# Create your views here.
from django.http import HttpResponse , HttpResponseRedirect
from django.shortcuts import render
import pymongo
# Create your views here.


def initiate(request):
	my_id=request.session['u_id']

	conn=db.connect('sqlite3_manager/db')	
	c = conn.cursor()
	c2 = conn.cursor()	
	q1="select u.id from users u,friend f  where ((u.id=f.f_id and f.t_id="+str(my_id)+") or (u.id=f.t_id and f.f_id="+str(my_id)+")) and status = 1 order by f.id desc" 



	#from others to me

	friend=[]
	friend_int=[]
	for i in c.execute(q1):
		friend.append(str(i[0]))
		friend_int.append(i[0])
	friend.append(str(my_id))	
	friend_int.append(my_id)
	request.session['friends']=','.join(friend)	
	data=[]


	q={}
	q["u_id"]={"$in":friend_int}
	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	mycol = mydb["post"]
	x = mycol.find(q)
	for row in x:
		data2=[row]#add document of post details in list
		print(data2)
		'''   $$$$$$$$$$$$$$    modified here    $$$$$$$$$$$$$$$$$$$$'''
		#u=str(data2[1])
		frnd="select u.fname,u.lname,pc.pic_url from users u,pics pc where u.id="+row['u_id']+" and u.id=pc.u_id"
		for frnd_i in c2.execute(frnd):
			data2=data2+list(frnd_i)
		#add no of likes
		lks="select count(id) from like_dislike where p_id="+str(row['_id'])+" and action=0"
		for lkss in c2.execute(lks):
			data2=data2+list(lkss)
		#check is any entry present of same user for same post if yes which is it like
		q="select action from like_dislike where u_id="+str(my_id)+" and p_id="+str(data2[0])
		status=-1
		for row in c2.execute(q):
			status=row[0]
		data2.append(status)

		#add no of comments
		lks="select count(id) from comment where p_p_id="+str(data2[0])
		for lkss in c2.execute(lks):
			data2=data2+list(lkss)
		
			
		data.append(data2)
	conn.close()
	if(len(data)!=0):
		request.session['last_fetch_post_id']=data[-1][0]	
	return HttpResponse(json.dumps(data), content_type="application/json")
	
def post(request):
    my_id=request.session['u_id']
    conn=db.connect('sqlite3_manager/db')	
    c = conn.cursor()
    c2 = conn.cursor()
    q="select * from post where u_id in ("+request.session['friends']+") and id <"+str(request.session['last_fetch_post_id'])+" order by id desc limit 250"
    data=[]
    for row in c.execute(q):
        data2=list(row)
        u=str(data2[1])
        frnd="select u.fname,u.lname,pc.pic_url from users u,pics pc where u.id="+u+" and u.id=pc.u_id"
        for frnd_i in c2.execute(frnd):
            data2=data2+list(frnd_i)
            
        #add no of likes
        lks="select count(id) from like_dislike where p_id="+str(data2[0])+" and action=0"
        for lkss in c2.execute(lks):
            data2=data2+list(lkss)

        #check is any entry present of same user for same post if yes which is it like
        q="select action from like_dislike where u_id="+str(my_id)+" and p_id="+str(data2[0])
        status=-1
        for row in c2.execute(q):
            status=row[0]
        data2.append(status)
        
        
        
        #add no of comments
        lks="select count(id) from comment where p_p_id="+str(data2[0])
        for lkss in c2.execute(lks):
            data2=data2+list(lkss)
            
        data.append(data2)
    if(len(data)!=0):
        request.session['last_fetch_post_id']=data[-1][0]
    conn.close()
    return HttpResponse(json.dumps(data), content_type="application/json")
def dis_like_this(request):
    my_id=request.session['u_id']
    post_id=request.GET.get('id')
    print(post_id)

    conn=db.connect('sqlite3_manager/db')	
    c = conn.cursor()
    c2 = conn.cursor()

    #check is any entry present of same user for same post if yes which is it like or dislike
    q="select action from like_dislike where u_id="+str(my_id)+" and p_id="+str(post_id)
    status=-1
    for row in c.execute(q):
        status=row[0]
    if(status==-1):
        #user has no entry for that post
        #add entry as dislike
        q="insert into like_dislike values(null,"+str(my_id)+","+str(post_id)+",1,'20-08-1997')"
        c.execute(q)
        conn.commit()
    elif(status==1):
        #user allready dis_likes this post remove dislikes entry
        q="delete from like_dislike where u_id="+str(my_id)+" and p_id="+str(post_id)
        c.execute(q)
        conn.commit()
    else:
        #user dislike this post update as dislike
        q="update like_dislike set action=1 where u_id="+str(my_id)+" and p_id="+str(post_id)
        c.execute(q)
        conn.commit()
    conn.close()
    return HttpResponse(json.dumps({"key":"disllikeok"}), content_type="application/json")

def like_this(request):
    my_id=request.session['u_id']
    post_id=request.GET.get('id')
    print(post_id)
    




    conn=db.connect('sqlite3_manager/db')	
    c = conn.cursor()
    c2 = conn.cursor()

    #check is request is valid means is that post is of that person who is in current users friend list or not he can only able to like or comment post if he bellong as a friend
    valid=-1
    q="select u_id from post where id="+str(post_id)
    for row in c.execute(q):
        valid=row[0]
    if(valid==-1):
        #invalid attempt to like 
        return HttpResponse(json.dumps({"action":"invalid post"}), content_type="application/json")
    frnds=request.session['friends'].split(",")
    print("valid ",valid)
    print("friends",frnds)
    if(str(valid) not in frnds):
        if(valid!=my_id):#even if this is not own post
            return HttpResponse(json.dumps({"error":"not a friend"}), content_type="application/json")
        
        
    #check is any entry present of same user for same post if yes which is it like or dislike
    q="select action from like_dislike where u_id="+str(my_id)+" and p_id="+str(post_id)
    status=-1
    for row in c.execute(q):
        status=row[0]
    if(status==-1):
        #user has no entry for that post
        #add entry as like
        q="insert into like_dislike values(null,"+str(my_id)+","+str(post_id)+",0,'20-08-1997')"
        c.execute(q)
        conn.commit()
    elif(status==0):
        #user allready like this post remove like entry
        q="delete from like_dislike where u_id="+str(my_id)+" and p_id="+str(post_id)
        c.execute(q)
        conn.commit()
    else:
        #user dislike this post update as like
        q="update like_dislike set action=0 where u_id="+str(my_id)+" and p_id="+str(post_id)
        c.execute(q)
        conn.commit()
    conn.close()
    return HttpResponse(json.dumps({"key":"ok"}), content_type="application/json")
    
    
def comment(request):
    my_id=request.session['u_id']
    conn=db.connect('sqlite3_manager/db')	
    c = conn.cursor()
    post_id=request.POST.get("p_id")

    #check is request is valid means is that post is of that person who is in current users friend list or not he can only able to like or comment post if he bellong as a friend
    valid=-1
    q="select u_id from post where id="+str(post_id)
    for row in c.execute(q):
        valid=row[0]
    if(valid==-1):
        #invalid attempt to like 
        return HttpResponse(json.dumps({"action":"invalid post"}), content_type="application/json")
    frnds=request.session['friends'].split(",")
    print(valid)
    print(frnds)
    if(str(valid) not in frnds):
        return HttpResponse(json.dumps({"error":"not a friend"}), content_type="application/json")


    

        
    comment=request.POST.get("comment")
    date=request.POST.get("date")
    my_id=request.session['u_id']
    #create table comment(id integer primary key,u_id integer,p_p_id,p_c_id,comment text,date text)
    q="insert into comment values (null,"+str(my_id)+","+str(post_id)+",0,'"+comment+"','"+date+"')"
    c.execute(q)
    conn.commit()
    
    data={}
    
    q="select fname,lname from users where id="+str(my_id)
    
    for i in c.execute(q):
        data['commenter']=i[0]+i[1]
    conn.close()
    data['post_id']=post_id
    data['comment']=comment
    data['date']=date
    return HttpResponse(json.dumps(data), content_type="application/json")
     
     
def load_comments(request):
    my_id=request.session['u_id']
    conn=db.connect('sqlite3_manager/db')	
    c = conn.cursor()
    c2=conn.cursor()
    post_id=request.GET.get("p_id")

    #check is request is valid means is that post is of that person who is in current users friend list or not he can only able to like or comment post if he bellong as a friend
    valid=-1
    q="select u_id from post where id="+str(post_id)
    for row in c.execute(q):
        valid=row[0]
    if(valid==-1):
        #invalid attempt to comment 
        return HttpResponse(json.dumps({"action":"invalid post"}), content_type="application/json")
    frnds=request.session['friends'].split(",")
    print(valid)
    print(frnds)
    if(str(valid) not in frnds):
        return HttpResponse(json.dumps({"error":"not a friend"}), content_type="application/json")


    my_id=request.session['u_id']
    #create table comment(id integer primary key,u_id integer,p_p_id,p_c_id,comment text,date text)
    q="select u_id,comment,date from comment where p_p_id="+str(post_id)+" order by id desc"
    comments=[]
    for row in c.execute(q):
        data={}
        q="select fname,lname from users where id="+str(row[0])    
        for j in c2.execute(q):
            data['commenter']=j[0]+j[1]
        data['post_id']=post_id
        data['comment']=row[1]
        data['date']=row[2]
        comments.append(data)    
    return HttpResponse(json.dumps(comments), content_type="application/json")
     
