    ws = new WebSocket("ws://[2409:4042:2707:c72b:a170:3abd:616f:5963]:8765/"),
        ws.onmessage = message_received;
        
    ws.onopen = function(e) {
        tost("connected to messeging server",2,"violet");
        var d = {};
        d["type"] = "login";
        d["key"] = data["_id"];
        d["user"] = data["username"];
        ws.send(JSON.stringify(d)); //user details				
    };
    ws.onclose=wsclose;
	
	
	
	
	function message_received(event) 
        {
        var res=event.data;
        res=JSON.parse(res);
        console.log(res["type"]);
}