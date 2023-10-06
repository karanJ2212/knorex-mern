const express = require("express");
const router = express.Router();

const { getAllUser, AddUser, DeleteUser } = require("../Controller/Controller");

router.route("/all").get(getAllUser);
router.route("/AddUser").post(AddUser);
router.route("/deleteUser/:id").delete(DeleteUser);

module.exports = router;
