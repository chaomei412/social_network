var width = window.innerWidth;

var logout_=0;
function logout()
{
	get_class("mobile")[0].style.display="none";
	var fd=new FormData();
	fd.append("username",Get("username"));
	fd.append("_id",Get("_id"));
	xhr("http://social.ulti.in/logout/","POST",fd,null,0);
	logout_=1;//it indicate that we close ws mannually
	localStorage.clear("username");
    localStorage.clear("_id");
    ws.close();
    
}


function Set(key,value)
{
	localStorage.setItem(key,value);
}

function Get(key)
{
	return localStorage.getItem(key)
}

function Main()
{
    console.log("in Main");
	if(ws!="")
		return 0;
	if(is_key_in_device()==1)
		is_key_present_in_server();
	else
		current_open_='';gotologin();
}


function is_key_present_in_server()
{
	var fd=new FormData();
	fd.append("username",Get("username"));
	fd.append("_id",Get("_id"));
	xhr("http://social.ulti.in/main/","POST",fd,logged_in,0);//validate server reply that is key present
}




function login()
{
	var fd=new FormData();
	fd.append("username",valueof("username"));
	fd.append("password",valueof("password"));
	xhr("http://social.ulti.in/flogin/","POST",fd,logged_in,0);
}



function is_key_in_device()
{

	if(Get("username")==undefined)
	{
		tost("no old login found</br>");
		return 0;
	}
	else
	{
		tost("login user :"+Get("username")+"</br>");
		return 1;
	}
}


var current_open = '';


function pop1() 
{
	
    get_class("mobile")[0].style.display="none";
    get_class("desktop")[0].style.display="none";
    init_header();
    var urls = urlsplit();
    loading();
    switch (urls[0])
    {
        case '':
		case 'index0.html':
		case 'index.html':
            current_open = 'root';
            xhr("/main/", "get", null, home, 0);
            break;
        case 'login':
            current_open = 'login';
            xhr("/main/", "get", null, home, 0);
            break;
        case 'logout':
            current_open = 'logout';
            xhr("/main/", "get", null, home, 0);
            break;
        case 'signup':
            current_open = 'signup';
            xhr("/fsignup/", "get", null, show_signup, 0);
            break;
        case 'lets_chat':
            current_open = 'login';
            xhr("/main/", "get", null, home, 0);
            break;
        default:
    }
}

function chats()
{
    loading();
    change_url("/lets_chat");
    current_open="chats";
    xhr("/chats/","get",null,show_chats,0);
    
}
function show_chats(data)
{
    if(current_open!="chats")
        return 0;
    app_level=3;
    finish_loading();
    insert("body",data);

	 get("chat_box").style.height=window.innerHeight-get_class("mobile")[0].clientHeight-get_class("desktop")[0].clientHeight-22+"px";
	 
	 var chat_box_height=window.innerHeight-get_class("mobile")[0].clientHeight-get_class("desktop")[0].clientHeight-22;

	var chat_type_height=get("chat_types").clientHeight;
	var chat_participant_height=get("chat_participants").clientHeight;
	var current_participant_details_height=get("current_participant_details").clientHeight;
	var options_height=get("options").clientHeight;
	var options_width=get("options").clientWidth-10;

	
	var message_send_width=get("message_send").clientWidth;
	
	get("message_box_1").style.width=options_width-message_send_width+"px";
	
	var message_box_1_width=options_width-message_send_width-10;
	
//	var emoji_toogle_width=get("emoji_toogle").clientWidth;
	
//	get("message").style.width=message_box_1_width-emoji_toogle_width-8+"px";
    get("message").style.width=message_box_1_width-8+"px";
	get("current_participant_messages").style.height=chat_box_height-chat_participant_height-current_participant_details_height-options_height+"px";
    /*
    get("message_box_opt").style.position="fixed";
    get("message_box_opt").style.bottom="0px";
    get("message_box_opt").style.backgroundColor="#eee";
    */console.log("can you see me");
    
}


function gotosignup()
{
    change_url("/signup");
    loading();
    current_open = 'signup';
    xhr("/fsignup/", "get", null, show_signup, 0);
}


function show_signup(data) 
{
 if(current_open!="signup")
     return 0;   
    app_level=-1;
    hide_header();
    insert("body", data);
    finish_loading();
    disable_signup();
}



function go_to_home() 
{
	xhr("/fmain/", "get", null, set_home_gui, 0);
	current_open="home";
}

function home(data) {
    data = JSON.parse(data);
   
    if (data["_id"] == -1) 
    {
        //user is not login
        change_url("/login");
        xhr("/flogin/", "get", null, login, 0);
        return 0;
    }

    /*now we found user is login becz we provide keep me login and now
    we fetch login salt  from server in this positional data variable and form websocket connection from here  
    */
    //user is login
    //form websocket
    console.log("connecting to ws using old session");

	current_open="home";

    ws_connect(data);
    xhr("/fmain/", "get", null, set_home_gui, 0);
}






function menus()
{
    current_open="menus";

    var fd=user_meta_();
    xhr("/menu/","post",fd,show_menu,0);
}
function show_menu(data)
{
    if(current_open!="menus")
        return 0;
    app_level=5;
    //data contain plain html
    //data=JSON.parse(data);
    insert("body",data);
}



function set_home_gui(data) 
{
	if(current_open!="home")
        return 0;
    app_level=0;    
    change_url("/");
    insert("body", data);
	append("body",'<h3 id="suggestion_label" style="display:none">People you may Know</h3>');	
    append("body",'<div id="friend_suggest"></div>');
	var fd=user_meta_();
	xhr("/friend_suggestions/","POST",fd,show_suggestions,0);
    if(width<=720)
    {
        get_class("mobile")[0].style.display="block";
        get("textEditor").style.height=height-get_class("mobile")[0].clientHeight-height/2+"px";
    }
    else
        get_class("desktop")[0].style.display="block";

    get("textEditor").style.padding="10px";
    init_header();//it set #body margin top for mobile so body not get hidden behind .mobile ,.mobile is fixed in mobile
    get("message_box_1").style.width="100%";
    get("message_box_1").style.textAlign="left";
    get("textEditor").style.padding="10px";

    Evt("textEditor", "keyup", save_visual);
    Evt("textEditor","click", hide_all);
    Evt("myForm","submit", function (event) 
	{
          event.preventDefault();//STOP submitting form 
          
          sendData();
        });
	page_loaded=1;
	var fd=new FormData();
	fd.append("_id",Get("_id"));
    fd.append("username",Get("username"));
    
	xhr("/post/","post",fd,put_posts,0);//load posts
}





function brodcast() 
{
    xhr("/brodcast/", "get", null, put_brodcast, 0);
}

function put_brodcast(data) {
    insert("body", data);
    finish_loading();
    const node = get("message");
    node.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            // Do work
            send_it();
        } else
            i_am_typing();
    });
}




var current_open_="";
function gotologin(caller="")
{
    console.log("in gotologin");

    console.log("go_to_login_called by"+caller)
	//is call same funcion again
    change_url("/login");
    current_open = 'login';
    xhr("/flogin/", "get", null, login_show, 0);
 }
 
function login_show(data) 
{
    if(current_open!="login")
        return 0;
    app_level=-1;    
    current_open_="login";    
    current_open = 'login';
    hide_header();
    insert("body", data);
    console.log("page_loaded");
    page_loaded=1;//user now see login box so update js and css to new one tilll we loaded old css and js
    get("login_box").onsubmit =function(obj){obj.preventDefault();};
    finish_loading();
}


function login_input_check()
{
    //this function simply enable log in button if username and password field are not empty

    get("login_box").onsubmit =function(obj){obj.preventDefault();};
    get("login_button").style.backgroundColor="powderblue";

    if(valueof("username")=="")
        return 0;
     if(valueof("password")=="")
        return 0;
        
        get("login_button").style.backgroundColor="blue";    
    get("login_box").onsubmit = login_me;
}


function login_me(obj) 
{
	var date = new Date();
    obj.preventDefault();
    get("login_box").onsubmit =function(obj){obj.preventDefault();};
    get("login_button").style.backgroundColor="powderblue";
    var fd = new FormData();
    fd.append("csrfmiddlewaretoken", document.getElementsByName("csrfmiddlewaretoken")[0].value);
    fd.append("username", get("username").value);
    fd.append("password", get("password").value);
    fd.append("time_stamp", date);
    xhr("/flogin/", "post", fd, logged_in, 0);
    
}

var ws = '';


var ws_url='';




function logged_in(temp) 
{
	//
    var data = JSON.parse(temp);

    if (data["_id"]==-1)
    {
        tost("invalid login details",2,"red");
		current_open_='';gotologin();
        return 0;
    } 

    else if (data["_id"]==-2)
    {
        tost("you are allready logged in in another device allready",2,"blue");
		current_open_='';gotologin();
        return 0;
    } 
	
//	tost("user might be login succesfully using old login and response as :");
	var temp="id:"+data["_id"]+"</br>"+" username:"+data["username"];
	tost("Login with new  temp access key:"+data["_id"]);
	Set("_id",data["_id"]);
	Set("username",data["username"]);
    Set("pic_url",data["pic_url"]);

    get("mob_prof_pic").src="http://social.ulti.in/media/"+Get("pic_url");
    get("prof_pic").src="http://social.ulti.in/media/"+Get("pic_url");
    current_open="home";
	xhr("/fmain/", "get", null, set_home_gui, 0);//load homepage
	ws_connect();
}

function ws_connect(data)
{
	if(ws!="")
		return 0;
	
	  ws_url='ws://social.ulti.in:2053'
    //alert("open websocket on "+ws_url);
    ws = new WebSocket(ws_url);
	
	if(ws=="")
    {
		tost("connecting to messeging server faild");
        wsclose();
    }
    ws.onmessage = message_received;
        
    ws.onopen = function(e) {
        tost("sending login detail to messeging server");
        var d = {};
        d["type"] = "login";
        d["key"] = Get("_id");
        d["user"] = Get("username");
        ws.send(JSON.stringify(d)); //user details				
		tost("sending login detail to messeging server done");
		//tost(JSON.stringify(d));
    };
    ws.onclose=wsclose;
}
function wsclose(data=null)
{
    console.log(data);
    console.log("logout_:",logout_);
		ws="";
	if(logout_==1)
	{
	   tost("Log Out succesfully :)",3,"blue");
		//user has logout send to login
        logout_=0;
        
		current_open_='';gotologin();
		return 0;
	}
	
	
	current_open="error_page";
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
	
   tost("messaging server connection has been closed ");

}

function home_page(data) 
{
    document.body.innerHTML = data;
}

function togle_menu() {
    if (window.innerWidth > 500)
        return 0;
    if (get("right_header_menus").style.display == "none" || get("right_header_menus").style.display == "") {
        get("right_menu_toggle").className = "glyphicon glyphicon-remove";
        get("right_header_menus").style.display = "block";
    } else {
        get("right_header_menus").style.display = "none";
        get("right_menu_toggle").className = "glyphicon glyphicon-menu-hamburger";
    }
}






var height=window.innerHeight;







//menus



function up_coming()
{
    tost("this option will available soon...");
}

function future_plan()
{
    tost("this option will available soon...");
}
function help_()
{
    tost("this option will available soon...");
}

function about_()
{
    tost("this option will available soon...");
}
function report_bug()
{
    tost("this option will available soon...");
}

function exit_app()
{
    try
    {
        cordova.plugins.exit()
    }
    catch(e){    }

}
















main=1;//set to know main js loaded
console.log("main_js loaded");



