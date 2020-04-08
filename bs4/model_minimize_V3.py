import json
classes=["World","Sports","Business","Sci_Tech"]
for file in classes:
	fw=open("mini_v3_"+file,"w")
	threshold=4
	data=json.loads(open("mini_v2_"+file,"r").read())
	m_data={}
	for key in data:
		if(int(data[key])>=8):
			m_data[key]=data[key]
	fw.write(json.dumps(m_data))		