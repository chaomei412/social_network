function disable_signup()
{
    document.getElementById("signup_form").onsubmit =function(obj){obj.preventDefault();};
    get("signup_submit").style.backgroundColor="powderblue";
}


function enable_signup()
{
    if(user_name_error==0 || pass_error==0)
        return 0;

    document.getElementById("signup_form").onsubmit =signup;
    get("signup_submit").style.backgroundColor="blue";   
}


function is_username_available() 
{
    var data = valueof("user_name");
    var fd = user_meta_();

    fd.append("u_name", data);
    xhr("/signup/is_username_avail", "post", fd, check_user_name, 0);
}


var user_name_error=0;
function check_user_name(res) {
    var data = JSON.parse(res);
    var count = data['count'];
    if (count != 0) 
    {
        document.getElementById("login_box").onsubmit =function(obj){obj.preventDefault();};
        user_name_repeat = 1;
        tost("username unavailable",3,"red");
        get("user_name").style.boxShadow="0px 0px 2px 1px red";
        insert("user_name_error","username unavailable");
        disable_signup();
        user_name_error=0;
    } else {
        user_name_repeat = 0;
        vanish("user_name_error");
        get("user_name").style.boxShadow="none";
        user_name_error=1;
        enable_signup();
    }
}

function is_email_avail() {
    return 0;
    //currently email functioning is not in use not in dbn in code also
    var data = valueof("email");
    var fd = new FormData();
    fd.append("csrfmiddlewaretoken", document.getElementsByName("csrfmiddlewaretoken")[0].value);
    fd.append("email", data);
    xhr("/signup/is_email_avail", "post", fd, check_email, 0);


}

function check_email(res) {
    var data = JSON.parse(res);
    var count = data['count'];
    if (count != 0)
        insert("email_error", "this email allready in use");
    else
        vanish("email_error");
}




function signup(obj) 
{
    obj.preventDefault();
    var fd = new FormData(get("signup_form"));
    disable_signup();
    xhr("/signup_submit/", "post", fd, signup_done, 0);
}

function signup_done(data) {

    data=JSON.parse(data);
    //{'error':0,'signup_ok':1}"),content_type=json,safe=False)
    /*if(data["signup_ok"]==1)
        {
       */     gotologin();
            tost("Account Created successfully",5,"green");
       // }
    // else
    // {*/
      //  gotosignup()
       // tost("Account Creation fail due to unknows error",5,"red");
     //}   
}

var pat = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})";

function pass1() {
    var paswd = valueof("user_pass");
    
    /*if (!paswd.match(pat)) {
        insert("pass1_error", "password not contaion small,capital alphabet,number,symbol,length be more than 8");
        pass1_error = 1;
    } else {
        pass1_error = 0;
        vanish("pass1_error");
    }*/

    return paswd;
}

var pass_error=0;
function pass2() 
{

    var paswd = valueof("user_pass2");
    
    if (pass1() != paswd && pass1().length <= paswd.length) 
    {
        insert("pass2_error", "password Not match");
        get("user_pass").style.boxShadow="0px 0px 2px 1px red";
        get("user_pass2").style.boxShadow="0px 0px 2px 1px red";
        pass_error = 0;
        disable_signup();
    } else {
        vanish("pass2_error");
        pass_error = 1;
        enable_signup();
        get("user_pass").style.boxShadow="none";
        get("user_pass2").style.boxShadow="none";
    }
}



function key() {
    //validat usernme 

}



function key2() {
    //validate password


}