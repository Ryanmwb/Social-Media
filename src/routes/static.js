const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
    res.send("Welcome to Social-Media app");
});

router.get("/marco", (req, res, next) => {
    res.send("polo");
});
  
module.exports = router;