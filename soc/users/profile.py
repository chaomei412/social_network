import sqlite3 as db
from django.shortcuts import render, redirect  
import json
from django.http import HttpResponse , HttpResponseRedirect
from datetime import date
def profile(request):
    conn=db.connect('sqlite3_manager/db')	
    c = conn.cursor()
    my_id=request.session['u_id']
    data={}
    q="select pic_url from pics where u_id="+str(my_id)
    #pic varchar(25),gender integer,religion_id integer,address_id integer)
    for i in c.execute(q):
        data['my_pic']=i[0]
    user_id=request.GET.get("id")
    
    
    
      #select personal info
    q="select fname,lname,dob,gender from users where id="+str(user_id)
    for row in c.execute(q):
        data['user_id']=user_id
        data['name']=list(row[0:2])
        data['dob']=[row[2][0:4],row[2][4:6],row[2][6:]]
        data['gender']=row[3]
        #in future add current age of that user
        
    #profile pic url    
    q="select pic_url from pics where u_id="+str(user_id)
    for row in c.execute(q):
        data['pic']=row[0]
    
    
    
    #select no of posts
    q="select count(id)  from post where u_id="+str(user_id)
    for row in c.execute(q):
        data['post_count']=row[0]
    
    #select no of comments
    q="select count(id)  from comment where u_id="+str(user_id)
    for row in c.execute(q):
        data['comments_count']=row[0]
    
    #select no of likes
    q="select count(id)  from like_dislike where u_id="+str(user_id)
    for row in c.execute(q):
        data['like_count']=row[0]
    


    #select no of likes to this users post
    q="select count(l.id)  from like_dislike l,post p where p.u_id="+str(user_id)+" and p.id=l.p_id"
    for row in c.execute(q):
        data['own_like_count']=row[0]
    

    #select no of comments to this users post
    q="select count(c.id)  from comment c,post p where p.u_id="+str(user_id)+" and p.id=c.p_p_id"
    for row in c.execute(q):
        data['own_comment_count']=row[0]
    return render(request, 'profile.html', {"data" : data})
    #return HttpResponse(json.dumps(data), content_type="application/json")
    