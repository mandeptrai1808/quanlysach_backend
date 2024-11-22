const BOOK = require("../schemas/book.schema")
const CATEGORY = require("../schemas/category.schema")
const PUBLISHER = require("../schemas/publisher.schema");
const theodoimuonsach = require("../schemas/loanrecord.schema")
class BookController {
    constructor() {
        this.createBook = this.createBook.bind(this)
        this.listAllBooks = this.listAllBooks.bind(this)
        this.deleteBook = this.deleteBook.bind(this)
        this.updateBook = this.updateBook.bind(this)
        this.findBooksByName = this.findBooksByName.bind(this)
        this.findBooksByAuthor = this.findBooksByAuthor.bind(this)
        this.findBooksByCategory = this.findBooksByCategory.bind(this)
        this.find = this.find.bind(this)
    }
    async createBook(req, res, next) {
        try {
            const {
                TENSACH,
                THELOAI,
                TACGIA,
                NHAXUATBAN,
                NAMXUATBAN,
                SOQUYEN,
                DONGIA,
                HINHANH,
                MOTA
            } = req.body;

            // Kiểm tra thể loại tồn tại
            const category = await CATEGORY.findById(THELOAI);
            if (!category) {
                return res.status(400).json({
                    message: "Thể loại không tồn tại"
                });
            }

            // Kiểm tra nhà xuất bản tồn tại
            const publisher = await PUBLISHER.findById(NHAXUATBAN);
            if (!publisher) {
                return res.status(400).json({
                    message: "Nhà xuất bản không tồn tại"
                });
            }

            // Tạo sách mới
            const newBook = await BOOK.create({
                TENSACH,
                THELOAI,
                TACGIA,
                NHAXUATBAN,
                NAMXUATBAN,
                SOQUYEN,
                DONGIA,
                HINHANH,
                MOTA
            });

            // Populate thông tin thể loại và nhà xuất bản trước khi trả về
            const populatedBook = await BOOK.findById(newBook._id)
                .populate('THELOAI')
                .populate('NHAXUATBAN');

            res.json({
                message: "Sách mới đã được thêm",
                data: populatedBook
            });

        } catch (error) {
            next(error);
        }
    }

    async getBookInfor(req, res, next) {
        try {
            const id = req.params.id
            const book = await BOOK.findById(id).populate('THELOAI').populate('NHAXUATBAN')
            return res.json(book)
        } catch (error) {

        }
    }

    async listAllBooks(req, res, next) {
        try {
            // Tìm tất cả các sách trong cơ sở dữ liệu
            const allBooks = await BOOK.find().populate('THELOAI').populate('NHAXUATBAN');

            // // Kiểm tra nếu không có sách nào được tìm thấy
            // if (allBooks.length === 0) {
            //     return res.status(404).json({ message: 'Không có sách nào trong cơ sở dữ liệu.' });
            // }

            // Trả về danh sách các sách
            res.json(allBooks);
        } catch (error) {
            next(error);
        }
    }

    async findBooksByName(req, res, next) {
        try {
            const { TENSACH } = req.body;

            // Tìm sách theo tên sách chứa chuỗi tìm kiếm
            const foundBooks = await BOOK.find({ TENSACH: { $regex: TENSACH, $options: 'i' } }).populate('THELOAI').populate('NHAXUATBAN');

            if (foundBooks.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy sách.' });
            }

            res.json(foundBooks);
        } catch (error) {
            next(error);
        }
    }

    async findBooksByAuthor(req, res, next) {
        try {
            const { TACGIA } = req.body;

            // Tìm sách theo tên sách chứa chuỗi tìm kiếm
            const foundBooks = await BOOK.find({ TACGIA: { $regex: TACGIA, $options: 'i' } }).populate('THELOAI').populate('NHAXUATBAN');

            if (foundBooks.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy sách.' });
            }

            res.json(foundBooks);
        } catch (error) {
            next(error);
        }
    }

    async findBooksByCategory(req, res, next) {
        try {
            const { TENTHELOAI } = req.body;

            // Tìm sách theo tên sách chứa chuỗi tìm kiếm
            const foundCategory = await CATEGORY.findOne({ TENTHELOAI: TENTHELOAI });

            if (!foundCategory) {
                return res.status(404).json({ message: 'Không tìm thấy thể loại này.' });
            }

            const foundBooks = await BOOK.find({ THELOAI: foundCategory._id }).populate('THELOAI').populate('NHAXUATBAN');

            if (foundBooks.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy sách.' });
            }

            res.json(foundBooks);
        } catch (error) {
            next(error);
        }
    }

    async find(req, res, next) {
        try {
            const { type } = req.params;
            if (type == 'name') {
                await this.findBooksByName(req, res, next)
            }
            else if (type == "author") {
                await this.findBooksByAuthor(req, res, next)
            }
            else if (type == "cate") {
                await this.findBooksByCategory(req, res, next)
            }
        } catch (error) {
            next(error);
        }
    }

    async deleteBook(req, res, next) {
        try {
            const { id } = req.params;
            console.log(id)
            // Kiểm tra xem sách có tồn tại hay không
            const book = await BOOK.findById(id);
            if (!book) {
                return res.status(400).json({ message: 'Sách không tồn tại.' });
            }

            const loans = await theodoimuonsach.find({SACH: id})
            for (let index = 0; index < loans.length; index++) {
                await theodoimuonsach.findByIdAndDelete(loans[index].id)
            }

            // Nếu sách tồn tại, thực hiện xóa
            await BOOK.findByIdAndDelete(id);

            res.json({ message: 'Sách đã được xóa thành công.' });
        } catch (error) {
            next(error);
        }
    }

    async updateBook(req, res, next) {
        try {
            const {
                _id,
                TENSACH,
                THELOAI,
                DONGIA,
                SOQUYEN,
                NAMXUATBAN,
                NHAXUATBAN,
                TACGIA,
                MOTA,
                HINHANH
            } = req.body;
            // const { id } = req.params;
            const updateData = req.body;

            // Kiểm tra xem sách có tồn tại hay không
            let book = await BOOK.findById(_id);
            if (!book) {
                return res.status(400).json({ message: 'Sách không tồn tại.' });
            }

            // Cập nhật thông tin sách
            book = await BOOK.findByIdAndUpdate(_id, {
                TENSACH: TENSACH,
                THELOAI: THELOAI,
                DONGIA: DONGIA,
                SOQUYEN: SOQUYEN,
                NAMXUATBAN: NAMXUATBAN,
                NHAXUATBAN: NHAXUATBAN,
                TACGIA: TACGIA,
                MOTA: MOTA,
                HINHANH: HINHANH,
            });

            res.json({ message: 'Thông tin sách đã được cập nhật thành công.'});
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new BookController()