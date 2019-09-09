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
		console.log(data[i][0]+" "+data[i][1]);
		let name=data[i][0]+" "+data[i][1];
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
		console.log(data[i][0]+" "+data[i][1]+data[i][2]+" "+data[i][3]);
		let name=data[i][1]+" "+data[i][2];
		temp+='<div class="search_result"><img src="/media/'+data[i][3]+'"/><span class="search_result_name">'+name+'</span><button  onclick="add_friend('+data[i][0]+')">Add </button></div>';
	}
	insert("search_result",temp);	
}

function my_friends()
{
	xhr("/friends","get",null,put_my_friends,0);	
}
function put_my_friends(data)
{
	//sow actual search results
	data=JSON.parse(data);
	console.log(data);
	var temp='';
	if(data.length==0)
		temp+='<div class="search_result">you don;t have any friends :(</div>';
	for(let i=0;i<data.length;i++)
	{
		var x=data[i][4];
		var state=(x==0?"Cancle Request":(x==1?"UnFriend":(x==2?"Blocked":"Conform Request")));
		if(x==2)
			continue;
		console.log(data[i][0]+" "+data[i][1]+data[i][2]+" "+data[i][3]);
		let name=data[i][1]+" "+data[i][2];
		temp+='<div class="search_result"><img src="/media/'+data[i][3]+'"/><span class="search_result_name">'+name+'</span><button>'+state+'</button></div>';
	}
	insert("search_result",temp);	
}