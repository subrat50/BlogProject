const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const authorController= require("../controller/authorController")
const blogController= require("../controller/blogController")
=======
const authorController = require("../controllers/authorController");
const blogController = require("../controllers/blogController");
>>>>>>> fd8eb98c58edfecf34944996dc27ec5594ca1985

router.post("/authors", authorController.createAuthor);

<<<<<<< HEAD
router.post("/authors", authorController.createAuthor)
router.post("/blogs", blogController.createBlog)
router.get("/blogs", blogController.getBlog)
router.delete("/blogs/:blogId", blogController.deleteById)
router.delete("/blogs", blogController.deleteBlogs)
=======
router.post("/blogs", blogController.createBlog);

router.get("/blogs", blogController.getBlog);
>>>>>>> fd8eb98c58edfecf34944996dc27ec5594ca1985

router.put("/blogs/:blogId", blogController.updateblogs);

router.delete("/blogs/:blogId", blogController.deleteApi);

router.delete("/blogs", blogController.deleteByParam);

module.exports = router;
