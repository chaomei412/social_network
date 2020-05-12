#net start MongoDB
import asyncio
import functools
import websockets
import json
import pymongo
from bson.objectid import ObjectId as object_id
import time
objs={}
from cryptography.fernet import Fernet
import re
def is_my_friend(my_id,friend_id):
    myclient = pymongo.MongoClient('mongodb://localhost:27017/')
    mydb = myclient['social_network']
    friends=mydb["friends"]
    q={"$or":[{"user_id":my_id,"friend_id":friend_id,"status":1},{"user_id":friend_id,"friend_id":my_id,"status":1}]}
    if(friends.find(q).count()>0):
        return 1
    else:
        return 0


def decode(data,key):
	cipher_suite = Fernet(key)
	return cipher_suite.decrypt(data)	

def register(obj,data):
	global objs
	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	mycol = mydb["session"]
	websocket=mydb["websocket"]
	if(websocket.find_one({"websocket":str(obj)})==None):
		#user does not have another active session
		q={"_id":object_id(data['key']),"username":data['user']}
		if(mycol.find(q)):
			#user has active entry in session valid 
			objs[str(obj)]=obj
			websocket.insert({"key":data["key"],"username":data["user"],"websocket":str(obj)})
			print("\n",websocket.find().count(), " users online ")
			print("\n",len(objs), " users online as per objs")
		else:
			print("not valid session found")	
	else:
		print("user_allready active session: ")





def unregiter(obj):
	global objs
	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	websocket=mydb["websocket"]
	websocket.remove({"websocket":str(obj)})
	print("\n",websocket.find().count(), " users online as per db")
	objs.pop(str(obj))
	print("\n",len(objs), " users online as per objs ")

async def typing(obj,data):
	global objs
	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	websocket=mydb["websocket"]


	if(data["section"]=="punlic_brodcast"):
		data["type"]="typing"
		data["content"]=websocket.find_one({"websocket":str(obj)})["username"]
		data=json.dumps(data)

		for usr in objs:
			if usr==str(obj):
				continue
			await objs[usr].send(json.dumps(data))

	elif(data["section"]=="p2p"):
		friend_user_name=data["friend"]	
		if(websocket.find_one({"username":friend_user_name})!=None):
			#send typing status if friend is online		
			data["friend"]=websocket.find_one({"websocket":str(obj)})["username"]
			#get only his object
			obj_key=websocket.find_one({"username":friend_user_name})["websocket"]
			await objs[obj_key].send(json.dumps(data))


async def brodcost(obj,message):

	global objs
	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	websocket=mydb["websocket"]
	
	sender=websocket.find_one({"websocket":str(obj)})["username"]
	message["sender"]=sender
	data=json.dumps(message)
	for usr in objs:
		if usr==str(obj):
			continue
		await objs[usr].send(data)

async def  meta(obj):
	global objs
	data={}
	data["type"]="meta"

	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	websocket=mydb["websocket"]

	data["count"]=len(objs)
	data["members"]=[]
		
	for i in websocket.find():
		data["members"].append(i["username"])

	data=json.dumps(data)
	await obj.send(data)


async def rules(obj):
	global objs
	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	websocket=mydb["websocket"]
	friends=mydb["friends"]
	users=mydb["users"]
	rules=mydb["rules"]
	user_name=websocket.find_one({"websocket":str(obj)})["username"]
	my_id=str(users.find_one({"u_name":user_name})["_id"])




	q={"user_id":my_id}
	rull=[]
	for i in  rules.find(q):
		i["_id"]=str(i["_id"])
		rull.append(i)
	print("#rules ",rull)




	friend=[]

	#ind({"$or":[{"sender_id":my_id,"receiver_id"

	q1={"$or":[{"friend_id":my_id,"status":1},{"friend_id":my_id,"status":2}]}
	for i in friends.find(q1):
		#check is that friend block by me
		if(friends.find_one({"user_id":my_id,"status":2,"friend_id":i["user_id"]})!= None):
			continue
		friend.append(users.find_one({"_id":object_id(i["user_id"])})["u_name"])

	q2={"user_id":my_id,"status":1}
	for i in friends.find(q2):
		
		uname=users.find_one({"_id":object_id(i["friend_id"])})["u_name"]
		if(uname not in friend):
			friend.append(uname)

	data={"type":"rules","rules":rull,"friends":friend}
	data=json.dumps(data)
	await obj.send(data)



async def  p2p(obj):
	global objs
	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	websocket=mydb["websocket"]
	friends=mydb["friends"]
	users=mydb["users"]
	user_name=websocket.find_one({"websocket":str(obj)})["username"]
	my_id=str(users.find_one({"u_name":user_name})["_id"])

	friend=[]

	#ind({"$or":[{"sender_id":my_id,"receiver_id"

	q1={"$or":[{"friend_id":my_id,"status":1},{"friend_id":my_id,"status":2}]}
	for i in friends.find(q1):
		#check is that friend block by me
		if(friends.find_one({"user_id":my_id,"status":2,"friend_id":i["user_id"]})!= None):
			continue
		friend.append(users.find_one({"_id":object_id(i["user_id"])})["u_name"])

	q2={"user_id":my_id,"status":1}
	for i in friends.find(q2):
		
		uname=users.find_one({"_id":object_id(i["friend_id"])})["u_name"]
		if(uname not in friend):
			friend.append(uname)


	q={"username":{"$in":friend}}
	select={"username":1}
	onlines=[]
	for u in websocket.find(q,select):
		onlines.append(u["username"])
	data={"type":"p2p_users_meta","friends":friend,"onlines":onlines}
	data=json.dumps(data)	
	await obj.send(data)






async def  blocked(obj,data):
	global objs
	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	websocket=mydb["websocket"]
	friends=mydb["friends"]
	users=mydb["users"]
	user_name=websocket.find_one({"websocket":str(obj)})["username"]
	my_id=str(users.find_one({"u_name":user_name})["_id"])

	friend=[]


	

	q2={"user_id":my_id,"status":2}
	for i in friends.find(q2):
		friend.append(users.find_one({"_id":object_id(i["friend_id"])})["u_name"])


	data={"type":"blocked","blocked":friend}
	data=json.dumps(data)
	await obj.send(data)



async def  update_meta(obj):
	global objs
	data={}
	data["type"]="meta"

	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	websocket=mydb["websocket"]
	data["count"]=len(objs)
	data["members"]=[]
		
	for i in websocket.find():
		data["members"].append(i["username"])
	data=json.dumps(data)
	for key in objs:
		try:
			await objs[key].send(data)
		except:
			pass


async def p2p_msg_load(obj,data):
	global objs
	#data={"type":"p2p_message","friend":"admin96","content"hi"}
	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	websocket=mydb["websocket"]
	
	#friends=mydb["friends"]
	users=mydb["users"]
	chats=mydb["chat_message"]
	#here my is a message sender
	#friend is message receiver

	my_user_name=websocket.find_one({"websocket":str(obj)})["username"]
	my_id=str(users.find_one({"u_name":my_user_name},{"_id":1})["_id"])
	friend_user_name=data["friend"]
	friend_id=str(users.find_one({"u_name":friend_user_name},{"_id":1})["_id"])


	#print("loading messages of ",my_user_name," ",friend_user_name)
	if(is_my_friend(my_id,friend_id)==0):
		#the receiver is not a friend just skip the processes
		#print("not a friend")
		return 0

	chat_data={}
	chat_data["type"]="p2p_message_load"
	chat_data["friend"]=data["friend"]
	chat_data["content"]=[]
	for row in chats.find({"$or":[{"sender_id":my_id,"receiver_id":friend_id},{"sender_id":friend_id,"receiver_id":my_id}]}):
		row["_id"]=str(row["_id"])

		if(row["sender_id"]==my_id):
			row["type"]="send"
		else:
			row["type"]="get"	

		chat_data["content"].append(row)
	#print("found chats data and sending as ",chat_data)	
	await obj.send(json.dumps(chat_data))	

def check_rule(msg,my_id,friend_user_name):


	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	rules=mydb["rules"]
	#"user_id" : "5e8764dd189928d6d5aa33e6", "rule_name" : "first rule", "for_" : "admin1", "rule_type" : "1", "rule" : "^gm$" }
	for rule in rules.find({"user_id":my_id,"for_":friend_user_name}):		 	
		found = re.findall(str(rule["rule"]), msg)
		if(len(found)>0):
			print(":) Match message:",msg,"Rule:",rule," For: ",friend_user_name)
			return 1#rule match spam

	for rule in rules.find({"user_id":my_id,"for_":"null"}):		 	
		found = re.findall(str(rule["rule"]), msg)
		if(len(found)>0):
			print(":) Match message:",msg,"Rule:",rule," For: ","All(null)")
			return 1#rule match spam

	print(":( Not Match message:",msg)
	return 0		#no match not a spam


async def p2p_msg_send(obj,data):
	#currently loading old messges using websocket it can loaded using ajax too if websocket gives
	global objs
	#data={"type":"p2p_message","friend":"admin96","content"hi"}
	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	websocket=mydb["websocket"]
	
	#friends=mydb["friends"]
	users=mydb["users"]
	chats=mydb["chat_message"]
	#here my is a message sender
	#friend is message receiver

	my_user_name=websocket.find_one({"websocket":str(obj)})["username"]
	my_id=str(users.find_one({"u_name":my_user_name},{"_id":1})["_id"])
	friend_user_name=data["friend"]
	friend_id=str(users.find_one({"u_name":friend_user_name},{"_id":1})["_id"])
	if(is_my_friend(my_id,friend_id)==0):
		#the receiver is not a friend just skip the processes
		#print("not a friend")
		return 0
	chat_save_data={}
	chat_save_data["sender_id"]=my_id
	chat_save_data["receiver_id"]=friend_id
	chat_save_data["message_content"]=data["content"]
	chat_save_data["send_time"]=time.asctime(time.localtime(time.time()))
	chat_save_data["spam"]=check_rule(data["content"],friend_id,my_user_name)	
	#if it found spam then it should not notify to user no show on p2p show in spam
	


	data["sender"]=my_user_name
	#we found object only if friend is online
	if(chat_save_data["spam"]==0):
		#send to user if not spam
		if(websocket.find({"username":data["friend"]}).count()==1):
			chat_save_data["deliver_time"]=time.asctime(time.localtime(time.time()))
			chat_save_data["status"]=1 #received by friend he is online
			user_websocket_object_key=websocket.find_one({"username":data["friend"]})["websocket"]
			await objs[user_websocket_object_key].send(json.dumps(data))
			#print("sending message ",data["content"]," from ",my_user_name," to ",data["friend"])
		else:
			chat_save_data["status"]=0 #send to friend he is not online
	else:
		chat_save_data["status"]=-1 #message is spamed		
	chats.insert_one(chat_save_data)

async def update_p2p_offline(obj):
	global objs
	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	websocket=mydb["websocket"]
	friends=mydb["friends"]
	users=mydb["users"]

	user_name=websocket.find_one({"websocket":str(obj)})["username"]
	
	my_id=str(users.find_one({"u_name":user_name})["_id"])

	friend=[]

	
	q1={"friend_id":my_id,"status":1}

	for i in friends.find(q1):
		friend.append(users.find_one({"_id":object_id(i["user_id"])})["u_name"])
	
	q2={"user_id":my_id,"status":1}
	for i in friends.find(q2):
		friend.append(users.find_one({"_id":object_id(i["friend_id"])})["u_name"])
	
	q={"username":{"$in":friend}}
	select={"websocket":1,"username":1}
	for u in websocket.find(q,select):
		data={"type":"p2p_ofline","username":user_name}
		try:
			await objs[u["websocket"]].send(json.dumps(data))
		except :
			pass
async def block(obj,data):
	global objs
	#data={"type":"p2p_message","friend":"admin96","content"hi"}
	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	websocket=mydb["websocket"]
	
	#friends=mydb["friends"]
	users=mydb["users"]
	friends=mydb["friends"]
	#here my is a message sender
	#friend is message receiver

	my_user_name=websocket.find_one({"websocket":str(obj)})["username"]
	my_id=str(users.find_one({"u_name":my_user_name},{"_id":1})["_id"])
	friend_user_name=data["friend"]
	friend_id=str(users.find_one({"u_name":friend_user_name},{"_id":1})["_id"])
	
	q={"user_id":my_id,"friend_id":friend_id}
	if(friends.find(q).count()>0):
		friends.find_one_and_update(q,{"$set":{"status":2}})
	else:
		q["status"]=2
		friends.insert_one(q)



async def unblock(obj,data):
	global objs
	#data={"type":"p2p_message","friend":"admin96","content"hi"}
	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	websocket=mydb["websocket"]
	
	#friends=mydb["friends"]
	users=mydb["users"]
	friends=mydb["friends"]
	#here my is a message sender
	#friend is message receiver

	my_user_name=websocket.find_one({"websocket":str(obj)})["username"]
	my_id=str(users.find_one({"u_name":my_user_name},{"_id":1})["_id"])
	friend_user_name=data["friend"]
	friend_id=str(users.find_one({"u_name":friend_user_name},{"_id":1})["_id"])
	
	q={"user_id":my_id,"friend_id":friend_id}
	if(friends.find(q).count()>0):
		friends.find_one_and_update(q,{"$set":{"status":1}})
	else:
		q["status"]=1
		friends.insert_one(q)

async def delete_rule(obj,data):
	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	websocket=mydb["websocket"]
	rules=mydb["rules"]
	users=mydb["users"]

	my_user_name=websocket.find_one({"websocket":str(obj)})["username"]
	my_id=str(users.find_one({"u_name":my_user_name},{"_id":1})["_id"])

	#my id is object id of rule definer and for is username of rule define for
	q={"_id":object_id(data["rule_id"]),"user_id":my_id}

	rules.remove(q)

async def add_rule(obj,data):
	# {"type":"add_rule","rule_name":"rule","for_":"null","rule_type":"4","rule":".*gm$"}
	

	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	websocket=mydb["websocket"]
	rules=mydb["rules"]
	users=mydb["users"]

	my_user_name=websocket.find_one({"websocket":str(obj)})["username"]
	my_id=str(users.find_one({"u_name":my_user_name},{"_id":1})["_id"])

	#my id is object id of rule definer and for is username of rule define for
	q={"user_id":my_id,"rule_name":data["rule_name"],"for_":data["for_"],"rule_type":data["rule_type"],"rule":data["rule"]}

	if(data["id"]!=""):
		rules.update_one({"_id":object_id(data["id"])},{"$set":q})
	else:
		rules.insert(q)


async def update_p2p_online(obj):
	global objs
	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	websocket=mydb["websocket"]
	friends=mydb["friends"]
	users=mydb["users"]

	user_name=websocket.find_one({"websocket":str(obj)})["username"]
	my_id=str(users.find_one({"u_name":user_name})["_id"])


	friend=[]

	
	q1={"friend_id":my_id,"status":1}

	for i in friends.find(q1):
		friend.append(users.find_one({"_id":object_id(i["user_id"])})["u_name"])
	
	q2={"user_id":my_id,"status":1}
	for i in friends.find(q2):
		friend.append(users.find_one({"_id":object_id(i["friend_id"])})["u_name"])
	
	q={"username":{"$in":friend}}
	select={"websocket":1,"username":1}
	for u in websocket.find(q,select):
		#print("sending_online status to ",u["websocket"])

		data={"type":"p2p_online","username":user_name}
		try:
			await objs[u["websocket"]].send(json.dumps(data))
		except:
			pass

async def handler(websocket, path, extra_argument):
	global objs
	try:
		while True:		
			data = await websocket.recv()
			print("received data: ",data)
			data=json.loads(data)
			if str(websocket) not in objs:
				register(websocket,data)
				await update_meta(websocket)
				await update_p2p_online(websocket)
			else: 
				if(data["type"]=="public_brodcost_message"):
					await brodcost(websocket,data)
				elif(data["type"]=="typing"):
					await typing(websocket,data)
				elif(data["type"]=="members"):
					await meta(websocket)
				elif(data["type"]=="p2p"):
					await p2p(websocket)
				elif(data["type"]=="p2p_message"):
					await p2p_msg_send(websocket,data)
				elif(data["type"]=="load_messages"):
					await p2p_msg_load(websocket,data)
				elif(data["type"]=="block"):
					await block(websocket,data)
				elif(data["type"]=="blocked"):
					await blocked(websocket,data)
				elif(data["type"]=="unblock"):
					await unblock(websocket,data)
				elif(data["type"]=="rules"):
					await rules(websocket)
				elif(data["type"]=="add_rule"):
					await add_rule(websocket,data) 	
				elif(data["type"]=="rule_delete"):
					await delete_rule(websocket,data)
	except websockets.exceptions.ConnectionClosed as e:
		await update_p2p_offline(websocket)
		unregiter(websocket)#remove from object
		await update_meta(websocket)
	except Exception as e:
		print("exception in websocket handler as :",e)
		unregiter(websocket)#remove from object	



try:		
	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	websocket=mydb["websocket"]
	mydb2 = myclient['webhost']
	my_ipv6=mydb2["my_ipv6"]

	websocket.remove({})
except Exception as e:
	print("exception db init n websocket :",e)


connected=0

while(connected==0):
	try:
		ipv6='['+my_ipv6.find().limit(1).sort("_id",-1)[0]["ipv6"]+']'
		bound_handler = functools.partial(handler, extra_argument='spam')
		start_server = websockets.serve(bound_handler,ipv6, 2053)
		asyncio.get_event_loop().run_until_complete(start_server)
		asyncio.get_event_loop().run_forever()

		print("running websocket server on ",ipv6)
		connected=1
	except Exception as e:
		print("websocket exception at init as :",e)