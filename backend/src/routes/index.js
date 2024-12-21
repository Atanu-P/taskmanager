const router = require("express").Router();

router.use(`/api/v1`, (req, res, next) => {
  console.log("API Version 1");
  next();
});

router.use(`/api/v1/users`, require("./v1/userRoutes"));
router.use(`/api/v1/tasks`, require("./v1/taskRoutes"));

module.exports = router;
