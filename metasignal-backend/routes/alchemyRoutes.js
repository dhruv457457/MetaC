// routes/alchemyRoutes.js

const express = require("express");
const router = express.Router();

const {
  fetchAndCacheAlchemyTransfers,
} = require("../controllers/alchemyController");

router.get("/cache/:pair", fetchAndCacheAlchemyTransfers);

module.exports = router;
