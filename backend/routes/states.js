const express = require("express");
const stateModel = require("../models/stateModel");

const statesController = require("../controllers/states");

const router = express.Router();

/**initializeData to mongoDB */
router.get("/initializeData",statesController.initializeData)


module.exports = router;
