const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");

// =========[ Create Blogs]============

let createBlog = async function (req, res) {
  try {
    let data = req.body;

    let authorId = data.authorId;
    if (!authorId) return res.status(404).send("Author Id Is requaired");

    let authorData = await authorModel.findById(authorId);
    if (!authorData) return res.status(404).send("Invalid Author Id");

    let savedData = await blogModel.create(data);
    res.status(201).send({ status: true, data: savedData });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};
// ================[ get Blogs]============

let getBlog = async function (req, res) {
  
  let data = await blogModel.find({ isDeleted: false, isPublished: true })
  if (!data.length) return res.status(403).send({ status: false, msg: "not found" })
  let category = req.query.category
  let tag = req.query.tags
  let id = req.query.authorId
  let sub = req.query.subCategory
  // let filter={}
  // if(authorId){
  //   filter.Id=authorId
  // }
  // if(category){
  //   filter.
  // }

  let blogs = await blogModel.find({ isDeleted: false, isPublished: true,$and: [{authorId: id},{tags:tag},{subcategory:sub},{catagory:category}] })
  if (blogs.length == 0) {
   return res.status(404).send({ status: false, msg: "not found" })
  } else {
    res.send({ status: true, msg: blogs })
  }

};


// =====================[ delete Blogs]=====================
let deleteById = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    if(!blogId){
      return res.status(400).send({status:false,msg:"please send blogid"})
    }
    const validId=await blogModel.findById(blogId)
    if(!validId){
      return res.status(404).send({status:false,msg:"please enter valid id"})
    }
    //const isDeleted=await blogModel.findById(blogId)
    if(validId.isDeleted=== true)
    return res.status(404).send({status:false,msg:"already deleted"})
    const time=Date()
    const update={isDeleted:true,deletedAt:time}
    // const data=req.body
    const savedData=await blogModel.findOneAndUpdate({_id:blogId},update,{new:true})

    return res.status(200).send({ status: true, msg:savedData });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};
let deleteBlogs=async function(req,res){
  try{
    const blogId = req.params.blogId;
    if(!blogId){
      return res.status(400).send({status:false,msg:"please send blogid"})
    }
    let category=req.query.category
    let tag = req.query.tags
    let subcategory =req.query.subcategory 
    let authorid=req.query.authorid
    let validId=await blogModel.find(blogId)
    // if(!validId){
    //   return res.status(404).send({status:false,msg:"blog doesnot exsit"})
    

     
  }catch(err){
    console.log(err)
    res.status(500).send({status:false,msg:"server error"})
  }
}



module.exports.createBlog = createBlog;
module.exports.deleteById = deleteById;
module.exports.getBlog = getBlog;
module.exports.deleteBlogs = deleteBlogs;
