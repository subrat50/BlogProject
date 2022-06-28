// ==+==+==+==+==+==+==+==+==+==[Imports]==+==+==+==+==+==+==+==+==+==

const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const { default: mongoose, isValidObjectId } = require("mongoose");

// ==+==+==+==[Validation Functions]==+==+==+==+=

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  if (typeof value === "string")
  return true;
};

const isvalidRequest=function(requestBody){
  return Object.keys(requestBody).length >0
}
const valid = function (value) {
  if(typeof value === "boolean") return true
}
const isValidAuthorId=function(ObjectId){
return  mongoose.Types.ObjectId.isValid(ObjectId)
}


// ==+==+==+==+==+==+==+==+==+==[Create Blogs]==+==+==+==+==+==+==+==+==+==

let createBlog = async function (req, res) {
  try {
    const requestBody=req.body
      if(!isvalidRequest(requestBody)){
        return res.status(400).send({status:false,msg:"invalid request parameter ,please provied blog detail"})
      }
    // let  {title,authorId,body,tags}= req.body;
    // if (!isValidBody(data)) return res.status(400).send({ status: false, msg: "please provide data to Create" })
    let { authorId, body, title, tags, category, subcategory } = requestBody

    if (!title) return res.status(400).send({ status: false, msg:"title Is required"});
    if (!isValid(title)) return res.status(400).send({ status: false, Error: "title is Invalid" })

    let Title = await blogModel.findOne({ title })

    if (Title) return res.status(400).send({ status: false, msg: "Title has been already used please choose diffrent" })


if (!isValid(authorId)) return res.status(400).send("Please provide Author Id");
    if(!isValidAuthorId(authorId)) return res.status(400).send({status:false,msg:`${authorId} is not valid authorId`})

    if (!body) return res.status(400).send("please write somthing in body");
    if (!isValid(body)) return res.status(400).send({ status: false, Error: "body cannot be number" })

    if (!tags) return res.status(400).send({status: false, msg:"tags Is required"});

    if (!category) return res.status(400).send({status: false, msg:"category Is required"});
    if (!isValid(category)) return res.status(400).send({ status: false, Error: "Category is Invalid" })

    if (!subcategory) return res.status(400).send({status: false, msg:"subcategory Is required"});
    
    const token = req.authorId
    if (token !== checkBlog.authorId.toString()) res.status(401).send({ status: false, msg: "unauthorised" });


    
    let savedData = await blogModel.create(requestBody);
    res.status(201).send({ status: true, data: savedData });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};
// ==+==+==+==+==+==+==+==+==+==[Get Blogs List]==+==+==+==+==+==+==+==+==+==

let getBlog = async function (req, res) {
  try {
    let filterBlog = req.query;
    if (!filterBlog) return res.status(404).send({ status: false, Error: "please set query" })
    let data = await blogModel.find({
      $and: [{ isDeleted: false, isPublished: true }, filterBlog],
    });
    if (data.length === 0) return res.status(404).send({ status: false, msg: "Blog not found! " });

    res.status(200).send({ status: true, msg: data });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

// ==+==+==+==+==+==+==+==+==+==[Update Blogs]==+==+==+==+==+==+==+==+==+==


const updateblogs = async function (req, res) {
  try {
    let data = req.body;
    let blogId = req.params.blogId;

    // if (!valid(data.isPublished))
    // return res.status(400).send({ status: false, msg: "isPublished Value should be true or false only" })

    if (!Object.keys(data).length) return res.status(400).send({ status: false, msg: "input can't be empty" });

    let checkBlog = await blogModel.findById(blogId);
  
    if (!checkBlog)
      return res.status(404).send({ status: false, msg: "Blog Not Found" });

    if (checkBlog.isDeleted == true)
      return res.status(400).send({ status: false, msg: "This blog is already Deleted" });

    let update = await blogModel.findByIdAndUpdate(blogId, { $push: { tags: data.tags, subcategory: data.subcategory }, title: data.title, body: data.body, isPublished: data.isPublished, publishedAt: Date() }, { new: true });

    res.status(200).send({ status: true, data: update });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// ==+==+==+==+==+==+==+==+==+==[ Delete Blogs By Id ]==+==+==+==+==+==+==+==+==+==

let deleteBlog = async (req, res) => {
  try {
    let blogId = req.params.blogId;
    // if(!isValidBody(blogId)) res.status(404).send({ status: false, msg: "blog id is required" });

    let blogData = await blogModel.findById(blogId);
    if(!blogData) res.status(404).send({ status: false, msg: "blog id is not Present" });

    if (blogData.isDeleted === true)
      return res.status(404).send({ status: false, msg: "blog is already deleted" });

    let deleteBlog = await blogModel.findOneAndUpdate(
      { _id: blogData },
      { isDeleted: true, deletedAt: Date() },
      { new: true }
    );
    res.status(200).send({ status: true, data: deleteBlog });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

// ==+==+==+==+==+==+==+==+==+==[ Delete Blogs By Query ]==+==+==+==+==+==+==+==+==+==

let deleteByQuery = async (req, res) => {
  try {
    let data = req.query;
    if (!isValidBody(data)) return res.status(400).send({ status: false, error: " please provide data inside query" })

    if (data.isDeleted === true)
      return res
        .status(404)
        .send({ status: false, msg: "blog is already deleted" });

    let deleteData = await blogModel.find(data).updateMany(
      { $and: [data] },
      { $set: { isDeleted: true, deletedAt: Date() } },
      { new: true }
    );

    res.status(200).send({ status: true, data: deleteData });

  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

// ==+==+==+==+==+==+==+==+==+==[ Exports ]==+==+==+==+==+==+==+==+==+==

module.exports.createBlog = createBlog;
module.exports.getBlog = getBlog;
module.exports.updateblogs = updateblogs;
module.exports.deleteBlog = deleteBlog;
module.exports.deleteByQuery = deleteByQuery;
