var ws;
function onloads()
{
	ws = new WebSocket("ws://192.168.48.121:8765/");
	
	ws.onmessage = function (event) 
	{
	
		var res=event.data;
		res=res.split("$");
		switch(res[0])
		{
		case 'public_brodcost_message':
		
		var el=document.createElement("span");
		el.className="right_mess";
		el.innerHTML=res[1];
		document.getElementById("messages").appendChild(el);
		document.getElementById("message").scrollIntoView();
			break;
			case 'typing':
					tost(res[1]+" is typing");
			break;
		}

	};
	ws.onopen = function(e) 
	{
		console.log("Connection open...", e);
		ws.send("user${{data.0}} {{data.1}}");//user details
	};
}
function  send_it()
{

	var d={};
	d["type"]="public_brodcost_message";
	d["content"]=document.getElementById("message").value;
	document.getElementById("message").value="";
	ws.send(JSON.stringify(d)); 
	var el=document.createElement("span");
	el.className="left_mess";
	el.innerHTML=d["content"];
	document.getElementById("messages").appendChild(el);
	get("messages").scrollTop = get("messages").scrollHeight;
}



function i_am_typing()
{
	var d={};
	d["type"]="typing";
	ws.send(JSON.stringify(d));
}


