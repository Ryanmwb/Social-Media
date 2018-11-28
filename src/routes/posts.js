const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");

router.get("/topics/:topicId/posts/new", postController.new);
router.post("/topics/:topicId/posts/create", postController.create);
router.get("/topics/:topicId/posts/:postId", postController.show);
router.post("/topics/:topicId/posts/:postId/destroy", postController.destroy);
router.get("/topics/:topicId/posts/:postId/edit", postController.edit);
router.post("/topics/:topicId/posts/:postId/update", postController.update);


module.exports = router;