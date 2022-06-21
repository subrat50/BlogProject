const express = require('express');
const router = express.Router();
const blogController=require("../controllers/blogController")
const authorController=require("../controllers/authorController")

router.post("/blogs",blogController.createBlog)
 router.post("/authors", authorController.createAuthor)
 router.get("/blogs",blogController.allBlogs)


module.exports = router;