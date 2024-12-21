const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("User Route");
  console.log("/User Route!");
});

module.exports = router;
