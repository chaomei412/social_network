
//document.execCommand('insertText', false, 'banana')
function toogle_emoji()
{
document.getElementById("message").focus();
		if(document.getElementById("emojis").style.display=="block")
			document.getElementById("emojis").style.display="none";
		else
			document.getElementById("emojis").style.display="block";
}

function send_message()
{

}

function Func(cmd,val)
{
	
				document.execCommand(cmd,  val);
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
console.log("selecting");
document.getElementById("commands").style.display="block";

command_timer=setTimeout(function(){document.getElementById("commands").style.display="none";},5000);
}


 document.body.onload=init;

function init()
{

	document.getElementById("message").onselectstart= function () 
	{
     select();   
    };
}      

