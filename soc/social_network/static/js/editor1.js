var img_edit_src, img_edit_x, img_edit_y;


var img_count=0;
function insert_edit_image() 
{
    get("img2").style.display = "none";
    get("myForm").style.display = "none";
    get("image_upload_error").innerHTML = '';

    var temp='<div class="demoContainer yui3-resize-knob">\
    <img id="img_'+img_count+'" class="demo" onload="enable_resize_img(\'#img_'+(img_count++)+'\')" src="'+img_edit_src+'">\
    </div>';
    document.execCommand("insertHTML", false, temp);
}


function setimgagain() {
    setimg(null);
}

function setimg(e) {
    hide_all();
    get("img2").style.display = "none";
    if (e != null) {
        img_edit_x = e.pageX;
        img_edit_y = e.pageY;
        get("myForm").style.top = e.pageY + 'px';
        get("myForm").style.left = e.pageX + 'px';
    }
    get("myForm").style.display = "block";
}





//    get("textEditor").addEventListener("mouseover",v_c);

//   get("code").addEventListener("mouseover",c_v);
// get("code").addEventListener("click",hide_all);


function Func(fk, fk2) {
    hide_all();
    if (fk2 === "")
        fk2 = null;
    document.execCommand(fk, false, fk2);
}

var Funcer;


function v_c() {
    //visual is click need to move data from code to visual
    if (current_open === 9 || current_open === 7) {
        get("visual_tools").style.display = "inline";
        get("new_post_changer").removeAttribute("onclick");
        get("new_post_changer").setAttribute("onclick", "c_v()");
        insert("new_post_changer", "HTML");
        get("textEditor").style.display = "block";
        get("code").style.display = "none";
        insert("textEditor", get("code").value);
    }
}
//Evt("post_name","keyup",save_title);

//Evt("code","keyup",save_code);

function save_title() {
    console.log("saving title as " + valueof("post_name"));
    sessionStorage.setItem("post_tit", valueof("post_name"));
}

function save_visual() {
    console.log("saving content of visual as " + get("textEditor").innerHTML);
    sessionStorage.setItem("post_cont", get("textEditor").innerHTML);
}

function save_code() {
    console.log("saving content of code as " + get("code").value);
    sessionStorage.setItem("post_cont", get("code").value);
}

function is_last_session() {
    if (sessionStorage.getItem("post_tit") !== null) {
        remove('restore_last_session_box'); /* if previus instant is still open remove it */
        let tit = sessionStorage.getItem("post_tit");
        let temp = "<span id=\"restore_last_session_box\">auto saved  " + tit + " found <br><button onclick=\"restore_last_session()\">RESTORE</button><button onclick=\"remove('restore_last_session_box')\">NO Thanks</button></span>";
        new_div("restore_session", "body", temp);
    } else {
        return 0;
    }
}

function restore_last_session() {
    if (sessionStorage.getItem("post_tit") === null) {
        remove('restore_last_session_box');
        return 0;
    }
    get("post_name").value = sessionStorage.getItem("post_tit");
    insert("textEditor", sessionStorage.getItem("post_cont"));
    get("code").value = sessionStorage.getItem("post_cont");
    remove('restore_last_session_box');
}

function c_v() {
    //html is click need to move data to code from visual
    if (current_open === 9 || current_open === 7) {
        get("visual_tools").style.display = "none";
        get("new_post_changer").removeAttribute("onclick");
        get("new_post_changer").setAttribute("onclick", "v_c()");
        get("new_post_changer").innerHTML = "VISUAL";
        get("textEditor").style.display = "none";
        get("code").style.display = "block";
        //sessionStorage.setItem("post_cont",get("code").value);
        //sessionStorage.setItem("post_tit",valueof("post_name"));
        get("code").value = get("textEditor").innerHTML;
    }
}



/////////////////////color background/////////////////////////////

var bg_color_block = null;

function bg_color_select(e) {
    hide_all();
    var x = e.pageX;
    var y = e.pageY + 12;
    if (bg_color_block === null) {
        bg_color_block = document.createElement("div");
        var inner = '';
        var count = 1;
        for (var i = 0; i < colors.length; i++) {
            /*if(count==19)
            {
            inner+='<br>'
            count=1
            }*/
            inner += '<button onclick="set_bg_color(\'' + colors[i] + '\')" style="background-color:#' + colors[i] + ';width:18px;height:18px;border-width:1px;cursor:pointer;margin:0;padding:1px" onMouseOver="this.style.borderColor=\'red\'" onMouseOut="this.style.borderColor=\'white\'"></button>';
            //count++;
        }

        bg_color_block.innerHTML = inner;
        bg_color_block.setAttribute("id", "bgcolor_block");
        bg_color_block.setAttribute("style", 'position:absolute;top:' + y + 'px;left:' + x + 'px');
        document.body.appendChild(bg_color_block);
    }
    get("bgcolor_block").style.top = y + "px";
    get("bgcolor_block").style.left = x + "px";
    get("bgcolor_block").style.display = "block";
}

function set_bg_color(o) {
    get("bgcolor_block").style.display = "none";
    document.execCommand("backColor", false, '#' + o);
}
var bgcolor_css = '#bgcolor_block{max-width: 324px;cursor:pointer;}@media(max-width:324px){ #bgcolor_block{  max-width: 162px;}   }';
var bgcoler_css_create = document.createElement("style");
bgcoler_css_create.innerHTML = bgcolor_css;
document.getElementsByTagName("head")[0].appendChild(bgcoler_css_create);






//////////////////////color font


var text_color_block = null;

function set_text_color(o) {

    get("font_color_block").style.display = "none";
    document.execCommand("foreColor", false, '#' + o);
}


function text_color_select(e) {
    hide_all();

    var x = e.pageX;
    var y = e.pageY + 12;
    if (text_color_block === null) {
        text_color_block = document.createElement("div");
        var inner = '';
        var count = 1;
        for (var i = 0; i < colors.length; i++) {
            /*if(count==19)
            {
            inner+='<br>'
            count=1
            }*/
            inner += '<button onclick="set_text_color(\'' + colors[i] + '\')" style="background-color:#' + colors[i] + ';width:18px;height:18px;border-width:1px;cursor:pointer;margin:0;padding:1px" onMouseOver="this.style.borderColor=\'red\'" onMouseOut="this.style.borderColor=\'white\'"></button>';
            //count++;
        }

        text_color_block.innerHTML = inner;
        text_color_block.setAttribute("id", "font_color_block");
        text_color_block.setAttribute("style", 'position:absolute;top:' + y + 'px;left:' + x + 'px');
        document.body.appendChild(text_color_block);
    }
    get("font_color_block").style.top = y + "px";
    get("font_color_block").style.left = x + "px";
    get("font_color_block").style.display = "block";
}

var colors = [
    '990033', 'ff3366', 'cc0033', 'ff0033', 'ff9999', 'cc3366', 'ffccff', 'cc6699',
    '993366', '660033', 'cc3399', 'ff99cc', 'ff66cc', 'ff99ff', 'ff6699', 'cc0066',
    'ff0066', 'ff3399', 'ff0099', 'ff33cc', 'ff00cc', 'ff66ff', 'ff33ff', 'ff00ff',
    'cc0099', '990066', 'cc66cc', 'cc33cc', 'cc99ff', 'cc66ff', 'cc33ff', '993399',
    'cc00cc', 'cc00ff', '9900cc', '990099', 'cc99cc', '996699', '663366', '660099',
    '9933cc', '660066', '9900ff', '9933ff', '9966cc', '330033', '663399', '6633cc',
    '6600cc', '9966ff', '330066', '6600ff', '6633ff', 'ccccff', '9999ff', '9999cc',
    '6666cc', '6666ff', '666699', '333366', '333399', '330099', '3300cc', '3300ff',
    '3333ff', '3333cc', '0066ff', '0033ff', '3366ff', '3366cc', '000066', '000033',
    '0000ff', '000099', '0033cc', '0000cc', '336699', '0066cc', '99ccff', '6699ff',
    '003366', '6699cc', '006699', '3399cc', '0099cc', '66ccff', '3399ff', '003399',
    '0099ff', '33ccff', '00ccff', '99ffff', '66ffff', '33ffff', '00ffff', '00cccc',
    '009999', '669999', '99cccc', 'ccffff', '33cccc', '66cccc', '339999', '336666',
    '006666', '003333', '00ffcc', '33ffcc', '33cc99', '00cc99', '66ffcc', '99ffcc',
    '00ff99', '339966', '006633', '336633', '669966', '66cc66', '99ff99', '66ff66',
    '339933', '99cc99', '66ff99', '33ff99', '33cc66', '00cc66', '66cc99', '009966',
    '009933', '33ff66', '00ff66', 'ccffcc', 'ccff99', '99ff66', '99ff33', '00ff33',
    '33ff33', '00cc33', '33cc33', '66ff33', '00ff00', '66cc33', '006600', '003300',
    '009900', '33ff00', '66ff00', '99ff00', '66cc00', '00cc00', '33cc00', '339900',
    '99cc66', '669933', '99cc33', '336600', '669900', '99cc00', 'ccff66', 'ccff33',
    'ccff00', '999900', 'cccc00', 'cccc33', '333300', '666600', '999933', 'cccc66',
    '666633', '999966', 'cccc99', 'ffffcc', 'ffff99', 'ffff66', 'ffff33', 'ffff00',
    'ffcc00', 'ffcc66', 'ffcc33', 'cc9933', '996600', 'cc9900', 'ff9900', 'cc6600',
    '993300', 'cc6633', '663300', 'ff9966', 'ff6633', 'ff9933', 'ff6600', 'cc3300',
    '996633', '330000', '663333', '996666', 'cc9999', '993333', 'cc6666', 'ffcccc',
    'ff3333', 'cc3333', 'ff6666', '660000', '990000', 'cc0000', 'ff0000', 'ff3300',
    'cc9966', 'ffcc99', 'ffffff', 'cccccc', '999999', '666666', '333333', '000000'
];

var color_css = '#font_color_block{max-width: 324px;cursor:pointer;}@media(max-width:324px){ #font_color_block{  max-width: 162px;}   }';
var coler_css_create = document.createElement("style");
coler_css_create.innerHTML = color_css;
document.getElementsByTagName("head")[0].appendChild(coler_css_create);


/////////////////////////////////////link accepter/////////////////////////

function editor_link_adder(e) {
    hide_all();

    var linked = prompt("Please enter link:", "http://");
    if (linked === null || linked === "" || linked === "http://") {

    } else {
        Func('createLink', linked);

    }

}
//====================fontttttttttt===============================
var fonts = ['Arial',
    'Helvetica',
    'Times New Roman',
    'Times',
    'Courier',
    'Courier New',
    'Verdana',
    'Georgia',
    'Palatino',
    'Garamond',
    'Bookman',
    'Comic Sans MS',
    'Trebuchet MS',
    'Arial Black',
    'Impact'
];
var create_font_block = null;

function select_font_style(e) {
    hide_all();

    var x = e.pageX;
    var y = e.pageY + 12;
    if (create_font_block === null) {
        create_font_block = document.createElement("div");
        var inner = '';

        for (var i = 0; i < fonts.length; i++) {
            inner += '<button onclick="set_font_style(\'' + fonts[i] + '\')"  style="color:white;border:none;background:none;font-size:20px;cursor:pointer;border-width:1px; " onMouseOver="this.style.backgroundColor=\'black\'" onMouseOut="this.style.background=\'none\'"><font face="' + fonts[i] + '">' + fonts[i] + '</font></button><br>';
        }
        create_font_block.innerHTML = inner;
        create_font_block.setAttribute("id", "font_style_block");
        create_font_block.setAttribute("style", 'background-color:gray;position:absolute;top:' + y + 'px;left:' + x + 'px');
        document.body.appendChild(create_font_block);
    }
    get("font_style_block").style.top = y + "px";
    get("font_style_block").style.left = x + "px";
    get("font_style_block").style.display = "block";

}

function set_font_style(o) {
    //	alert("recive"+o);
    if (document.execCommand('fontName', false, o))
        console.log(true);
    else
        console.log(false);
    get("font_style_block").style.display = "none";
}

var color_css = '#font_style_block{max-width: 324px;}@media(max-width:324px){ #font_style_block{  max-width: 162px;}   }';
var coler_css_create = document.createElement("style");
coler_css_create.innerHTML = color_css;
document.getElementsByTagName("head")[0].appendChild(coler_css_create);

//////////////////////////////fonttttttttt end=============================

function hide_all() {
    if (create_font_block !== null)
        get("font_style_block").style.display = "none";

    if (text_color_block !== null)
        get("font_color_block").style.display = "none";

    if (bg_color_block !== null)
        get("bgcolor_block").style.display = "none";
    get("img2").style.display = "none";
    get("myForm").style.display = "none";
}

editor1 = 1;



function share() {
    var content = get("textEditor").innerHTML;
    var fd = new FormData();    
    fd.append("date", date());
    fd.append("content", content);
    xhr("/new_post/share", "post", fd, shared, 0);
    console.log("sharing");
    tost("sharing", "blue", 10);
}

function shared(data) {
    console.log(data);
    vanish("textEditor");
    alert("post shared successfully");
    tost("post shared successfully", "green", 3);

}








function post() {
    xhr("/post/", "get", null, put_posts, 0);
}

function put_posts(data) 
{
    if(current_open=="home" || current_open=="account");

    else
        return 0;
    data = JSON.parse(data);
    if(data.length==0)
	{
        if(current_open=="home")
             append("body","<h3>We not found any posts for you.</h3></br><h4>add some more friends</h4>");
        if(current_open=="account")
        append("body","<h3>you not have shared anything .</h3></br><h4>try to create some posts</h4>");
       //first half posts
	}

    var i;
    for (var i = 0; i < data.length; i++) {
        var temp1 = document.createElement("div");
        var temp = '<span class="post_" id="post_' + data[i]["_id"] + '">\
							<span class="post_head">\
								<span class="post_user" title="view prifile of ' + data[i]["f_name"] + ' ' + data[i]["l_name"] + '"  onclick="user(\'' + data[i]["user_id"] + '\')">\
									<span class="post_user_icon">\
										<img src="http://social.ulti.in/media/' + data[i]["pic_url"] + '"/>\
									</span>\
                                    <span class="post_user_name">' + data[i]["l_name"] + ' ' + data[i]["f_name"] + '</span>\
                                    <span class="post_cats">' + JSON.stringify(data[i]["category"]) + '</span>\
								</span>\
								<span class="date">' + data[i]["user_time_stamp"] + '</span>\
							</span>\
							<span class="cont" onclick="expand_me(this)" title="click to expand">' + data[i]["content"] + '</span>\
							<span class="post_footer">';
        temp += '<span><span class="no_of_likes">' + data[i]["likes_count"] + ' </span>';
        if (data[i]["am_i"] == null)
            temp += '<span class="glyphicon glyphicon-heart-empty" onclick="like_this_post(this,\'' + data[i]["_id"] + '\')">';
        else
            temp += '<span class="glyphicon glyphicon-heart" onclick="unlike(this,\'' + data[i]["_id"] + '\')">';
        temp += '</span></span>\
								<span onclick="load_comments(this,\'' + data[i]["_id"] + '\')" >\
									<span class="no_of_comments">' + data[i]["comments_count"] + ' </span>\
									<span class="glyphicon glyphicon-comment"></span>\
								</span>\
								<span class="fa fa-share-alt" onclick="share_this_post(\'' + data[i]["_id"] + '\')"></span>\
							</span>\
							<input type="text" class="comment_" id="comment_' + data[i]["_id"] + '" placeholder="say something about this post"/>\
							<span class="glyphicon glyphicon-comment"  onclick="comment(\'' + data[i]["_id"] + '\')"></span>\
							<span class="commentras" id="comments_' + data[i]["_id"] + '" onclick="expand_me(this)" title="click to expand"></span>\
						</span>';
        temp1.innerHTML = temp;
        if(current_open=="home" || current_open=="account")
            get("body").appendChild(temp1);
        else
            return 0;
    }



    //temp1.onfocus = post();  on last post view load next posts currently loading all posts at time
    //add event to this to load more 
}

function profile() {
    change_url("/account");
    var fd=new FormData();
    fd.append("_id",Get("_id"));
    fd.append("username",Get("username"));
    
    xhr("/account", "post", fd, account, 0);
	current_open="account";
}

function account(data) 
{
	if(current_open!="account")
		return 0;
    insert("body",data);

    //get own friends
    var fd=new FormData();
	fd.append("username",Get("username"));
	fd.append("_id",Get("_id"));
	xhr("/friends/","post",fd,put_my_friends_,0);
    post();
}

function put_my_friends_(data)
{
    if(current_open=="my_friends" || current_open=="account");
    else
    	return 0;
	//sow actual search results
	data=JSON.parse(data);
	var temp='';
	if(data.length==0)
	{
		temp+='<div class="search_result">you dont have any friends :(</div>';
		show_suggestions();
	}
	for(let i=0;i<data.length;i++)
	{
		var x=data[i]["status"],action,evt;
		switch(x)
		{
			case 0:				action="cancle request",evt="cancle_frindship";
			break;
			case 1:				action="remove friend",evt="cancle_frindship";
			break;
			case 2:				action="unblock",evt="unblock";
			break;			
			case 3:				action="accept",evt="accept";
			break;			
		}
		let name=data[i]["f_name"]+" "+data[i]["l_name"];
		temp+='<div class="friend_suggest"><img src="http://social.ulti.in/media/'+data[i]["pic_url"]+'"/><span class="search_result_name">'+name+'</span><button onclick="'+evt+'(this,\''+data[i]["friend_id"]+'\')">'+action+'</button></div>';
	}



	//append to body 

	append("body",temp);	
	append("body",'<div id="friend_suggest"></div>');
	var fd=user_meta_();
	xhr("/friend_suggestions/","POST",fd,show_suggestions,0);
}



function user(id) {
    // view user profile ater click on icon or nAME
    change_url("/profile?id=" + id);
    xhr("/profile?id=" + id, "get", null, show_user, 0);
    //get post of this uder and friend of this user without any action  like add friend, etc

    
}

function show_user(data) 
{
   insert("body",data);

   

}

function load_comments(ths, id) {
    ths.removeAttribute("onclick");
    ths.setAttribute("onclick", "get('comments_" + id + "').click()");
    get("comments_" + id).style.maxHeight = "unset";
    xhr("/post/load_comments?p_id=" + id, "get", null, put_comments, 0);

}

function put_comments(data) 
{

    data = JSON.parse(data)
    console.log(data);
    for (var i = 0; i < data.length; i++) {
        console.log(data[i]);
        commented(data[i]);
    }

}
var gid;

function comment(id) {
    var comment = valueof("comment_" + id);
    valueas("comment_" + id, "");
    
    var fd = new FormData();
    
    fd.append("date", date());
    fd.append("p_id", id);
    fd.append("comment", comment);
    xhr("/post/comment", "post", fd, commented, 0);
}

function commented(data) {
    try {
        data = JSON.parse(data)
    } catch (e) {}
    console.log(data);
    //data={"post_id": "1", "comment": "test"}
    //after commented at server append it at clienside	
    var temp = document.createElement("span");
    var t2 = '<div class="commented">\
				<div class="comment_head">\
					<span  class="commenter">' + data['commenter'] + '</span>\
					<span  class="comment_date">' + data['date'] + '</span>\
				</div>\
				<div  class="comment_content">' + data['comment'] + '</div>\
			</div>';
    temp.innerHTML = t2;
    var id = "comments_" + data['post_id'];
    get(id).insertBefore(temp, get(id).firstChild);
    //asign uniq id to comment count and incrise it when user comment here
}



function share_this_post(p_id) {

}

function dis_like_this_post(ths, p_id) {
    ths.removeAttribute("onclick");
    //ths.setAttribute("onclick","f"); add another click event
    ths.style.opacity = "1";
    var lks = parseInt(ths.parentElement.firstChild.innerHTML);
    ths.parentElement.firstChild.innerHTML = ++lks + " ";
    xhr("/post/dis_like_this?id=" + p_id, "get", null, dis_like_this_ok, 0);
}

function dis_like_this_ok(data) {
    //logik after dislike is done at server side and has to show changes at client side

}

function like_this_post(ths, p_id) {
    ths.removeAttribute("onclick");
    ths.removeAttribute("class");
    ths.setAttribute("class", "glyphicon glyphicon-heart"); // add another click event
    ths.setAttribute("onclick", "unlike(this,'" + p_id + "')"); // add another click event
    ths.style.opacity = "1";
    var lks = parseInt(ths.parentElement.firstChild.innerHTML);
    ths.parentElement.firstChild.innerHTML = ++lks + " ";
    xhr("/post/like_this?id=" + p_id, "get", null, like_this_ok, 0);
}

function unlike(ths, p_id) {
    ths.removeAttribute("onclick");
    ths.removeAttribute("class");

    ths.setAttribute("class", "glyphicon glyphicon-heart-empty"); // add another click event

    ths.setAttribute("onclick", "like_this_post(this,'" + p_id + "')"); // add another click event

    var lks = parseInt(ths.parentElement.firstChild.innerHTML);
    ths.parentElement.firstChild.innerHTML = --lks + " ";
    xhr("/post/like_this?id=" + p_id, "get", null, like_this_ok, 0);
}



function like_this_ok(data) {
    //logik after like is done at server side and has to show changes at client side
}

function expand_me(post) {
    if (post.style.maxHeight == "unset")
        post.style.maxHeight = "250px";
    else
        post.style.maxHeight = "unset";
}






var img_edit_src,img_edit_x,img_edit_y;

function setimgagain()
{
setimg(null);	
}
function setimg(e)
{
	hide_all();
get("img2").style.display="none";
if(e!=null)
{
img_edit_x=e.pageX;
img_edit_y=e.pageY;
get("myForm").style.top=e.pageY+'px';
get("myForm").style.left=e.pageX+'px';
}
get("myForm").style.display="block";
}


function sendData() 
{
    var XHR = new XMLHttpRequest();
    var form=get("myForm");
    // Bind the FormData object and the form element
    var FD = new FormData(form);
    FD.append("username",Get("username"));
    FD.append("_id",Get("_id"));
    // Define what happens on successful data submission
    XHR.addEventListener("load", function(event) 
    {
        get("myForm").style.display="none";
        var temp=document.createElement("div");
        if(event.target.responseText==='1')
        {
                get("image_upload_error").innerHTML='FILE SIZE MORE THAT 250KB';
                get("myForm").style.display="block";
        }
        else
        {
        img_edit_src=event.target.responseText;
        temp.innerHTML='<img src="'+event.target.responseText+'" width="100%;" height="auto">';
        get("img2").style.left=img_edit_x+'px';
        get("img2").style.top=img_edit_y+'px';
        get("img2").style.display="block";
        get("image_viewer").innerHTML='';
        get("image_viewer").appendChild(temp);
        }
    });

              // Set up our request
    XHR.open("POST", "/new_post/upload_post_image");
    // The data sent is what the user provided in the form
    XHR.send(FD);
}