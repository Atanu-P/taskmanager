const router = require("express").Router();

router.use(`/api/v1/users`, require("./v1/userRoutes"));
router.use(`/api/v1/tasks`, require("./v1/taskRoutes"));

router.use(`/api`, (req, res) => {
  console.log("API Version 1");
  res.status(200);
  res.json({
    statusCode: 200,
    message: "Task manager API",
    success: true,
  });
});
module.exports = router;
