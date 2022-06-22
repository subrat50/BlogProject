const express = require('express');
const router = express.Router();
const authorController= require("../controller/authorController")
const blogController= require("../controller/blogController")


router.post("/authors", authorController.createAuthor)
router.post("/blogs", blogController.createBlog)
router.get("/blogs", blogController.getBlog)
router.delete("/blogs/:blogId", blogController.deleteById)
router.delete("/blogs", blogController.deleteBlogs)

module.exports = router;