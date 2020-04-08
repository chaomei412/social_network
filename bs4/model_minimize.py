import json
classes=["World","Sports","Business","Sci_Tech"]
for file in classes:
	fw=open("mini_"+file,"w")
	threshold=8
	data=json.loads(open(file,"r").read())
	m_data={}
	for key in data:
		if(int(data[key])>=8):
			m_data[key]=data[key]
	fw.write(json.dumps(m_data))		