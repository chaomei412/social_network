function punlic_brodcast()
{
    current_open="punlic_brodcast";
    vanish("messages");
    ratr("mdg_send","onclick");
    satr("mdg_send","onclick","send_it()");
    
    ratr("message","onkeyup");
    satr("message","onkeyup","send_publick_msg_keyup(event)");
     

    
    var d={};
    d["type"]="members";
    ws.send(JSON.stringify(d));
}

function send_publick_msg_keyup(event) 
{
    if (event.key === "Enter") {
        // Do work
        send_it();
    } else
        i_am_typing(current_open,null);
     //   #this typing show only if user has active publick section 
}  
function i_am_typing(section,friend)
{
	var d={};
    d["type"]="typing";
    d["section"]=section
    d["friend"]=friend
	ws.send(JSON.stringify(d));
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






function send_p2p_msg_keyup(event) {
    if (event.key === "Enter") {
        // Do work
        p2p_send();
    } else
        i_am_typing(current_open,p2p_current_open);
} 

function p2p()
{
    current_open="p2p";
    h_title(current_open);
    vanish("messages");
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
    h_title(p2p_current_open);
    p2p_current_open=us;
    insert("active_entity_meta",p2p_current_open);
    
    if(online_users.includes(us)==true)
        get("user_list_"+us).style.color="green";
    else
        get("user_list_"+us).style.color="blue";
    
    var data={"type":"load_messages","friend":p2p_current_open}
    ws.send(JSON.stringify(data))
    vanish("messages");    
}



var p2p_current_open="";
function p2p_send()
{
    if(current_open!="p2p")
        return 0;
    
    if(p2p_current_open=="")
        {
            tost("please select user",2,"red");
            return 0;
        }
	var d={};
    d["type"]="p2p_message";
    d["friend"]=p2p_current_open;
	d["content"]=document.getElementById("message").value;
	valueas("message","");
	ws.send(JSON.stringify(d)); 
	var el=document.createElement("span");
	el.className="right_mess";
	el.innerHTML=d["content"];
	document.getElementById("messages").appendChild(el);
	get("messages").scrollTop = get("messages").scrollHeight;
}

function wsclose()
     {
       tost("messaging server connection has been closed ");
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
            console.log("typimg: ",res);
            if(res["section"]=="punlic_brodcast" &&(current_open=="p2p"))
                tost(res["content"]+" is typing in public brodcost");
            else if(res["section"]=="p2p" && p2p_current_open==res["friend"])
            {
                if(res["friend"]==p2p_current_open)
                    tost("typing");
            }   
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
                if(online_users.includes(res["friends"][i])==false)
                    online_users.push(res["friends"][i]);
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
                    //data={"type":"p2p_message","friend":"admin96","content"hi","sender":"Admin"}
            if(current_open!="p2p")            
            {
                tost("new message from "+res["sender"]);
                h_title("new message from "+res["sender"]);
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
                h_title("unread message of "+res["sender"]);
            }
            break;
        case 'p2p_message_load':
            console.log(res);
                if(current_open!="p2p")
                    return 0;
                if(p2p_current_open!=res["friend"])
                    return 0;

                for(var i=0;i<res["content"].length;i++)
                {
                    var el=document.createElement("span");

                    if(res["content"][i]["type"]=="send")
                        el.className="right_mess";
                    else
                        el.className="left_mess";

                    el.innerHTML=res["content"][i]["message_content"];
                    get("messages").appendChild(el);

                }
                get("messages").scrollTop = get("messages").scrollHeight;
            break;


		}


        }


        alert("v6");



