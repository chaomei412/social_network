var ee;
function add_friend(e,id)
{
	ee=e;
	console.log(e);
	e.innerHTML="cancle request";
	e.removeAttribute("onclick")
	e.setAttribute("onclick","cancle_frindship(this,'"+id+"')");
	var fd=new FormData();
	fd.append("id",id);
	fd.append("_id",Get("_id"));
	fd.append("username",Get("username"));
	xhr("/add_friend","post",fd,friend_added,0);
}
function friend_added(data)
{
	//friend_collection_id
}	



function cancle_frindship(e,id)
{
	e.innerHTML="add Friend";
	e.removeAttribute("onclick")
	e.setAttribute("onclick","add_friend(this,'"+id+"')");

	var fd=new FormData();

	fd.append("id",id);
	fd.append("_id",Get("_id"));
	fd.append("username",Get("username"));
	xhr("/cancle_frindship","post",fd,rejected,0);
}

function rejected(data)
{
	
			
}

/*
function unblock(e,id)
{
	//currently not implimented
	//now implemented on chats,js
}*/

function accept(e,id)
{
	e.innerHTML="remove";
	e.removeAttribute("onclick")
	e.setAttribute("onclick","cancle_frindship(this,'"+id+"')");

	var fd=new FormData();
fd.append("_id",Get("_id"));
	fd.append("username",Get("username"));
	fd.append("id",id);
	xhr("/accept_frindship","post",fd,accepted,0);
}
function accepted(data)
{
	
}