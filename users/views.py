from users.find_search_friend import *
from users.login_dignups import *
from django.shortcuts import render, redirect  
import os
from django.contrib.staticfiles.storage import staticfiles_storage
import sqlite3 as db
def main(request):
    if (not is_login(request)):#is user not login
        return render(request, 'login.html', {"username" : 0})
    #user is loogin
    conn=db.connect('sqlite3_manager/db')	
    c = conn.cursor()
    id = request.session['u_id']
    q="select u.fname,u.lname,pc.pic_url from users u,passwords p,pics pc where u.id='"+str(id)+"' and u.id=p.u_id and u.id=pc.u_id"
    #pic varchar(25),gender integer,religion_id integer,address_id integer)
    data=-1
    for i in c.execute(q):
        data=list(i)
    conn.close()
    return render(request,'main.html',{"data":data})	
    #return HttpResponse("hi"+str(username))

