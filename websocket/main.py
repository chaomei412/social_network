import asyncio
import functools
import websockets
import json
import pymongo
from bson.objectid import ObjectId as object_id
objs={}
#{"obj":obj,"obj2":obj2}
from cryptography.fernet import Fernet
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
		print("user has not any another ws connection")
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

async def typing(obj):
	global objs
	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	websocket=mydb["websocket"]

	data={}
	data["type"]="typing"
	data["content"]=websocket.find_one({"websocket":str(obj)})["username"]
	data=json.dumps(data)
	for usr in objs:
		if usr==str(obj):
			continue
		await objs[usr].send(data)
async def brodcost(obj,message):
	print("brodcost")
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
	print("meta: ",data)
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

	print("F.R.I.E.N.D.S.: ",friend)

	q1={"friend_id":my_id,"status":1}

	print("friens query: ",q1)
	for i in friends.find(q1):
		friend.append(users.find_one({"_id":object_id(i["user_id"])})["u_name"])
	print("F.R.I.E.N.D.S.: ",friend)

	q2={"user_id":my_id,"status":1}
	print("friens query: ",q2)    
	for i in friends.find(q2):
		friend.append(users.find_one({"_id":object_id(i["friend_id"])})["u_name"])
	print("F.R.I.E.N.D.S.: ",friend)

	q={"username":{"$in":friend}}
	select={"username":1}
	onlines=[]
	for u in websocket.find(q,select):
		onlines.append(u["username"])
	data={"type":"p2p_users_meta","friends":friend,"onlines":onlines}
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
	print("meta: ",data)
	data=json.dumps(data)
	for key in objs:
		try:
			await objs[key].send(data)
		except:
			pass	
async def p2p_msg_send(obj,data):
	global objs
	#data={"type":"p2p_message","friend":"admin96","content"hi"}
	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	websocket=mydb["websocket"]
	friends=mydb["friends"]
	users=mydb["users"]

	my_user_name=websocket.find_one({"websocket":str(obj)})["username"]
	
	data["sender"]=my_user_name
	#we found object only if friend is online
	if(websocket.find({"username":data["friend"]}).count()==1):
		user_websocket_object_key=websocket.find_one({"username":data["friend"]}["websocket"])
		await objs["user_websocket_object_key"].send(json.dumps(data))

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

async def update_p2p_online(obj):
	global objs
	print("objs:",objs)
	myclient = pymongo.MongoClient('mongodb://localhost:27017/')
	mydb = myclient['social_network']
	websocket=mydb["websocket"]
	friends=mydb["friends"]
	users=mydb["users"]

	user_name=websocket.find_one({"websocket":str(obj)})["username"]
	print("current_login_user: ",user_name)	
	my_id=str(users.find_one({"u_name":user_name})["_id"])
	print("id: ",my_id)

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
		print("sending_online status to ",u["websocket"])

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
					await typing(websocket)
				elif(data["type"]=="members"):
					await meta(websocket)
				elif(data["type"]=="p2p"):
					await p2p(websocket)
				elif(data["type"]=="p2p_message"):
					await p2p_msg_send(websocket,data)
	except websockets.exceptions.ConnectionClosed as e:
		await update_p2p_offline(websocket)
		unregiter(websocket)#remove from object
		await update_meta(websocket)
myclient = pymongo.MongoClient('mongodb://localhost:27017/')
mydb = myclient['social_network']
websocket=mydb["websocket"]

websocket.remove({})



bound_handler = functools.partial(handler, extra_argument='spam')
start_server = websockets.serve(bound_handler, '127.0.0.1', 8765)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()