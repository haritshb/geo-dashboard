const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({
    status: "ok",
    version: "v1",
    uptime: process.uptime(),
  });
});

module.exports = router;
