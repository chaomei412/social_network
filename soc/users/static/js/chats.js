function punlic_brodcast()
{


    hide_options();
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




function group()
{
    current_open="group";
}
function brodcast()
{
    current_open="brodcast";
}
function encrypted()
{
    current_open="encrypted";
}
function instant()
{
    current_open="instant";
}

function chat_types_active()
{

    var chat_types=["group","instant","encrypted","brodcast","p2p","punlic_brodcast","blocked"];
    if((chat_types.includes(current_open))==false)
    {
        return 0;
    }

    var chttyps=document.getElementsByClassName("chat_types");
    for(var i=0;i<chttyps.length;i++)
    {
        var cur=chttyps[i];
        if(cur.id==current_open)
            cur.style.backgroundColor="black";
        else
            cur.style.backgroundColor="gray";   
    }

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
    hide_options();
    current_open="p2p";
    p2p_current_open="";
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

function delete_rule(ths,id,rule_name)
{
    var sts=ths.getBoundingClientRect();
   // x: 564.4666748046875, y: 189.11666870117188, width: 80.53334045410156, height: 40.80000305175781, top: 189.11666870117188, right: 645.0000152587891, bottom: 229.9166717529297, left: 564.4666748046875 }
    remove("delete_rule");

    var left=window.innerWidth/2-200;
    var style='position:absolute;top:'+sts["top"]+'px; left:'+left+'px;';
    var temp='<div id="delete_rule" style="'+style+'">\
    <div id="delete_rule_name">'+rule_name+'</div>\
    <div id="delete_rule_buttons">\
    <button onclick="delete_rule_conform(\''+id+'\')">Confirm Delete</button>\
    <button onclick="remove(\'delete_rule\')">Cancel</button>\
    </div>\
    </div>';

    append("body",temp);
}

function delete_rule_conform(id)
{
    remove("delete_rule");
    remove(id);
    var data={};
    data["type"]="rule_delete";
    data["rule_id"]=id;
    ws.send(JSON.stringify(data));
}

function rule_type(rule)
{
    /*
    var exact  =  "^3355$";//      1
  var   contain=  ".*cgcfg.*";//   2
   var  start   = "^53454.*";//    3
   var  end     = ".*dgfg$";//     4
   */

    if(rule.startsWith("^") && rule.endsWith("$"))
        return 1;    
  
    
    if(rule.startsWith("^"))
    return 3;

    if(rule.endsWith("$"))
        return 4;
    

    return 2;
}
function update_rule(id,rule_name,For,rule)
{
    console.log(id);
    console.log(rule_name);
    console.log(For);
    console.log(rule);


    /*
    exact    ^3355$      1
    contain  .*cgcfg.*   2
    start    ^53454.*    3
    end      .*dgfg$     4
    */ 
 

    new_rul_box_toogle();
 
    valueas("rule_type",rule_type(rule));

    valueas("id",id);
    valueas("rule_name",rule_name);
    valueas("friend_select",For);



    rule=rule.replace('^', '');

    rule=rule.replace('$', '');

    rule=rule.replace("\.\*","");
    rule=rule.replace("\.\*","");
    valueas("rule",rule);
}

function blocked()
{
    hide_options();
    current_open="blocked";
    p2p_current_open="";
    h_title(current_open);
    vanish("messages");
    var d={};
    d["type"]="blocked";
    ws.send(JSON.stringify(d));
    ratr("mdg_send","onclick");
    ratr("message","onkeyup");
}

function rules()
{
    current_open="rules";
    vanish("messages");
    vanish("message_entity");
    vanish("active_entity_meta");

    var temp='<div><button id="new_rul_box_toogle" onclick="new_rul_box_toogle()">New Rule</button></div>';
    append("message_entity",temp);
    var data={};
    data["type"]="rules";
    ws.send(JSON.stringify(data))
}
function put_old_rules(rules)
{

    //"rules": [{"_id": "5eb34a07e5ef817947dce636", "user_id": "5e8764dd189928d6d5aa33e6", "rule_name": "first rule", "for_": "admin1", "rule_type": "1", "rule": "^gm$"}]

    var temp='<table><tbody>';
    for(var i=0;i<rules.length;i++)
    {
    temp+='<tr class="rul_row"  id="'+rules[i]["_id"]+'">\
                <td>'+rules[i]["rule_name"]+'</td>';
                if(rules[i]["for_"]=="none")
                    temp+='<td>aAll</td>';
                else
                    temp+='<td>'+rules[i]["for_"]+'</td>';

                //in future remove regex and show plain text and block type as start with end or contain etc    
                temp+='<td>'+rules[i]["rule"]+'</td>\
                <td>\
                    <table><tbody>\
                    <tr>\
                        <td><button onclick="update_rule(\''+rules[i]["_id"]+'\',\
                        \''+rules[i]["rule_name"]+'\',\
                        \''+rules[i]["for_"]+'\',\
                        \''+rules[i]["rule"]+'\')">Update</button></td>\
                        <td><button onclick="delete_rule(this,\''+rules[i]["_id"]+'\',\''+rules[i]["rule_name"]+'\')">Delete</button></td>\
                    </tr>\
                    </tbody></table>\
                </td>\
            </tr>';
            
    }
    temp+='</tbody></table>';
    append("messages",temp);
    alert("old rule added");
}

function add_rule()
{

    //read from form and send to ws
    var flag=0;
    var data={};
    data["type"]="add_rule";
    data["rule_name"]=valueof("rule_name");
    if(data["rule_name"]=="")
        flag=1;

    
    data["for_"]=valueof("friend_select");
    if( data["for_"]=="")
    flag=1;

    
    data["rule_type"]=valueof("rule_type");
    if(data["rule_type"]=="")
    flag=1;


    
    data["rule"]=valueof("rule");
    if(data["rule"]=="")
    flag=1;

    data["rule_type"]=valueof("rule_type");
    if(data["rule_type"]=="")
    flag=1;

    if(flag==1)
    {
        tost("all fields are required",3,"red");
        return 0;
    }


    data["id"]=valueof("id");





    new_rul_box_toogle();

    valueas("rule_type","");
    valueas("rule_name","");
    valueas("rule","");
    valueas("rule_type","");
    valueas("friend_select","");

    valueas("id","");
    switch(data["rule_type"])
    {

        /*
        <option value="1">exact match</option>\
        <option value="2">contain</option>\
        <option value="3">start  with</option>\
        <option value="4">end with</option>\
        */
        case "1":
            data["rule"]="^"+data["rule"]+"$";
            break;
        case "2":
            data["rule"]=".*"+data["rule"]+".*";
            break;
        case "3":
            data["rule"]="^"+data["rule"]+".*";
            break;
        case "4":
            data["rule"]=".*"+data["rule"]+"$";
            break;
    }


    if(data["id"]!="")
    {

        //update append immidiatly
        //if new append when recive from serevr id
       var temp= '<td>'+data["rule_name"]+'</td>';
        if(data["for_"]=="none")
            temp+='<td>aAll</td>';
        else
            temp+='<td>'+data["for_"]+'</td>';

        //in future remove regex and show plain text and block type as start with end or contain etc    
        temp+='<td>'+data["rule"]+'</td>\
        <td>\
            <table><tbody>\
            <tr>\
                <td><button onclick="update_rule(\''+data["id"]+'\',\
                \''+data["rule_name"]+'\',\
                \''+data["for_"]+'\',\
                \''+data["rule"]+'\')">Update</button></td>\
                <td><button onclick="delete_rule(this,\''+data["id"]+'\',\''+data["rule_name"]+'\')">Delete</button></td>\
            </tr>\
            </tbody></table>\
        </td>';
        insert(data["id"],temp);
    }



    console.log("adding rule: "+JSON.stringify(data));

    ws.send(JSON.stringify(data));
}

function new_rul_box_toogle()
{
    if(get("rule_form").style.display=="none")
        get("rule_form").style.display="block";
    else
        get("rule_form").style.display="none";    
    
    valueas("rule_type","");
    valueas("rule_name","");
    valueas("rule","");
    valueas("rule_type","");
    valueas("friend_select","");
    valueas("id","");
    
}



function add_new_rule(data)
{
    var temp='\
    <div id="rule_form" style="display:none">\
        <input type="text" id="id" style="display:none"/></br>\
        <input type="text" id="rule_name"/></br>\
        <label for="friend_select">Choose a friend:</label></br>\
        <select id="friend_select">\
        <option value="null">All</option>';

        for(var i=0;i<data.length;i++)
            temp+='<option value="'+data[i]+'">'+data[i]+'</option>';
        
        temp+='</select></br>\
        <label for="rule_type">Rule Type:</label></br>\
        <select id="rule_type">\
            <option value="1">exact match</option>\
            <option value="2">contain</option>\
            <option value="3">start  with</option>\
            <option value="4">end with</option>\
        </select></br>\
        <input type="text" id="rule"/></br>\
        <button onclick="add_rule()">Add Rule</button>\
        <button onclick="new_rul_box_toogle()">Cancel</button>\
    </div>\
    ';
    try
    {
        remove("rule_form");
    }
    catch(e){}
    append("body",temp);
}
function p2p_active(us)
{
    if(p2p_current_open!=us)
    {

        vanish("messages");
        h_title(p2p_current_open);
        p2p_current_open=us;

        var usrs=document.getElementsByClassName("user");
        for(var i=0;i<usrs.length;i++)
        {
            var cur=document.getElementsByClassName("user")[i];
            if(cur.id.split("_")[2]==us)
                cur.style.backgroundColor="orange";
            else
                cur.style.backgroundColor="white";   
        }

        insert("active_entity_meta",p2p_current_open);

        if(online_users.includes(us)==true)
            get("user_list_"+us).style.color="green";
        else
            get("user_list_"+us).style.color="blue";

        var data={"type":"load_messages","friend":p2p_current_open}
        ws.send(JSON.stringify(data))
    }    
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
    
    el.className="right_mess animated pulse";

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
            el.className="right_mess animated pulse";
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
                    console.log(1);
                    append("message_entity",'<span class="user" id="user_list_'+res["friends"][i]+'" onclick="p2p_active(\''+res["friends"][i]+'\')">'+res["friends"][i]+'<i class="down" onclick="p2p_option(\''+res["friends"][i]+'\',this)"></i></span>');
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

                el.className="left_mess animated pulse";
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
                if(current_open=="p2p" || current_open=="blocked")
                {
                    if(p2p_current_open!=res["friend"])
                        return 0;

                    for(var i=0;i<res["content"].length;i++)
                    {
                        var el=document.createElement("span");

                        if(res["content"][i]["type"]=="send")

                            el.className="right_mess animated pulse";
                        else
                            el.className="left_mess animated pulse";
                        el.innerHTML=res["content"][i]["message_content"];
                        get("messages").appendChild(el);
                    }
                    get("messages").scrollTop = get("messages").scrollHeight;
                }
            break;
        case 'blocked':
                //	data={"type":"blocked","blocked":friend}
                if(current_open!="blocked")
                    break;
                insert("active_entity_meta",res["blocked"].length+" friends block");
                vanish("message_entity");
                vanish("messages");
                for(var i=0;i<res["blocked"].length;i++)
                    {
                        append("message_entity",'<span class="user" id="user_list_'+res["blocked"][i]+'" onclick="p2p_active(\''+res["blocked"][i]+'\')">'+res["blocked"][i]+'<i class="down" onclick="block_option(\''+res["blocked"][i]+'\',this)"></i></span>');
                        var id="user_list_"+res["blocked"][i];
                        get(id).style.color="blue";
                    }
            break;
        case 'rules':
                    
                if(current_open!="rules")
                    break;
                add_new_rule(res["friends"]);
                put_old_rules(res["rules"]);
    }   
}



function block_option(friend,ths)
{
    //temp+='<div onclick="'+menu[i]["function"]+'(\''+menu[i]["parameters"]+'\')" class="p2p_options">'+menu[i]["function_name"]+'</div>';

    var menu=[{"function":"unblock","parameters":friend,"function_name":"Unblock"},{"function":"block","parameters":friend,"function_name":"Block again"},{"function":"block_info","parameters":friend,"function_name":"Block info"}]
    if(ths.className=="up")
    {
        p2p_option_open.pop(ths);
        ths.className="down";
        vanish("p2p_option");
        get("p2p_option").style.display="none";
        return 0;
        //close
    }
        //close if anothers option is open
    if(p2p_option_open.length>0)
    {
        for(var i=0;i<p2p_option_open.length;i++)
        {

            p2p_option_open[i].className="down";
            p2p_option_open.pop(p2p_option_open[i]);
        }
        vanish("p2p_option");
        get("p2p_option").style.display="none";
    }

    p2p_option_open.push(ths);
    ths.className="up";
    show_p2p_option(ths.offsetLeft,ths.offsetTop,friend,menu);
}


var p2p_option_open=[];

function p2p_option(user,ths)
{
    console.log(ths.offsetTop+" "+ths.offsetLeft);

    if(ths.className=="up")
    {
        p2p_option_open.pop(ths);
        ths.className="down";
        vanish("p2p_option");
        get("p2p_option").style.display="none";
        return 0;
        //close
    }
        //close if anothers option is open
    if(p2p_option_open.length>0)
    {
        for(var i=0;i<p2p_option_open.length;i++)
        {

            p2p_option_open[i].className="down";
            p2p_option_open.pop(p2p_option_open[i]);
        }
        vanish("p2p_option");
        get("p2p_option").style.display="none";
    }

    p2p_option_open.push(ths);

    ths.className="up";
    console.log("calling show_p2p_option");

    show_p2p_option(ths.offsetLeft,ths.offsetTop,user);

}



function show_p2p_option(left,top,usr,menu=null)
{
    console.log("show_p2p_option"+usr);


    var temp='';
    if(menu==null)
    {
        temp='<div onclick="mark_as_read(\''+usr+'\')" class="p2p_options">Mark as read</div>\
        <div onclick="delete_p2p(\''+usr+'\')" class="p2p_options">Delete Chat</div>  \
        <div onclick="block(\''+usr+'\')" class="p2p_options">Block</div>\
        ';
    }
    else
    {
        for(var i=0;i<menu.length;i++)
        {
          temp+='<div onclick="'+menu[i]["function"]+'(\''+menu[i]["parameters"]+'\')" class="p2p_options">'+menu[i]["function_name"]+'</div>';
       
        }
    }
    insert("p2p_option",temp);
    get("p2p_option").style.position="absolute";
    get("p2p_option").style.left=left-150+"px";
    get("p2p_option").style.top=top+23+"px";
    get("p2p_option").style.display="block";
} 




function block(friend)
{
    hide_options();
    vanish("messages");
    var id="user_list_"+friend;
    remove(id);

    var data={};
    data["type"]="block";
    data["friend"]=friend;
    ws.send(JSON.stringify(data)); 

}


function unblock(friend)
{
    var data={};
    data["type"]="unblock";
    data["friend"]=friend;
    ws.send(JSON.stringify(data)); 

    hide_options();
    var id="user_list_"+friend;
    remove(id);

}

function hide_options()
{
        //close if anothers option is open
    if(p2p_option_open.length>0)
    {
        for(var i=0;i<p2p_option_open.length;i++)
        {

            p2p_option_open[i].className="down";
            p2p_option_open.pop(p2p_option_open[i]);
        }
        vanish("p2p_option");
        get("p2p_option").style.display="none";
    }

}



