const MEMBER = require("../schemas/member.schema")
const bcrypt = require("../utils/bcrypt")
const jwt = require("../utils/jwt")

class MemberController {
    constructor() {
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.handleLoginOrRegister = this.handleLoginOrRegister.bind(this);
        this.auth = this.auth.bind(this);
        this.updateMember = this.updateMember.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.deleteMember = this.deleteMember.bind(this);
    }
    async register(req, res, next) {
        console.log("Đây nè")
        try {
            const {
                MADOCGIA,
                MATKHAU, 
                HOLOT, 
                TEN, 
                NGAYSINH, 
                PHAI, 
                DIACHI, 
                SODIENTHOAI
            } = req.body;
            
            console.log(HOLOT)

            const member = await MEMBER.findOne({MADOCGIA});
            
            if (member)
                return res.status(400).json({message: "Mã độc giả đã tồn tại"});
            
            const newMember = await MEMBER.create({
                MADOCGIA: MADOCGIA,
                MATKHAU: bcrypt.hashPassword(MATKHAU),
                HOLOT: HOLOT,
                TEN: TEN,
                NGAYSINH: NGAYSINH,
                PHAI: PHAI,
                DIACHI: DIACHI,
                SODIENTHOAI: SODIENTHOAI
            }) 
            // console.log(newDocGia)
            
            const accessToken = jwt.sign({_id: newMember._id});
            res.json({accessToken});
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const {MADOCGIA, MATKHAU} = req.body;
            
            // Tìm member và loại bỏ trường MATKHAU khỏi kết quả
            const member = await MEMBER.findOne({MADOCGIA}).select('-MATKHAU');
            
            if (!member)
                return res.status(400).json({message: "Mã độc giả không tồn tại"});
            
            // Lấy lại member có password để check
            const memberWithPassword = await MEMBER.findOne({MADOCGIA});
            if (!bcrypt.comparePassword(memberWithPassword.MATKHAU, MATKHAU))
                return res.status(400).json({message: "Mật khẩu không chính xác"});

            const accessToken = jwt.sign({_id: member._id});
            
            // Trả về cả token và thông tin người dùng
            res.json({
                accessToken,
                user: member
            });
        } catch (error) {
            next(error);
        }
    }

    async handleLoginOrRegister(req, res, next) {
        try {
            const { type } = req.params;
            if (type == 'reg'){
                await this.register(req, res, next)
            }
            else if (type == 'log'){
                await this.login(req, res, next)
            }
        } catch (error) {
            next(error);
        }
    }

    async auth(req, res, next) {
        return res.json(req.user);
    }

    async updateMember(req, res, next) {
        try {
            const { _id } = req.params;
            const { HOLOT, TEN, NGAYSINH, PHAI, DIACHI, SODIENTHOAI } = req.body;

            // Kiểm tra member có tồn tại không
            let member = await MEMBER.findById(_id);
            if (!member) {
                return res.status(404).json({ 
                    message: 'Không tìm thấy thành viên.' 
                });
            }

            // Cập nhật thông tin
            const updatedMember = await MEMBER.findByIdAndUpdate(
                _id, 
                {
                    HOLOT,
                    TEN,
                    NGAYSINH,
                    PHAI,
                    DIACHI,
                    SODIENTHOAI
                },
                { new: true }  // Trả về dữ liệu sau khi update
            ).select('-MATKHAU'); // Không trả về mật khẩu

            res.json({
                message: "Cập nhật thông tin thành công",
                user: updatedMember
            });
        } catch (error) {
            next(error);
        }
    }

    // Thêm API đổi mật khẩu riêng
    async changePassword(req, res, next) {
        try {
            const { _id } = req.params;
            const { MATKHAU_CU, MATKHAU_MOI } = req.body;

            // Kiểm tra member có tồn tại không
            const member = await MEMBER.findById(_id);
            if (!member) {
                return res.status(404).json({ 
                    message: 'Không tìm thấy thành viên.' 
                });
            }

            // Kiểm tra mật khẩu cũ
            if (!bcrypt.comparePassword(member.MATKHAU, MATKHAU_CU)) {
                return res.status(400).json({ 
                    message: 'Mật khẩu cũ không chính xác.' 
                });
            }

            // Cập nhật mật khẩu mới
            const hashedPassword = bcrypt.hashPassword(MATKHAU_MOI);
            await MEMBER.findByIdAndUpdate(_id, { 
                MATKHAU: hashedPassword 
            });

            res.json({ 
                message: "Đổi mật khẩu thành công" 
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteMember(req, res, next) {
        try {
            const { id } = req.params;

            // Kiểm tra member có tồn tại không
            const member = await MEMBER.findById(id);
            if (!member) {
                return res.status(404).json({
                    message: "Không tìm thấy thành viên"
                });
            }

            // Kiểm tra member có đang mượn sách không
            const existingLoan = await MEMBER.findOne({
                DOCGIA: id,
                TRANGTHAI: { $ne: 2 }  // Trạng thái khác 2 (chưa trả sách)
            });

            if (existingLoan) {
                return res.status(400).json({
                    message: "Không thể xóa thành viên đang mượn sách"
                });
            }

            // Xóa tất cả lịch sử mượn sách của thành viên
            await MEMBER.deleteMany({ DOCGIA: id });

            // Xóa thành viên
            await MEMBER.findByIdAndDelete(id);

            res.json({
                message: "Đã xóa thành viên thành công"
            });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new MemberController()