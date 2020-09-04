function search()
{
	//get sugestions
	var query=valueof("search")==""?valueof("mob_search"):valueof("search");
	if(query.length<3)
		return 0;
	var fd=new FormData();
	fd.append("query",query);
	fd.append("username",Get("username"));
	fd.append("_id",Get("_id"));
	xhr("/find_friend/","post",fd,search_friend,0);

}
function search_friend(data)
{
	//show sugestions
	var names=[];
	data=JSON.parse(data);

	var temp='<span class="result_close_button glyphicon glyphicon-remove" onclick="vanish(\'search_result\');hide_me(\'search_result\')"></span>';
	if(data.length==0)
		temp+='<div class="search_result">No Sugestion found</div>';
	for(let i=0;i<data.length;i++)
	{
		let name=data[i]["f_name"]+" "+data[i]["l_name"];

		if(names.includes(name)==false)
		{
			temp+='<div class="search_result" onclick="find_it(\''+name+'\')">'+name+'</div>';
			names.push(name);
		}
	}
	get("search_result").style.display="block";
	insert("search_result",temp);
}




function find_it(q=null)
{
	//find friends to add
	if(q==null)
		q=valueof("search")==""?valueof("mob_search"):valueof("search");//if user not used sugestions
	
	var fd=new FormData();
	fd.append("username",Get("username"));
	fd.append("_id",Get("_id"));
	fd.append("query",q);
	xhr("/search_friend","post",fd,show_friends,0);	
}





function show_friends(data)
{
	//sow actual search results
	data=JSON.parse(data);
	console.log(data);
	var temp='<span class="result_close_button glyphicon glyphicon-remove" onclick="vanish(\'search_result\');hide_me(\'search_result\')"></span>';
	if(data.length==0)
		temp+='<div class="search_result">No Result found</div>';

	temp+='<table><tbody>';	
	for(let i=0;i<data.length;i++)
	{
		var action="ADD Friend",evt="add_friend";//default  at that situation status value is 4
		
		switch(data[i]["status"])
		{
			case 0:				action="cancle request",evt="cancle_frindship";
			break;
			case 1:				action="remove friend",evt="cancle_frindship";
			break;
			case 2:				action="unblock",evt="unblock";
			break;			
			case 3:				action="accept",evt="accept";
			break;			
		}

		let name=data[i]["f_name"]+" "+data[i]["l_name"];
		temp+='<tr  class="search_result"><td ROWSPAN=2><img src="http://social.ulti.in/media/'+data[i]["pic_url"]+'"/></td> <TD  class="search_result_name">'+name+'</TD></tr><tr> <TD><button  onclick="'+evt+'(this,\''+data[i]["_id"]+'\')">'+action+'</button></TD></tr>';
	}
	get("search_result").style.display="block";
	temp+='</tbody></table>'; 
	insert("search_result",temp);	
}






var my_friend_visible=0;
function my_friends()
{
	current_open="my_friends";
	var fd=new FormData();
	fd.append("username",Get("username"));
	fd.append("_id",Get("_id"));
	xhr("/friends/","post",fd,put_my_friends,0);	
}

function put_my_friends(data)
{
	console.log(data);
	if(current_open!="my_friends")
		return 0;
		app_level=1;
	//sow actual search results
	data=JSON.parse(data);
	var temp='';
	if(data.length==0)
	{
		temp+='<div class="search_result">you dont have any friends :(</div>';

		
	}
	for(let i=0;i<data.length;i++)
	{
		var x=data[i]["status"],action,evt;
		switch(x)
		{
			case 0:				action="cancle request",evt="cancle_frindship";
			break;
			case 1:				action="remove friend",evt="cancle_frindship";
			break;
			case 2:				action="unblock",evt="unblock";
			break;			
			case 3:				action="accept",evt="accept";
			break;			
		}
		let name=data[i]["f_name"]+" "+data[i]["l_name"];
		temp+='<div class="friend_suggest"><img src="http://social.ulti.in/media/'+data[i]["pic_url"]+'"/><span class="search_result_name">'+name+'</span><button onclick="'+evt+'(this,\''+data[i]["friend_id"]+'\')">'+action+'</button></div>';
	}



	//append to body 


	insert("body",temp);
	append("body",'<h3 id="suggestion_label" style="display:none">People you may Know</h3>');
	append("body",'<div id="friend_suggest"></div>');
	var fd=user_meta_();
	xhr("/friend_suggestions/","POST",fd,show_suggestions,0);
}
function user_meta_()
{
	var	fd=new FormData();
	fd.append("_id",Get("_id"));
	fd.append("username",Get("username"));
	return fd;
}

function show_suggestions(data)
{
	data=JSON.parse(data);

	if(data.length>0)
	get("suggestion_label").style.display="block";
	/*
	_id	"5e84ccfa4fed6bf33199f7c6"
u_name	"admin96"
email	"nileshnmahajan@gmail.com"
f_name	"vijay2"
l_name	"mane2"
dob	"1998-02-08"
pic_url	"users/5e84ccfa4fed6bf33199f7c6.jpg"
*/

var temp='';
for(var i=0;i<data.length;i++)
{
	let name=data[i]["f_name"]+" "+data[i]["l_name"];
	temp+='<span class="friend_suggest">\
				<img src="http://social.ulti.in/media/'+data[i]["pic_url"]+'"/></br>\
				<span class="search_result_name">'+name+'</span></br>\
				<button onclick="add_friend(this,\''+data[i]["_id"]+'\')">Add Friend</button>\
			</span>';

}
	//append to body 
	insert("friend_suggest",temp);
}




