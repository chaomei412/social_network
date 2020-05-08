function search()
{
	//get sugestions
	var crf=document.getElementsByName("csrfmiddlewaretoken")[0].value;
	var query=valueof("search");
	var fd=new FormData();
	fd.append("csrfmiddlewaretoken",crf);
	fd.append("query",query);
	xhr("/find_friend","post",fd,search_friend,0);
}
function search_friend(data)
{
	//show sugestions
	data=JSON.parse(data);
	console.log(data);
	var temp='<button class="result_close_button" onclick="vanish(\'search_result\')">close</button>';
	if(data.length==0)
		temp+='<div class="search_result">No Sugestion found</div>';
	for(let i=0;i<data.length;i++)
	{
		let name=data[i]["f_name"]+" "+data[i]["l_name"];
		temp+='<div class="search_result" onclick="find_it(\''+name+'\')">'+name+'</div>';
	}
	insert("search_result",temp);
}




function find_it(q=null)
{
	//find friends to add
	if(q==null)
		q=valueof("search");//if user not used sugestions
	var crf=document.getElementsByName("csrfmiddlewaretoken")[0].value;
	var fd=new FormData();
	fd.append("csrfmiddlewaretoken",crf);
	fd.append("query",q);
	xhr("/search_friend","post",fd,show_friends,0);	
}





function show_friends(data)
{
	//sow actual search results
	data=JSON.parse(data);
	console.log(data);
	var temp='<button class="result_close_button" onclick="vanish(\'search_result\')">close</button>';
	if(data.length==0)
		temp+='<div class="search_result">No Result found</div>';
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
		temp+='<div class="search_result"><img src="/media/'+data[i]["pic_url"]+'"/><span class="search_result_name">'+name+'</span><button  onclick="'+evt+'(this,\''+data[i]["_id"]+'\')">'+action+'</button></div>';
	}
	insert("search_result",temp);	
}






var my_friend_visible=0;
function my_friends()
{
	if(my_friend_visible==0)
	{	
		my_friend_visible=1;
		xhr("/friends","get",null,put_my_friends,0);	
	}
	else
	{
		my_friend_visible=0;
		insert("search_result",'');
	}
}



function put_my_friends(data)
{
	//sow actual search results
	data=JSON.parse(data);
	var temp='';
	if(data.length==0)
		temp+='<div class="search_result">you dont have any friends :(</div>';
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
		temp+='<div class="search_result"><img src="/media/'+data[i]["pic_url"]+'"/><span class="search_result_name">'+name+'</span><button onclick="'+evt+'(this,\''+data[i]["friend_id"]+'\')">'+action+'</button></div>';
	}
	insert("search_result",temp);	
}




