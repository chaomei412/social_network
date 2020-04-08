import pymongo
myclient = pymongo.MongoClient('mongodb://localhost:27017/')
mydb = myclient['social_network']
clasify = mydb["post_category"]
posts=mydb["post"]

while(True):
    x=clasify.find_one({})
    if(not x):
        continue
    post_id=x["id"]
    print("post_id",post_id)


    #clasify.find_one_and_delete({"_id":post_id})

    test=x["content"]
    print("classify post content:",test)

    print("using id :"+ str(post_id)+ " modifing post of id: "+str(posts.find_one({"_id":post_id})))
    break
