const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");

// =========[ Create Blogs]============

let createBlog = async function (req, res) {
  try {
    let data = req.body;
    
    let title = data.title;
    if (!title) return res.status(400).send("title Is required");
    if(!title== Number) return res.status(400).send("title must be valid")

    let authorId = data.authorId;
    if (!authorId) return res.status(400).send("Author Id Is required");


    let authorData = await authorModel.findById(authorId);
    if (!authorData) return res.status(404).send("Invalid Author Id");

    let body = data.body;
    if (!body) return res.status(400).send("body Is required");
    if(body==String) return res.status(400).send("invalid body")
    if(body===Number) return res.status(400).send("bhuu")

    let tags = data.tags;
    if (!tags) return res.status(400).send("tags Is required");

    let category = data.category;
    if (!category) return res.status(400).send("category Is required");

    let subcategory = data.subcategory;
    if (!subcategory) return res.status(400).send("subcategory Is required");

    let savedData = await blogModel.create(data);
    res.status(201).send({status: true,data: savedData,});

  } catch (err) {
    res.status(500).send({status: false,msg: err.message,});
  }
};

// ================[ get Blogs]============

let getBlog = async function (req, res) {
  try{
  let filterBlog = req.query
  let data = await blogModel.find({ $and: [{ isDeleted: false, isPublished: true }, filterBlog] })
  if (!data) return res.status(404).send({status: false , msg: "not found"})
  
  res.status(200).send({status: true,msg: data,});
}
catch (err) {
  res.status(500).send({ status: false, msg: err.message, });
}
}

// ===================[ update blogs]================

let updateblogs = async (req, res) => {
  try {
    let blogsId = req.params.blogId;
    if (!blogsId) return res.status(400).send("Blog Id Is requaired");

    // -----------------check blog id is valid or not
    let blogData = await blogModel.findById(blogsId);
    if (!blogData) return res.status(404).send("Invalid blog Id");

    // ------------check isDeleted = false
    if (blogData.isDeleted === true)
      return res.status(404).send({ status: false, msg: "blog is not published" })

    let data = req.body;
    let updatedBlog = await blogModel.findOneAndUpdate({ _id: blogsId, }, data, { new: true });

    if (updatedBlog.isPublished == false) {
      res.status(200).send({ status: true, data: updatedBlog, });
    } else {
      updatedBlog.publishedAt = Date()
      res.status(200).send({ status: true, data: updatedBlog, });
    }

  }
  catch (err) {
    res.status(500).send({ status: false, msg: err.message, });
  }
};


// =====================[ delete Blogs by blog ID]=====================
let deleteApi = async (req, res) => {
  try {
    let blogId = req.params.blogId
    // -----------------check blog id is valid or not
    let blogData = await blogModel.findById(blogId);
    if (!blogData) return res.status(404).send("Invalid blog Id");

    if (blogData.isDeleted === true)
      return res.status(404).send({ status: false, msg: "blog is already deleted" });

    let deleteBlog = await blogModel.findOneAndUpdate(
      { _id: blogData, },
      { isDeleted: true, deletedAt: Date(), },
      { new: true, }
    )
    res.status(200).send({ status: true, data: deleteBlog });
  }
  catch (err) {
    res.status(500).send({ status: false, msg: err.message, });
  }
};


// =========================[ delete Blogs by Query Params]=======================

let deleteByParam = async (req, res) => {
  try {
    let deleteData = req.query 
    let updatedUser = await blogModel.updateMany(
      {$and: [deleteData]},
      {$set: {isDeleted: true, deletedAt: Date()}},
      {new: true}
    )
    res.status(201).send({ status: true, data: updatedUser });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};



// ===============================================================

module.exports.createBlog = createBlog;
module.exports.getBlog = getBlog;
module.exports.updateblogs = updateblogs;
module.exports.deleteApi = deleteApi;
module.exports.deleteByParam = deleteByParam
