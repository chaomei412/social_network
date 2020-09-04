var tost_timer;

function hide_me(id)
{
    try
	{
        get(id).style.display="none";
	}
	catch(e)
	{

    }
}

function show_me(id)
{
    try
	{
        get(id).style.display="block";
	}
	catch(e)
	{

    }
}


function change_url(url,title)
{
	try
	{
            title(title);
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

function xhr(url=null,method="get",data=null,callback=null,retry=0)
{
	if(retry==0)
		if(url.search("http://")==-1)
			url="http://social.ulti.in"+url
    console.log("url:"+url+" retry:"+retry);
	
    if(retry>5)
    {
        tost("max retry finish");
        return 0;
    }
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
  /*  if(retry<5)
        var tmr=setTimeout(xhr,4000,url,method,data,callback,5);//old request taking too much time send one more   
*/
    var XHR=new XMLHttpRequest(); 

    XHR.onreadystatechange=function() 
    { 
         if(this.readyState===4&&this.status===200)
        {
            //clearTimeout(tmr);
            try
            {
                if(callback!==null)
                    callback(this.responseText);
            }catch(e){console.log("error in xhr while calling callback as "+e);}
        }
        if(this.readyState===4&&this.status!==200)
        {
            //clearTimeout(tmr);
			if(retry>2)
			{
				return 0;
			}
            /*tost("bad response reconnecting..");
            xhr(url,method,data,callback,++retry);//only one more request*/
        }
    };
    XHR.open(method,url); 
    XHR.send(data);
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


function style(data)
{
	var temp=document.createElement("style");
	temp.innerHTML=data;        
	document.head.appendChild(temp);
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

/*set another value to input */
function valueas(id,val)
{
	/*set another value to input */
	try{
	get(id).value=val;
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
function ratr(id,event)
{
    get(id).removeAttribute(event)
}
function satr(id,key,value)
{
    get(id).setAttribute(key,value)
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
    {return document.getElementById(id);}catch(e){return 0;}
}

function get_class(ClassName)
{
    try
    {
            return document.getElementsByClassName(ClassName);
    }catch(e){return 0;}

}



/* ask user before leave page*/


function remember_me(ths)
{

    if(ths.checked==true)
    {
        window.onbeforeunload = function() 
    {

        xhr("/logout/","GET","",null);
            return("you will be loggged out :) "); 

    };

    }
    else
    {
        window.onbeforeunload = null;
    }
}















function error(err)
{
    current_open=6;
    var temp;
    err=parseInt(err);
    switch(err)
    {
        case 403:	temp="	403 Forbidden', 'The server has refused to fulfill your request.";
            break;
        case 404:	 temp="	'404 Not Found', 'The requested file was not found on this server.'";
            break;
        case 405:	    temp="	405 Method Not Allowed', 'The method specified in the Request-Line is not allowed for the specified resource.";
            break;
        case 408:	temp="	   408 Request Timeout', 'Your browser failed to send a request in the time allowed by the server. ";
            break;
        case 500:	  temp="	 500 Internal Server Error', 'The request was unsuccessful due to an unexpected condition encountered by the server.  "; 
            break;
        case 502:	  temp="	 502 Bad Gateway', 'The server received an invalid response from the upstream server while trying to fulfill the request.";
            break;
        case 504:	 temp="	  504 Gateway Timeout', 'The upstream server failed to send a request in the time allowed by the server.";
            break;
        default:  temp="	 That’s an error.The requested URL  was not identify on this server. That’s all we know. ', ";
    }

    finish_loading();
}



function is_small()
{
    /*it return if device width is samaller*/
    if(window.innerWidth<=630)
        return 1;
    return 0;
}






function wait()
{
    loading();
    if(localStorage.getItem("quata")!==null)
        insert("body","<span class=\"reqst\"> plase wait it loading soon ... :)</span><span class=\"quata\">\" " +localStorage.getItem("quata")+" \"</span>");/* set quata that present*/
    else
        insert("body","<span class=\"reqst\"> plase wait it loading soon.... :)</span><span class=\"quata\">\" keep loving BLOGi5 \"</span>");/*if not present quata*/
}
function ready()
{
    finish_loading();
    var current_quata=0;   
    if(localStorage.getItem("quata_id")!==null)
       current_quata=localStorage.getItem("quata_id");/* present quata id */
    	vanish("body");
        let link="/assets/blog/php/next_quata.php?id="+current_quata;/*request for next quata*/
        let method="GET",data="";
        xhr(link,method,data,next_quata);
}



var ppp=0;

function loading()
{
    loaded=0;
    ppp=0;
    loading_loop();
}
var loaded=0;

function loading_loop()
{
    ppp++;
    try
    {
        if(ppp<96&&loaded!==1)
        {
            get("loading").style.width=ppp+"%";
            setTimeout(loading_loop,10); 
        }
    }
    catch(e){}
}

function finish_loading()
{
    loaded=1;
    get("loading").style.width="0%";
}

blog=1;
console.log("blogi5_lib loaded ");



function is_server_up(callback="")
{

	//prevent calling multiple time before getting request
	if(is_server_up_==1)
		return 0;

	is_server_up_=1;
	ws_url='ws://social.ulti.in:2053';

	is_server_up_timeout=setTimeout(function()
	{
		if(server_status!=-1)
			return 0;
		server_status=0;
		try{
			clearTimeout(is_server_up_timeout);
		}catch(e){}

			temp='<div id="exit_app">\
				Server Down :( \
				<span>Our servers are taking rest. They will wake up in 2 3 hour.</span>\
				<button onclick="cordova.plugins.exit()">Ok</button>\
				</div>';
				document.getElementById("body").innerHTML=temp;
				//style('body{padding:0px;}');
				document.getElementById("exit_app").style.left=(document.body.clientWidth-document.getElementById("exit_app").clientWidth)/2+"px";
				document.getElementById("exit_app").style.top=(document.body.clientHeight-document.getElementById("exit_app").clientHeight)/2+"px";
				try{tost("Server Down :(",4,"blue");}catch(e){}		
	},10000);//websocket should have to connect or shown error in 2 second
    //alert("open websocket on "+ws_url);
	var ws = new WebSocket(ws_url);
	var open_=0;
	ws.onopen = function(e) 
	{
		open_=1;
		ws.close();

		server_status=1;//server is up
		if(callback!="")
			callback();
		return 1;		
	};
	ws.onclose=function()
	{
			if(open_==0)
			{
				//not found
				server_status=0;//serevr is down
				temp='<div id="exit_app">\
				Server Down :( \
				<span>Our servers are taking rest. They will wake up in 2 3 hour.</span>\
				<button onclick="cordova.plugins.exit()">Ok</button>\
				</div>';
				document.getElementById("body").innerHTML=temp;
				//style('body{padding:0px;}');
				document.getElementById("exit_app").style.left=(document.body.clientWidth-document.getElementById("exit_app").clientWidth)/2+"px";
				document.getElementById("exit_app").style.top=(document.body.clientHeight-document.getElementById("exit_app").clientHeight)/2+"px";
				try{tost("Server Down :(",4,"blue");}catch(e){}
					return 0;
			}
	};
}