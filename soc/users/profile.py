import sqlite3 as db
from django.shortcuts import render, redirect  
import json
from bson.objectid import ObjectId as object_id
from django.http import HttpResponse , HttpResponseRedirect
from datetime import date
import pymongo
def profile(request):

    myclient = pymongo.MongoClient('mongodb://localhost:27017/')
    mydb = myclient['social_network']
    users=mydb["users"]
    session = mydb["session"]
    post=mydb["post"]
    mydb2 = myclient['webhost']
    my_ipv6=mydb2["my_ipv6"]

    data={}
    


    #in future add current age of that user
        




    #select no of posts
    user_id=request.GET.get("id")
    data=users.find_one({"_id":object_id(user_id)},{"pass_d":0})
    data["_id"]=str(data["_id"])

    q={"user_id":user_id}
    data['post_count']=post.count_documents(q)


    #select no of comments
    comments=mydb["comments"]
    q={"user_id":user_id}

    data['comments_count']=comments.count_documents(q)
 

    #select no of likes
    likes=mydb["like_dislike"]
    data['like_count']=likes.count_documents(q)



    

    #select no of likes to this users post

    #1. get user post ids

    post_ids=[]
    for i in post.find(q,{"id":1}):
        post_ids.append(str(i["_id"])) 
    q={}
    data['own_like_count']=likes.count_documents({"post_id": { "$in": post_ids },"action":1})


    #select no of comments to this users post
    data['own_comment_count']=comments.count_documents({"post_id": { "$in": post_ids }})

    #data=json.dumps(data)
    #return HttpResponse(data, content_type='application/json')
    return render(request, 'account.html', {"data" : data})
    #return HttpResponse(json.dumps(data), content_type="application/json")

    