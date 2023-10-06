const express = require("express");
const router = express.Router();

const {
  getAllUser,
  AddUser,
  DeleteUser,
  getSelectedUser,
} = require("../Controller/Controller");

router.route("/all").get(getAllUser);
router.route("/AddUser").post(AddUser);
router.route("/deleteUser/:id").delete(DeleteUser);

router.route("/getSelectedUser").post(getSelectedUser);

module.exports = router;
