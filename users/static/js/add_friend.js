function add_friend(id)
{
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



