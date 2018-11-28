const express = require("express");
const router = express.Router();

const flairController = require("../controllers/flairController");

router.get("/posts/:postId/flairs/new", flairController.new);
router.post("/posts/:postId/flairs/create", flairController.create);
router.get("/posts/:postId/flairs/:flairId", flairController.show);
router.post("/posts/:postId/flairs/:flairId/destroy", flairController.destroy);
router.get("/posts/:postId/flairs/:flairId/edit", flairController.edit);
router.post("/posts/:postId/flairs/:flairId/update", flairController.update);

module.exports = router;