var tost_timer;

function change_url(url)
{
	try
	{
            h_title('BLOGi5 ek blog site');
            title("BLOGi5");
		window.scrollByPages(-100);
	}
	catch(e)
	{
		try
		{
			window.scroll(0,0);	
		}catch(e)
		{
			 
		}
	}
    /* it change url without refresh or click */
    loading();
	try
	{
		if(window.history.pushState)
		{
			if(location.protocol==="https:"||location.protocol==="http:")
				window.history.pushState(null, null, url);
		}
	}catch(e){}
}

function urlsplit()
{
    var a=window.location.pathname;
    a=a.replace('/index.html','');/*local*/
    a=a.replace(/%20/g,' ');
    a=a.split('/');/*["",post,id,name]["",auther,id,..,..]*/
    var b=new Array;
    for(var i=0;i<(a.length-1);i++)
    {
        b[i]=a[i+1];
    }
    return b;
}

function xhr(url,method="get",data=null,callback,retry=0)
{
    if(retry===1)
    {
            tost("timeout reconnecting..");
    }
	try
	{
		if(XMLHttpRequest);
	}
	catch(e)
	{
		alert("this browser is not support xhr error comes as "+e);
		return 0; 
	}
    var tmr=setTimeout(xhr,10000,url,method,data,callback,1);    
    var xhr=new XMLHttpRequest(); 
    xhr.onreadystatechange=function() 
    { 
         if(this.readyState===4&&this.status===200)
        {
            clearTimeout(tmr);
            try
            {
                if(callback!==null)
                    callback(this.responseText);
            }catch(e){console.log("error in xhr while calling callback as "+e);}
        }
        if(this.readyState===4&&this.status!==200)
        {
            clearTimeout(tmr);
            tost("bad response reconnecting..");
            xhr(url,method,data,callback);
        }
    };
    xhr.open(method,url); 
    xhr.send(data);
}


function remove(id)
{
    /* remove element using id*/
    try
    {
        var element = get(id);
        element.parentNode.removeChild(element);
    }
    catch(e){/*error while deleting element}*/}
}





function hide_tost()
{
 get("tost_div").style.display='none' ;  
}
function tost(data="hey buddy not getting anythinh :)",time=2,color="#666")
{
    try
    {
        clearTimeout(tost_timer);
    }
    catch(e){}
    insert("tost",data);
    get("tost_div").style.display='block';
    get("tost").style.backgroundColor=color;
    tost_timer=setTimeout(function(){get("tost_div").style.display='none';},time*1000);
}

var is_menu_loaded=0;

function append(id,data)
{
    /* it same as addtext need to remove one */
    try
    {
	get(id).innerHTML+=data;
    }
    catch(e){}
}

function insert(id,data)
{
    /* it replace old content with new */
    try
    {
	get(id).innerHTML=data;
    }
    catch(e){}
}


function new_button(id,Where="",placeholder,action=null)
{
    /* add new button with action*/
    var temp=document.createElement("button");
    temp.id=id;
    temp.innerHTML=placeholder;
    if(Where!=="")	
        get(Where).appendChild(temp);
    else
        document.body.appendChild(temp);
    if(action!=null)
        Evt(id,"click",action);
}

function new_class_div(Class,Where,data='')
{
    /* simple new div and asign class */
	var temp=document.createElement("div");
	temp.setAttribute('class', Class);
	temp.innerHTML=data;
    try{
	get(Where).appendChild(temp);	
    }catch(e){}
}


function new_div_class(Class,Where,data='')
{
    /*repeted ned deelete wfter checking depedancys */
       /* simple new div and asign class */
	var temp=document.createElement("div");
	temp.setAttribute('class', Class);
	temp.innerHTML=data;
	get(Where).appendChild(temp);		
}
function new_div(id,Where,data='')
{
    /* simple new div */
	var temp=document.createElement("div");
	temp.id=id;
	temp.innerHTML=data;
	if(Where!=="")
		get(Where).appendChild(temp);	
	else
		document.body.appendChild(temp);
}

function new_span(id,Where,data)
{
    /* simple new span */
	var temp=document.createElement("span");
	temp.id=id;
	temp.innerHTML=data;
	if(Where!=="")
		get(Where).appendChild(temp);	
	else
		document.body.appendChild(temp);
   
}


function new_input(id,Type,placeholder,dflt_value,Where)
{
    /*create input element*/
	var temp=document.createElement("input");
	temp.id=id;
	temp.placeholder=placeholder;
	temp.value=dflt_value;
	temp.type=Type;
        if(Where!=="")
            get(Where).appendChild(temp);	
        else
            document.body.appendChild(temp);	
}




/*return value of input*/
function valueof(id)
{
    /*return value of input which id give*/
	try{
	return(get(id).value);
	}
	catch(e){return 0;}
}

function title(value)
{
    /*asign heading in page*/
	insert("title",value);
}

function Title(id,ttl)
{
    /* a title atribute to id element*/
	get(id).setAttribute("title",ttl);	
}
function h_title(name)
{
    	document.getElementsByTagName("title")[0].innerHTML=name;
}


function vanish(id)
{
    /*make id element blanck*/
	insert(id,'');
}



function Evt(id,evt,funct)
{/* for adding event with call function using id*/
    get(id).addEventListener(evt,funct);
}


function date()
{
    var dt=new Date(); 
    var month=dt.getMonth()+1;
    if(month<10)
    month="0"+month;
    var Dat=dt.getDate();
    if(Dat<10)
    Dat="0"+Dat;
    var hour=dt.getHours();
    if(hour<10)
    hour="0"+hour;
    var minute=dt.getMinutes();
    if(minute<10)
    minute="0"+minute;
    var second=dt.getSeconds();
    if(second<10)
    second="0"+second;
    dt=""+dt.getFullYear()+"-"+month+"-"+Dat+" "+hour+":"+minute+":"+second;   
    /*    console.log(dt);  
        2019-02-06 13:30:09
    */
        return dt;
}

function get(id)
{
    /*return object of pass id*/
    try
    {    return document.getElementById(id);}catch(e){return 0;}
}