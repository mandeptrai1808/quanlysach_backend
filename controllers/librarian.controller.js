const LIBRARIAN = require("../schemas/librarian.schema")
const bcrypt = require("../utils/bcrypt")
const jwt = require("../utils/jwt")

class LibrarianController {
    async login(req, res, next) {
        try {
            const {MSNV, MATKHAU} = req.body;
            console.log(MSNV, MATKHAU)
            if(!MSNV || !MATKHAU)
                return res.status(400).json({message: "Mã số nhân viên hoặc mật khẩu rỗng"})
            
            const librarian = await LIBRARIAN.findOne({MSNV});
            
            if (!librarian)
                return res.status(400).json({message: "Mã số nhân viên không tồn tại"});
            if (!bcrypt.comparePassword(librarian.MATKHAU, MATKHAU))
                return res.status(400).json({message: "Mật khẩu không chính xác"});
            console.log(librarian)
            const accessToken = jwt.sign({_id: librarian._id});
            res.json({accessToken});
        } catch (error) {
            next(error);
        }
    }

    async auth(req, res, next) {
        return res.json(req.user);
    }
}

module.exports = new LibrarianController()