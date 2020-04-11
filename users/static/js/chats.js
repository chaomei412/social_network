function punlic_brodcast()
{
    current_open="punlic_brodcast";
    ratr("mdg_send","onclick");
    satr("mdg_send","onclick","send_it()");
    
    ratr("message","onkeyup");
    satr("message","onkeyup","send_publick_msg_keyup(event)");
     

    
    var d={};
    d["type"]="members";
    ws.send(JSON.stringify(d));
}

function send_publick_msg_keyup(event) {
    if (event.key === "Enter") {
        // Do work
        send_it();
    } else
        i_am_typing();
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


function send_p2p_msg_keyup(event) {
    if (event.key === "Enter") {
        // Do work
        p2p_send();
    } else
        i_am_typing();
} 

function p2p()
{
    current_open="p2p";
    var d={};
    d["type"]="p2p";
    ws.send(JSON.stringify(d));
    ratr("mdg_send","onclick");
    satr("mdg_send","onclick","p2p_send()");
    ratr("message","onkeyup");
    satr("message","onkeyup","send_p2p_msg_keyup(event)");

}

function p2p_active(us)
{
    p2p_current_open=us;
}

var p2p_current_open="";
function p2p_send()
{
	var d={};
    d["type"]="p2p_message";
    d["friend"]=current_open;
	d["content"]=document.getElementById("message").value;
	valueas("message","");
	ws.send(JSON.stringify(d)); 
	var el=document.createElement("span");
	el.className="left_mess";
	el.innerHTML=d["content"];
	document.getElementById("messages").appendChild(el);
	get("messages").scrollTop = get("messages").scrollHeight;
}

function wsclose()
     {
       alert("connection has been closed ");
       logout();
    }
var online_users=[];
function message_received(event) 
        {
        var res=event.data;
        res=JSON.parse(res);
        console.log(res["type"]);
		switch(res["type"])
		{
		case 'public_brodcost_message':
            if(current_open!="punlic_brodcast")            
            {
                tost("new public message from "+res["sender"]);
                break;
            }

            var el=document.createElement("span");
            el.className="right_mess";
            el.innerHTML=res["sender"]+" : "+res["content"];
            get("messages").appendChild(el);
            get("messages").scrollTop = get("messages").scrollHeight;
			break;
        case 'typing':
            tost(res["content"]+" is typing");
            break;
        case 'meta':
            if(current_open!="punlic_brodcast")
                break;
            insert("active_entity_meta",res["count"]+" members online in this room");
            vanish("message_entity");
            for(var i=0;i<res["members"].length;i++)
                append("message_entity",'<span class="user">'+res["members"][i]+'</span>');
                break;
        case 'p2p_users_meta':
            if(current_open!="p2p")
                break;
            insert("active_entity_meta",res["onlines"].length+" friends online");
            vanish("message_entity");
            vanish("messages");
            for(var i=0;i<res["friends"].length;i++)
                {
                    append("message_entity",'<span class="user" id="user_list_'+res["friends"][i]+'" onclick="p2p_active(\''+res["friends"][i]+'\')">'+res["friends"][i]+'</span>');
                    var id="user_list_"+res["friends"][i];
                    get(id).style.color="blue";
                }
            for (var i=0;i<res["onlines"].length;i++)
            {
                var id="user_list_"+res["friends"][i];
                get("user_list_"+res["onlines"][i]).style.color="green";
            }
            break;
        case 'p2p_ofline':
            online_users.pop(res["username"]);
            if(current_open!="p2p")
                break;
            get("user_list_"+res["username"]).style.color="blue";
            insert("active_entity_meta",online_users.length+" friends online");
                break;
        case 'p2p_online':
            online_users.push(res["username"]);
            if(current_open!="p2p")
                break;        
            get("user_list_"+res["username"]).style.color="green";
            insert("active_entity_meta",online_users.length+" friends online");
                break
        case 'p2p_message':
            console.log(res);
            if(current_open!="p2p")            
            {
                tost("new message from "+res["sender"]);
                break;
            }

            if(p2p_current_open==res["sender"])
            {
                var el=document.createElement("span");
                el.className="left_mess";
                el.innerHTML=res["content"];
                get("messages").appendChild(el);
                get("messages").scrollTop = get("messages").scrollHeight;
            }
            else
            {
                get("user_list_"+res["sender"]).style.color="pink";
            }
			break;
                            //data={"type":"p2p_message","friend":"admin96","content"hi","sender":"Admin"}
		}


        }



