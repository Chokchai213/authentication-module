const express = require('express');
const router = express.Router();
const secApiUtils = require("../utils/secApiUtils");

router.get('/get_lastest_nav',secApiUtils.getFundsLastestNav);

module.exports = router;