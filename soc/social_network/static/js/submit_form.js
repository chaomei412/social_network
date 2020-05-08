var new_post_old_date=-1;
function is_blanck(id)
{
//check is value of input is empty
if(valueof(id)==="")
{
            tost("blanck fields not allowed",5,"red");finish_loading();
        return 1;
    }
if(valueof(id)===" ")
    {
                    tost("blanck fields not allowed",5,"red");finish_loading();
        return 1;
}
if(valueof(id)===null)
    {
                    tost("blanck fields not allowed",5,"red");finish_loading();
                    return 1;
    }
return 0;
}
function Func_it () 
{
    new_post_old_date=-1;
    loading();
    console.log("please wait publishing your post");
    tost("please wait publishing your post",15,"green");

    var formdata=new FormData();
    
    
    if(is_blanck("post_name"))
                return 0;
    formdata.append("title",valueof("post_name"));

    if(valueof("type")==="other")
        {
            if(is_blanck("other_type"))
                return 0;
            formdata.append("cat2",valueof("other_type"));
        
        }
    else
    {
        if(is_blanck("type"))
        return 0;
        formdata.append("cat",valueof("type"));
        
    }
    
        if(sessionStorage.getItem("post_cont")===""||sessionStorage.getItem("post_cont")===null)
        {
                        tost("blanck fields not allowed",5,"red");finish_loading();
                return 0;
        }
        formdata.append("cont",sessionStorage.getItem("post_cont"));


var xhr=new XMLHttpRequest();

xhr.onreadystatechange=function()
{
    
    if(this.readyState === 4 && this.status === 200)
    {
          if(current_open!==9)
                    return 0;
                try
                {
                var x=JSON.parse(this.responseText);
                if(x[0]===1)
                {
                    tost("publish post successfully",4,"green");
                    new_post_old_date=x[1];
                    document.getElementById("post_action").removeAttribute("onclick");
                    document.getElementById("post_action").setAttribute("onclick","Func_it2()");
                    document.getElementById("post_action").innerHTML="update";
                        get_catagories();
                }
                else
                    tost("Error occure while posting",4,"red");
            }
            catch(e)
            {
                tost("Error occure while posting",10,"red");
            }
    
    finish_loading();
    }
    
};
xhr.open("POST","/new/save");
xhr.send(formdata);
}



function Func_it2()
{
    
	//update post  send data to    /update/save

    loading();
    
    console.log("please wait updating your post");
 tost("please wait updating your post",10,"green");

    var formdata=new FormData();
    
    
    if(is_blanck("post_name"))
                return 0;
    formdata.append("title",valueof("post_name"));

    if(valueof("type")==="other")
        {
            if(is_blanck("other_type"))
                return 0;
            formdata.append("cat2",valueof("other_type"));
        }
    else
    {
        if(is_blanck("type"))
        return 0;
        formdata.append("cat",valueof("type"));
        
    }
    
        if(sessionStorage.getItem("post_cont")===""||sessionStorage.getItem("post_cont")===null)
        {
                        tost("blanck fields not allowed",5,"red");finish_loading();
                return 0;
            }
        formdata.append("cont",sessionStorage.getItem("post_cont"));
        
        formdata.append("id",new_post_old_date);
    var xhr=new XMLHttpRequest();

    xhr.onreadystatechange=function()
{
    
                  console.log("check 0");
    if(this.readyState === 4 && this.status === 200)
    {
        console.log(this.responseText);
                      console.log("check 1");
          if(current_open===9||current_open===7)
          {       
                try
                {
                var x=JSON.parse(this.responseText);
                if(x[0]===1)
                {
                    /* successfully updated */
                                  console.log("check 4");
                    
                    new_post_old_date=x[1];
                    tost("update post successfully",10,"green");
                        get_catagories();
                }
                else if(x[0]===2)
                {
                                  console.log("check 5");
                    /* needs to login */
                        is_login(function temp(){Func_it2();},1,1,1);
                }
                else if(x[0]===3)
                {
                    /* post not found */
                    tost("this post no longer available in server trying to re-submit",10,"red");
                     Func_it();
                }
                else
                {
                    /* some error occcure */
                    tost("Error occure while updating",10,"red");
                }
            }
           catch(e)
            {
                tost("Error occure while posting",10,"red");
            }
            finish_loading();
          }
    }
};
xhr.open("POST","/update/save");
xhr.send(formdata);
}