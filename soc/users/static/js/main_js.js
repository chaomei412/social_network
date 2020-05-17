var width = window.innerWidth;

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
    xhr("/chats/","get",null,show_chats,0);
    
}
function show_chats(data)
{
    finish_loading();
    insert("body",data);
    if(width<=720)
        
    {
        get("chat_box").style.height=(window.innerHeight-35-get_class("mobile")[0].clientHeight)+"px";
        var all=window.innerHeight-30-get_class("mobile")[0].clientHeight-get("chat_types").clientHeight-get("options").clientHeight-get("active_entity_meta").clientHeight;
    }
    else
    {
        get("chat_box").style.height=(window.innerHeight-35-get_class("desktop")[0].clientHeight)+"px";
        var all=window.innerHeight-30-get_class("desktop")[0].clientHeight-get("chat_types").clientHeight-get("options").clientHeight-get("active_entity_meta").clientHeight;
    }

    var all=window.innerHeight-30-get_class("header")[0].clientHeight-get("chat_types").clientHeight-get("options").clientHeight-get("active_entity_meta").clientHeight;
    
    get("messages").style.height=all+"px";



    get("message_entity").style.width=(get("message_box").clientWidth/100)*20-5+"px";
    get("message_body").style.width=(get("message_box").clientWidth/100)*80-5+"px"

    var message_box_opt_width=get("message_box_opt").clientWidth-10;//padding
    var message_send_width=get("message_send").clientWidth;

    get("message_box_1").style.width=message_box_opt_width-message_send_width+"px";


    var message_box_1_width=get("message_box_1").clientWidth-15;//padding
    get("emojis").style.width=message_box_1_width+"px";
    var emoji_tooglee_width=get("emoji_toogle").clientWidth;
    
    get("message").style.width=message_box_1_width-emoji_tooglee_width+"px";
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
    hide_header();
    insert("body", data);
    finish_loading();
    disable_signup();
}



function go_to_home() {
    change_url("/");
    pop1();

}

function logout() {
    change_url("/logout/");
    ws.close();
    xhr("/logout/", "get", null, pop1, 0);
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


    ws_connect(data);

    xhr("/fmain/", "get", null, set_home_gui, 0);
}

function set_home_gui(data) 
{

    
    if(width<=720)
        get_class("mobile")[0].style.display="block";
    else
        get_class("desktop")[0].style.display="block";

    init_header();//it set #body margin top for mobile so body not get hidden behind .mobile ,.mobile is fixed in mobile

    change_url("/");
    insert("body", data);
    Evt("textEditor", "keyup", save_visual);
    Evt("textEditor","click", hide_all);
    Evt("myForm","submit", function (event) {
          event.preventDefault();//STOP submitting form 
          
          sendData();
        });
        xhr("/post","get",null,put_posts,0);
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





function gotologin()
{
    change_url("/login");
    current_open = 'login';

    xhr("/flogin/", "get", null, login, 0);
 }
 
function login(data) 
{
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


function login_me(obj) {
    obj.preventDefault();
    get("login_box").onsubmit =function(obj){obj.preventDefault();};
    get("login_button").style.backgroundColor="powderblue";
    var fd = new FormData();
    fd.append("csrfmiddlewaretoken", document.getElementsByName("csrfmiddlewaretoken")[0].value);
    fd.append("username", get("username").value);
    fd.append("password", get("password").value);
    fd.append("time_stamp", date());
    xhr("/flogin/", "post", fd, logged_in, 0);
}

var ws = '';


var ws_url='';

function logged_in(temp) 
{
    var data = JSON.parse(temp);

    if (data["_id"]==-1)
    {
        tost("invalid login details",2,"red");
        return 0;
    } 

    else if (data["_id"]==-2)
    {
        tost("you are allready logged in in another device allready",2,"blue");
        return 0;
    } 

    xhr("/main/", "get", null, home, 0);

    ws_connect(data);

}


function ws_connect(data)
{
    ws_url='ws://'+data["websocket_ip"]+':2053'
    //alert("open websocket on "+ws_url);
    ws = new WebSocket(ws_url);
    if(ws=="")
    {
        wsclose();
    }
    ws.onmessage = message_received;
        
    ws.onopen = function(e) {
        tost("connected to messeging server",2,"violet");
        var d = {};
        d["type"] = "login";
        d["key"] = data["_id"];
        d["user"] = data["username"];
        ws.send(JSON.stringify(d)); //user details				
    };
    ws.onclose=wsclose;
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


main=1;//set to know main js loaded
console.log("main_js loaded");