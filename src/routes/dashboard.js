
var express = require("express");
var router = express.Router();

var dashboardController = require("../controllers/dashboardController");

router.get("/indicadores", function (req, res) {
    dashboardController.buscarIndicadores(req, res);
});

module.exports = router;
