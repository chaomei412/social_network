var width="";

function init_header()
{

    width=window.innerWidth;
    /*
    #
    mob_header_1
    mob_header_2
    mob_prof_pic 40*40
    mob_search
    mob_search_friend 65*37


    .
    mob_menu
    */


    get("mob_header_1").style.width=width+"px";


    get("mob_header_2").style.width=width+"px";

    get("mob_prof_pic").style.width="40px";
    get("mob_search_box").style.width=width-60+"px";

    get("mob_search").style.width=width-40-65+"px";

    get("mob_search_friend").style.width="65px";



    var q=document.getElementsByClassName("mob_menu");
    var mob_menu_width=parseInt(width/q.length);
    for (i=0;i<q.length;i++)
    {
        q[i].style.width=mob_menu_width+"px";
        q[i].style.display="inline-block";
        q[i].style.fontSize="25px";
        q[i].style.textAlign="center";
        
    }

    if(width>=720)
    {
        //desktop
        //hide .mobile

        get("body").style.marginTop="0px";
        /*
        current_open
        "login"
        current_open
        "signup"*/

        if(current_open=="login" || current_open=="signup")
        {
            get_class("mobile")[0].style.display="none";
            get_class("desktop")[0].style.display="block";
        }        
    }
    else
    {
        //mobile
        //hide .desktop
        get_class("mobile")[0].style.position="fixed";
        get_class("mobile")[0].style.top="0px";
        get("body").style.marginTop=get_class("mobile")[0].clientHeight+"px";

        if(current_open=="login" || current_open=="signup")
            get_class("mobile")[0].style.display="block";
       
    }
}
