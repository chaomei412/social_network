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
from bson import ObjectId

def initiate(request):
    my_id=request.session['u_id']

    myclient = pymongo.MongoClient('mongodb://localhost:27017/')
    mydb = myclient['social_network']
    mycol = mydb["users"]
    friends=mydb["friends"]




    friend=[]
    friend_int=[]

    print("F.R.I.E.N.D.S.: ",friend)

    q1={"friend_id":my_id,"status":1}

    print("friens query: ",q1)
    for i in friends.find(q1):
        friend.append(i["user_id"])
        friend_int.append(i["user_id"])
    print("F.R.I.E.N.D.S.: ",friend)

    q2={"user_id":my_id,"status":1}
    print("friens query: ",q2)    
    for i in friends.find(q2):
        friend.append(i["friend_id"])
        friend_int.append(i["friend_id"])
    print("F.R.I.E.N.D.S.: ",friend)

    friend.append(my_id)	
    friend_int.append(my_id)

    print("F.R.I.E.N.D.S.: ",friend)

    request.session['friends']=','.join(friend)	
    data=[]

    mycol = mydb["post"]
    users=mydb["users"]
    like_dislike=mydb["like_dislike"]
    comments=mydb["comments"]


    q={"user_id":{"$in":friend_int}}
    x = mycol.find(q)#all post loaded directly we can use .limit()  insted to use next post function to load posts in bunch

    for row in x: 
        frnd={"_id":object_id(row["user_id"])}#need to focus here later on pastly it save int of autoincrement of sqlite now on it has to save user _id
        select={"f_name":1,"l_name":1,"pic_url":1}
        xxx=users.find_one(frnd,select)
        row["f_name"]=xxx["f_name"]
        row["l_name"]=xxx["l_name"]
        row["pic_url"]=xxx["pic_url"]

        #add no of likes
        lks={"post_id":str(row["_id"]),"action":1}
        row["likes_count"]=like_dislike.find(lks).count()
        
        #no of dislike
        dslks={"post_id":str(row["_id"]),"action":1}
        row["dislikes_count"]=like_dislike.find(dslks).count()
        
        #am i like/dislike this ?
        ami={"post_id":str(row["_id"]),"user_id":my_id}
        select={"action":1}
        row["am_i"]=like_dislike.find_one(ami,select)
        #add no of comments
        cmnts={"post_id":str(row["_id"])}
        row["comments_count"]=comments.find(cmnts).count()
        row["_id"]=str(row["_id"])
        data.append(row)

    #below use for load n post at time
    '''if(len(data)!=0):
        request.session['last_fetch_post_id']=data[-1][0]
    print(data)
    for i in range(len(data)):
        data[i][0]["_id"]=str(data[i][0]["_id"])
    print(data)'''    
    return HttpResponse(json.dumps(data, default=str), content_type="application/json")


def post(request):
    my_id=request.session['u_id']
    conn=db.connect('sqlite3_manager/db')
    c = conn.cursor()
    c2 = conn.cursor()
    q="select * from post where u_id in ("+request.session['friends']+") and id <"+str(request.session['last_fetch_post_id'])+" order by id desc limit 250"
    
        
    for row in c.execute(q):
        data2=list(row)
        u=str(data2[1])
        frnd="select u.fname,u.lname,pc.pic_url from users u,pics pc where u.id="+u+" and u.id=pc.u_id"
        for frnd_i in c2.execute(frnd):
            data2=data2+list(frnd_i)
            
        #add no of likes
        lks="select count(id) from like_dislike where p_id='"+str(row['_id'])+"' and action=0"
        for lkss in c2.execute(lks):
            data2=data2+list(lkss)

        #check is any entry present of same user for same post if yes which is it like
        q="select action from like_dislike where u_id="+str(my_id)+" and p_id='"+str(row['_id'])+"'"
        status=-1
        for row in c2.execute(q):
            status=row[0]
        data2.append(status)
        
        
        
        #add no of comments
        lks="select count(id) from comment where p_p_id='"+str(row['_id'])+"'"
        for lkss in c2.execute(lks):
            data2=data2+list(lkss)
            
        data.append(data2)
    if(len(data)!=0):
        request.session['last_fetch_post_id']=data[-1][0]
    conn.close()

    for i in range(len(data)):
        data[i][0]["_id"]=str(data[i][0]["_id"])

    return HttpResponse(json.dumps(data, default=str), content_type="application/json")

from bson import Binary, Code
from bson.json_util import dumps


def dis_like_this(request):
    myclient = pymongo.MongoClient('mongodb://localhost:27017/')
    mydb = myclient['social_network']
    mycol = mydb["like_dislike"]
    post=mydb["post"]
    like_dislike=mydb["like_dislike"]
    my_id=request.session['u_id']
    post_id=request.GET.get('id') #str of posts._id
    post_user_id=post.find_one({"_id":object_id(post_id)},{"user_id":1})["user_id"]

    #constrents:
    #1. is the post owner is my friend
    #check is request is valid means is that post is of that person who is in current users friend list or not he can only able to like or comment post if he bellong as a friend
   
    if( is_my_friend(my_id,post_user_id)==0):
        return HttpResponse(json.dumps({"action":"not a friend"}), content_type="application/json")                  
      
    if(is_post_exist(post_id)==0):
        return HttpResponse(json.dumps({"action":"invalid post"}), content_type="application/json")

    
        
        
    #check is any entry present of same user for same post if yes which is it like or dislike
    q={"user_id":my_id,"post_id":post_id}
    if(like_dislike.find_one(q,{"action"})!=None):
        status=like_dislike.find_one(q,{"action"})["action"]

        if(status==0):
            #user allready dislike this post remove like entry {acction:0}
            like_dislike.remove(q)
        else:
            #user like this post at past update as dislike:{action:1}
            q2={"$set":{"action":0}}
            like_dislike.update_one(q,q2)
    else:
        #addnew entry
        q["action"]=1        
        like_dislike.insert_one(q)

    return HttpResponse(json.dumps({"key":"ok"}), content_type="application/json") 

def is_my_friend(my_id,friend_id):
    print("my id: ",my_id)
    print("friend_id: ",friend_id)
    myclient = pymongo.MongoClient('mongodb://localhost:27017/')
    mydb = myclient['social_network']
    friends=mydb["friends"]
    q={"$or":[{"user_id":my_id,"friend_id":friend_id,"status":1},{"user_id":friend_id,"friend_id":my_id,"status":1}]}
    if(friends.find(q).count()>0):
        return 1
    else:
        return 0


def is_post_exist(post_id):
    myclient = pymongo.MongoClient('mongodb://localhost:27017/')
    mydb = myclient['social_network']
    friends=mydb["post"]
    q={"_id":object_id(post_id)}
    if(friends.find(q).count()>0):
        return 1
    else:
        return 0

def like_this(request):
    myclient = pymongo.MongoClient('mongodb://localhost:27017/')
    mydb = myclient['social_network']
    mycol = mydb["like_dislike"]
    post=mydb["post"]
    like_dislike=mydb["like_dislike"]
    my_id=request.session['u_id']
    post_id=request.GET.get('id') #str of posts._id
    post_user_id=post.find_one({"_id":object_id(post_id)},{"user_id":1})["user_id"]

    #constrents:
    #1. is the post owner is my friend
    #check is request is valid means is that post is of that person who is in current users friend list or not he can only able to like or comment post if he bellong as a friend
   


    if( is_my_friend(my_id,post_user_id)==0):
        if((my_id!=post_user_id)):
             #second is also not own post
            return HttpResponse(json.dumps({"action":"not a friend"}), content_type="application/json")                  
      
    if(is_post_exist(post_id)==0):
        return HttpResponse(json.dumps({"action":"invalid post"}), content_type="application/json")

    
        
        
    #check is any entry present of same user for same post if yes which is it like or dislike
    q={"user_id":my_id,"post_id":post_id}
    if(like_dislike.find_one(q,{"action"})!=None):
        status=like_dislike.find_one(q,{"action"})["action"]

        if(status==1):
            #user allready like this post remove like entry {acction:0}
            like_dislike.remove(q)
        else:
            #user dislike at pats this post update as like:{action:1}
            q2={"$set":{"action":1}}
            like_dislike.update_one(q,q2)
    else:
        #no entry add new
        q["action"]=1        
        like_dislike.insert_one(q)

    return HttpResponse(json.dumps({"key":"ok"}), content_type="application/json") 

def comment(request):
    my_id=request.session['u_id']

    post_id=request.POST.get("p_id")




    myclient = pymongo.MongoClient('mongodb://localhost:27017/')
    mydb = myclient['social_network']

    post=mydb["post"]
    comments=mydb["comments"]
    post_user_id=post.find_one({"_id":object_id(post_id)},{"user_id":1})["user_id"]

    #constrents:
    #1. is the post owner is my friend
    #check is request is valid means is that post is of that person who is in current users friend list or not he can only able to like or comment post if he bellong as a friend
   


    if( is_my_friend(my_id,post_user_id)==0):
        if((my_id!=post_user_id)):
             #second is also not own post
            return HttpResponse(json.dumps({"action":"not a friend"}), content_type="application/json")                  
      
    if(is_post_exist(post_id)==0):
        return HttpResponse(json.dumps({"action":"invalid post"}), content_type="application/json")

        
    comment=request.POST.get("comment")
    date=request.POST.get("date")
    
    #create table comment(id integer primary key,u_id integer,p_p_id,p_c_id,comment text,date text)
    q={"post_id":post_id,"date_time":date,"user_id":my_id,"comm_content":comment}
    comments.insert_one(q)

    
    data={}
    users=mydb["users"]
    q={"_id":object_id(my_id)}
    select={"f_name":1,"l_name":1}
     
    
    i=users.find_one(q,select)
    data['commenter']=i["f_name"]+" "+i["l_name"]

    data['post_id']=post_id
    data['comment']=comment
    data['date']=date
    return HttpResponse(json.dumps(data), content_type="application/json")
     
     
def load_comments(request):
    my_id=request.session['u_id']


    myclient = pymongo.MongoClient('mongodb://localhost:27017/')
    mydb = myclient['social_network']

    post=mydb["post"]
    comments=mydb["comments"]
    users=mydb["users"]

    post_id=request.GET.get("p_id")

    #check is request is valid means is that post is of that person who is in current users friend list or not he can only able to like or comment post if he bellong as a friend
    post_user_id=post.find_one({"_id":object_id(post_id)},{"user_id":1})["user_id"]

    #constrents:
    #1. is the post owner is my friend
    #check is request is valid means is that post is of that person who is in current users friend list or not he can only able to like or comment post if he bellong as a friend
   


    if( is_my_friend(my_id,post_user_id)==0):
        if((my_id!=post_user_id)):
             #second is also not own post
            return HttpResponse(json.dumps({"action":"not a friend"}), content_type="application/json")                  
      
    if(is_post_exist(post_id)==0):
        return HttpResponse(json.dumps({"action":"invalid post"}), content_type="application/json")

    #create table comment(id integer primary key,u_id integer,p_p_id,p_c_id,comment text,date text)
    q={"post_id":post_id}
    select={"user_id":1,"comm_content":1,"date_time":1}

    Comments=[]
    for row in comments.find(q,select).sort("_id", pymongo.DESCENDING):
        data={}
        q={"_id":object_id(row["user_id"])}
        select={"f_name":1,"l_name":1}
        i=users.find_one(q,select)
        data['commenter']=i["f_name"]+" "+i["l_name"]
        data['post_id']=post_id
        data['comment']=row["comm_content"]
        data['date']=row["date_time"]
        Comments.append(data)    
    return HttpResponse(json.dumps(Comments), content_type="application/json")
     
