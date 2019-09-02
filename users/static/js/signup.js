function is_username_available()
{

	var data=valueof("user_name");

xhr("fuck.html","post",data,gotit,0);
}


function gotit(res)
{
	alert(data);
}





