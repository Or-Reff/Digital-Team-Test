const express = require("express");

const statesController = require("../controllers/states");

const router = express.Router();

router.get("/data", statesController.getData);

module.exports = router;
