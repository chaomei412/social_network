

//document.execCommand('insertText', false, 'banana')
function toogle_emoji()
{
	get("emojis").style.bottom="0px";
	document.getElementById("message").focus();
		if(document.getElementById("emojis").style.display=="block")
		{	
		document.getElementById("emojis").style.display="none";
		get("current_participant_messages").style.height=get("current_participant_messages").clientHeight+183+"px";
		}
		else
		{
			document.getElementById("emojis").style.display="block";
			get("current_participant_messages").style.height=get("current_participant_messages").clientHeight-183+"px";
		}
}



function Func(cmd,val="")
{
	
			try{
				document.execCommand(cmd,false,  val);
			}
			catch(e){
				document.execCommand(cmd,val);
			}
}
function emoji(em)
{
	//document.getElementById("message").innerHTML+=em;

	try
	{
			document.execCommand("insertText", false, em);
	}
	catch(e)
	{
		console.log("1:"+e);
		try
		{
			document.execCommand("insertText", true, em);
		}
		catch(e)
		{
			console.log("2:"+e);			
			document.execCommand("insertText", em);
		}
	}
}


var command_timer="";
function select()
{
	try
	{
		clearTimeout(command_timer);
	}
	catch(e)
	{

	}
	document.getElementById("commands").style.display="block";

	command_timer=setTimeout(is_still_selecting,5000);
}


function is_still_selecting()
{
	if(document.getSelection().toString().length==0)
		document.getElementById("commands").style.display="none";
	else
			command_timer=setTimeout(is_still_selecting,5000);
}







update_js_list();update_css_list();