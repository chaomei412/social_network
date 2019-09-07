function search()
{
	var crf=document.getElementsByName("csrfmiddlewaretoken")[0].value;
	var query=valueof("search");
	var fd=new FormData();
	fd.append("csrfmiddlewaretoken",crf);
	fd.append("query",query);
	xhr("/find_friend","post",fd,search_friend,0);
}
function search_friend(data)
{
	data=JSON.parse(data);
	console.log(data);
}