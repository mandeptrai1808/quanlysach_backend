const jwt = require("../utils/jwt")
const LIBRARIAN = require("../schemas/librarian.schema")
const MEMBER = require("../schemas/member.schema")

const authLibrarian = async (req, res, next) => {
	try {
        const token = req.headers.authorization?.split(" ")[1];
		if (!token)
            return res.status(400).json({message: "Tai khoan chua dang nhap tren he thong"});

        const decodeUser = jwt.decode(token);

		if (!decodeUser) {
			return res.status(400).json({message: "Tai khoan chua dang nhap tren he thong"});
		}

		const existUser = await LIBRARIAN.findById(decodeUser._id);

		if (!existUser) {
			return res.status(400).json({message: "Tai khoan chua dang nhap tren he thong"});
		}
        req.user = existUser;
        next();
	} catch (error) {
		next(error);
	}
};

const authMember = async (req, res, next) => {
	try {
        const authHeader = req.headers.authorization;
		console.log(authHeader)
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: "Tai khoan chua dang nhap tren he thong"
            });
        }

        const token = authHeader.split(' ')[1];
        const verifiedUser = jwt.verify(token);
        
        if (!verifiedUser) {
            return res.status(401).json({
                message: "Token khong hop le hoac da het han"
            });
        }

        const existUser = await MEMBER.findById(verifiedUser._id);
        if (!existUser) {
            return res.status(404).json({
                message: "Khong tim thay nguoi dung"
            });
        }

        req.user = existUser;
        next();
    } catch (error) {
        next(error);
    }
};
module.exports = {authLibrarian, authMember}

