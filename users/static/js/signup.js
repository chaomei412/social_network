function is_username_available()
{
	var data=valueof("user_name");
	var fd=new FormData();
	fd.append("csrfmiddlewaretoken",document.getElementsByName("csrfmiddlewaretoken")[0].value);
	fd.append("u_name",data);
xhr("/signup/is_username_avail","post",fd,check_user_name,0);
}
var user_name_repeat=1,pass1_error=1,pass2_error=1;
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
	if(user_name_repeat==1 || pass1_error==1 || pass2_error==1){
		
	alert("please check error fields");	
	return 0;}
	
	var fd=	new FormData(document.getElementsByClassName("post-form")[0]);
	xhr("/signup/","post",fd,signup_done,0);
}
function signup_done(data)
{
	document.write(data);
}

var pat="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})";
function pass1()
{
	var paswd=valueof("user_pass");
	if(!paswd.match(pat))
	{
		insert("pass1_error","password not contaion small,capital alphabet,number,symbol,length be more than 8");
		pass1_error=1;
	}
	else
	{	
pass1_error=0;
vanish("pass1_error");
	}
	return paswd;
}
function pass2()
{
	
	var paswd=valueof("user_pass2");	
	if(pass1()!=paswd)
	{
		insert("pass2_error","password Not match");
		pass2_error=1;
	}
	else
	{
		pass2_error=0;
		vanish("pass2_error");
	}
}
