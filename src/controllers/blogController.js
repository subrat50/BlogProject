const authorModel = require("../models/authorModel")
const blogModel=require("../models/blogModel")

let createBlog=async function(req,res){
    try{
    let data= req.body
     let authorId=data.authorId
     if(!authorId) return res.status(401).send({status:false,msg:"author id require"})
    let authoreData=await authorModel.findById({_id: authorId})
    if(!authoreData)
     return res.status(400).send({status:false,msg: "invalid authore id"})
      
     let savedData=await blogModel.create(data)
     res.status(201).send({status:true,msg:savedData})
    }

    catch(err){
        console.log(err)
        res.status(500).send({status:false,msg:err.message})
    }
}

    let allBlogs=async function(req,res){
    let id=req.query.authorId;
    let catagory=req.query.category;
    let tag=req.query.tags;
    let sub=req.query.subcategory;
    let  alldata=await blogModel.find({"isDeleted":false,"isPublished":true})
    if(!alldata.length) return res.status(403).send({status:false,msg:"blog not found"})

    let findData=await blogModel.find({"isDeleted":false,"isPublished":true,$or:[{authorId:id} ,{catagory:catagory},{tags:tag},{subcategory:sub}]})
    if(findData.length==0) {
        return res.status(400).send({status:false,msg:"blogs not found"})
    }else{
        res.send({status:true,data:findData})
    }

}

module.exports.createBlog=createBlog
module.exports.allBlogs=allBlogs