function add_friend(id)
{
<<<<<<< HEAD
	alert("sent successfully to user id:"+id);
	var crf=document.getElementsByName("csrfmiddlewaretoken")[0].value;
	var fd=new FormData();
	fd.append("csrfmiddlewaretoken",crf);
	fd.append("id",id);
	xhr("/add_friend","post",fd,friend_added,0);
}
function friend_added(data)
{
	alert("successfully added");	
}	



=======
	
	alert("sent successfully to user id:"+id);
}
>>>>>>> e846ba3d74b81031f7239c91690b56f6075cf3e1
