const express = require("express");
const router = express.Router();
const { body, param, query } = require('express-validator');
const sortingController = require("../controllers/sortingController");



// /Homie?sorting=mostRecent
// /Homie?sorting=lowToHigh
// /Homie?sorting=highToLow


router.route(`/Homie`)
    .get(sortingController.sortUnit)



// router.route(`/Homie/mostRecent`)
//     .get(sortingController.sortUnitByDate)


// router.route(`/Homie/lowToHigh`)
//     .get(sortingController.sortFromlowToHigh)




// router.route(`/Homie/highToLow`)
//     .get(sortingController.sortFromHighToLow)










module.exports = router;