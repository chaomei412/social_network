var width = window.innerWidth;

var current_open = '';

function pop1() {
    var urls = urlsplit();
    loading();
    switch (urls[0]) {
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
            xhr("/fsignup/", "get", null, signup, 0);
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
    get("chat_box").style.height=(window.innerHeight-35-document.getElementById("header").clientHeight)+"px";
    var all=window.innerHeight-30-document.getElementById("header").clientHeight-document.getElementById("chat_types").clientHeight-document.getElementById("options").clientHeight-document.getElementById("active_entity_meta").clientHeight;
    document.getElementById("messages").style.height=all+"px";



    get("message_entity").style.width=(get("message_box").clientWidth/100)*20-5+"px";
    get("message_body").style.width=(get("message_box").clientWidth/100)*80-5+"px"
   

}





function signup(data) {
    insert("body", data);
    finish_loading();
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
    console.log(data);
    if (data["username"] == 0) {
        change_url("/login");
        xhr("/flogin/", "get", null, login, 0);
        return 0;
    }
    xhr("/fmain/", "get", null, set_home_gui, 0);
}

function set_home_gui(data) 
{
    console.log("set_home_gui");
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


function login(data) 
{
    current_open = 'login';
    insert("body", data);
    document.getElementById("login_box").onsubmit = login_me;
    finish_loading();
    /*	document.getElementsByClassName("unactive")[0].style.width=(width/100)*30;//30%
    	document.getElementsByClassName("active")[0].style.width=(width/100)*70;//70%			*/
}


function brodcast() 
{
    xhr("/brodcast/", "get", null, put_brodcast, 0);
}

function put_brodcast(data) {
    insert("body", data);
    finish_loading();
    const node = document.getElementById("message");
    node.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            // Do work
            send_it();
        } else
            i_am_typing();
    });
}









function login_me(obj) {
    obj.preventDefault();
    var fd = new FormData();
    fd.append("csrfmiddlewaretoken", document.getElementsByName("csrfmiddlewaretoken")[0].value);
    fd.append("username", get("username").value);
    fd.append("password", get("password").value);
    fd.append("time_stamp", date());
    xhr("/flogin/", "post", fd, logged_in, 0);
}

var ws = '';

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


    ws = new WebSocket("ws://127.0.0.1:8765/"),
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
    if (document.getElementById("right_header_menus").style.display == "none" || document.getElementById("right_header_menus").style.display == "") {
        document.getElementById("right_menu_toggle").className = "glyphicon glyphicon-remove";
        document.getElementById("right_header_menus").style.display = "block";
    } else {
        document.getElementById("right_header_menus").style.display = "none";
        document.getElementById("right_menu_toggle").className = "glyphicon glyphicon-menu-hamburger";
    }
}