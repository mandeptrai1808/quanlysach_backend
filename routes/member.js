const route = require("express").Router();
const MemberController = require("../controllers/member.controller")
const auth = require("../middleware/auth.middleware")

route.route("/:type").post(MemberController.handleLoginOrRegister);
// route.route("/register").post(MemberController.register);
route.route("/").get(auth.authMember, MemberController.auth);
route.route("/all").get( async (req, res, next) => {
    try {
        const members = await require("../schemas/member.schema").find(); // Lấy toàn bộ member từ DB
        res.json(members);
    } catch (error) {
        next(error);
    }
});

route.route("/:_id")
    .put(MemberController.updateMember);  // Cập nhật thông tin

route.route("/:_id/password")
    .put(auth.authMember, MemberController.changePassword);  // Đổi mật khẩu

route.route("/:id")
    .delete(MemberController.deleteMember);

module.exports = route;