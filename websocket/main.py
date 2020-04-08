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

async def  update_meta():
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
		await objs[key].send(data)

async def handler(websocket, path, extra_argument):
	global objs
	try:
		while True:		
			data = await websocket.recv()
			print("received data: ",data)
			data=json.loads(data)
			if str(websocket) not in objs:
				register(websocket,data)
				await update_meta()
			else: 
				if(data["type"]=="public_brodcost_message"):
					await brodcost(websocket,data)
				elif(data["type"]=="typing"):
					await typing(websocket)
				elif(data["type"]=="members"):
					await meta(websocket)					
	except websockets.exceptions.ConnectionClosed as e:
		unregiter(websocket)
		await update_meta()

print("line 123")

bound_handler = functools.partial(handler, extra_argument='spam')
start_server = websockets.serve(bound_handler, '127.0.0.1', 8765)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()