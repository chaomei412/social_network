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


