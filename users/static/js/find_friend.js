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
	var temp="";
	if(data.length==0)
		temp+='<div class="search_result">No Sugestion found</div>';
	for(let i=0;i<data.length;i++)
	{
		console.log(data[i][0]+" "+data[i][1]);
		let name=data[i][0]+" "+data[i][1];
		temp+='<div class="search_result">'+name+'</div>';
	}
	insert("search_result",temp);
}