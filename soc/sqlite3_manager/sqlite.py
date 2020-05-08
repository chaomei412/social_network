'''create table users(id integer primary key,u_id varchar(25),dob varchar(8),fname varchar(25),lname varchar(25),pic varchar(25),gender integer,religion_id integer,address_id integer)'''

import sqlite3
db=input("enter database name")
fo=open(db+".queries","a")

conn=sqlite3.connect(db)
cur=conn.cursor()
q=""
while(1):
	try:
		q=input("enter query")
		if(q=="exit"):
			break
		elif(q==""):
			continue
		fo.write(q+"\n")
		for i in cur.execute(q):
			print(i)
		conn.commit()
	except sqlite3.OperationalError as s:
		print("sql error",s)
		fo.write("sql error:"+str(s)+"\n")
	except Exception as e:
		print("error "+e)
fo.close()