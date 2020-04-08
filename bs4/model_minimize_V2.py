import json
classes=["World","Sports","Business","Sci_Tech"]

for file in classes:
	data=json.loads(open(file,"r").read())
	fw=open("mini_v2_"+file,"w")
	wdata={}
	for key in data:
		flag_found=0
		for file2 in classes:
			if(file==file2):
				continue	
			m_data=json.loads(open("mini_"+file2,"r").read())
			if(key in m_data):
				flag_found=1
				break
		if(flag_found==0):
			wdata[key]=data[key]
	fw.write(json.dumps(wdata))	