from users.find_search_friend import *
from users.login_dignups import *
from django.shortcuts import render
import sqlite3 as db
import os
import json
# Create your views here.
from django.http import HttpResponse , HttpResponseRedirect
from django.shortcuts import render

# Create your views here.


def initiate(request):
    my_id=request.session['u_id']

    conn=db.connect('sqlite3_manager/db')	
    c = conn.cursor()
    c2 = conn.cursor()

    q1="select u.id from users u,friend f  where ((u.id=f.f_id and f.t_id="+str(my_id)+") or (u.id=f.t_id and f.f_id="+str(my_id)+")) and status = 1 order by f.id desc" #from others to me
    friend=[]
    for i in c.execute(q1):
        print(i)
        friend.append(str(i[0]))
    friend.append(str(my_id))	
    request.session['friends']=','.join(friend)	
    data=[]
    q="select * from post where u_id in ("+request.session['friends']+") order by id desc limit 25"
    for row in c.execute(q):
        data2=list(row)
        u=str(data2[1])
        frnd="select u.fname,u.lname,pc.pic_url from users u,pics pc where u.id="+u+" and u.id=pc.u_id"
        for frnd_i in c2.execute(frnd):
            print(frnd_i)
            data2=data2+list(frnd_i)
        data.append(data2)
    conn.close()
    if(len(data)!=0):
        request.session['last_fetch_post_id']=data[-1][0]	
    return HttpResponse(json.dumps(data), content_type="application/json")
	
def post(request):
    conn=db.connect('sqlite3_manager/db')	
    c = conn.cursor()
    c2 = conn.cursor()
    q="select * from post where u_id in ("+request.session['friends']+") and id <"+str(request.session['last_fetch_post_id'])+" order by id desc limit 250"
    data=[]
    for row in c.execute(q):
        data2=list(row)
        u=str(data2[1])
        frnd="select u.fname,u.lname,pc.pic_url from users u,pics pc where u.id="+u+" and u.id=pc.u_id"
        print(1)
        for frnd_i in c2.execute(frnd):
            print(frnd_i)
            data2=data2+list(frnd_i)
            print("@",data2)
        data.append(data2)
    if(len(data)!=0):
        request.session['last_fetch_post_id']=data[-1][0]
    conn.close()
    return HttpResponse(json.dumps(data), content_type="application/json")

	
	
	
	
	
	
	
	
	
	
	