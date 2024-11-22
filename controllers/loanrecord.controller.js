const theodoimuonsach = require("../schemas/loanrecord.schema")
const BOOK = require = require("../schemas/book.schema")
class LoanRecordController {
    async loanBook(req, res, next) {
        try {
            const { MADOCGIA, MASACH, NGAYMUON, NGAYTRA } = req.body;
            console.log("sach", MASACH)
            // Kiểm tra sách có tồn tại không
            let book = await BOOK.findById(MASACH);
            if (!book) {
                return res.status(404).json({
                    message: "Không tìm thấy sách này trong hệ thống!"
                });
            }

            // Kiểm tra số lượng sách
            if (book.SOQUYEN == 0) {
                return res.status(400).json({
                    message: "Số lượng sách còn lại bằng 0, không thể mượn!"
                });
            }

            // Kiểm tra người dùng đã mượn sách này chưa
            const existingLoan = await theodoimuonsach.findOne({
                DOCGIA: MADOCGIA, 
                SACH: MASACH,
                TRANGTHAI: { $ne: 2 }  // Không phải trạng thái đã trả
            });

            if (existingLoan) {
                return res.status(400).json({
                    message: "Bạn đang mượn hoặc chờ xác nhận quyển sách này!"
                });
            }

            // Tạo phiếu mượn mới
            const newLoan = await theodoimuonsach.create({
                DOCGIA: MADOCGIA,
                SACH: MASACH,
                NGAYMUON,
                NGAYTRA,
                TRANGTHAI: 0
            });

            // Giảm số lượng sách
            book.SOQUYEN -= 1;
            await BOOK.findByIdAndUpdate(MASACH, book);

            res.json({
                message: "Đã tạo phiếu mượn sách, vui lòng chờ xác nhận!",
                data: newLoan
            });
        } catch (error) {
            next(error);
        }
    }

    async getLoanRecordById(req, res, next) {
        try {
            const today = new Date()
            const { id } = req.params;
            console.log("id ne " + id)
            const loanRecords = await theodoimuonsach.find({ DOCGIA: id }).populate('DOCGIA').populate('SACH')
            console.log(loanRecords)
            for (let index = 0; index < loanRecords.length; index++) {
                // const element = array[index];
                if (today > loanRecords[index].NGAYTRA) {
                    const tmp = loanRecords[index]
                    tmp.TRANGTHAI = 3
                    await theodoimuonsach.findByIdAndUpdate(tmp.id, tmp)
                }
            }
            const newLoanRecords = theodoimuonsach.find({ DOCGIA: id }).populate('DOCGIA').populate('SACH')
            console.log(newLoanRecords)
            res.json(loanRecords.reverse())

        } catch (error) {

        }
    }

    async getAllLoanRecord(req, res, next) {
        try {
            const today = new Date()
            const loadRecords = await theodoimuonsach.find().populate('DOCGIA').populate('SACH')
            for (let index = 0; index < loadRecords.length; index++) {
                // const element = array[index];
                if (today > loadRecords[index].NGAYTRA) {
                    const tmp = loadRecords[index]
                    tmp.TRANGTHAI = 3
                    await theodoimuonsach.findByIdAndUpdate(tmp.id, tmp)
                }
            }
            const newLoanRecords = await theodoimuonsach.find().populate('DOCGIA').populate('SACH')
            res.json(newLoanRecords.reverse())
        } catch (error) {

        }
    }

    async updateStatusLoanRecord(req, res, next) {
        const {
            _id,
            TRANGTHAI
        } = req.body;

        let loanRecord = await theodoimuonsach.findById(_id);
        if (!loanRecord) {
            return res.status(404).json({ message: 'Phiếu mượn không tồn tại.' });
        }
        loanRecord.TRANGTHAI = TRANGTHAI;
        loanRecord = await theodoimuonsach.findByIdAndUpdate(_id, loanRecord);
        if (TRANGTHAI == 2) {
            console.log("cong them nè")
            let book = await BOOK.findById(loanRecord.SACH)
            book.SOQUYEN = book.SOQUYEN + 1
            await BOOK.findByIdAndUpdate(loanRecord.SACH, book)
        }
        res.json({ message: 'Thông tin phiếu đã được cập nhật thành công.' });

    }
}

module.exports = new LoanRecordController()