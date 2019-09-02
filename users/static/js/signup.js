function is_username_available()
{

	var data=valueof("user_name");
	var fd=new FormData();
	fd.append("csrfmiddlewaretoken",document.getElementsByName("csrfmiddlewaretoken")[0].value);
	fd.append("u_name",data);
xhr("/signup/is_username_avail","post",fd,check_user_name,0);
}
var user_name_repeat=0;
function check_user_name(res)
{
	var data=JSON.parse(res);
	var count=data['count'];
	if (count!=0)
	{
		user_name_repeat=1;
		insert("user_name_error","username is not available or not valid");
	}
	else
	{
		user_name_repeat=0;
		vanish("user_name_error");
	}
}

function is_email_avail()
{
return 0;
//currently email functioning is not in use not in dbn in code also
	var data=valueof("email");
	var fd=new FormData();
	fd.append("csrfmiddlewaretoken",document.getElementsByName("csrfmiddlewaretoken")[0].value);
	fd.append("email",data);
xhr("/signup/is_email_avail","post",fd,check_email,0);	
	
	
}

function check_email(res)
{
	var data=JSON.parse(res);
	var count=data['count'];
	if (count!=0)
		insert("email_error","this email allready in use");
	else
		vanish("email_error");
}




function signup()
{
	
	

	
	
	
var fd=	new FormData(document.getElementsByClassName("post"));
	xhr("/signup/","post",fd,null,0);
}
