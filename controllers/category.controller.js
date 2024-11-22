const CATEGORY = require("../schemas/category.schema")
const BOOK = require("../schemas/book.schema")
const theodoimuonsach = require("../schemas/loanrecord.schema")

class CategoryController {
    async createCategory(req, res, next) {
        try {
            const { MATHELOAI, TENTHELOAI } = req.body;
            console.log(MATHELOAI, TENTHELOAI)
            // Tạo thể loại mới

            const foundCategory = await CATEGORY.findOne({MATHELOAI: MATHELOAI})

            if(foundCategory){
                return res.status(400).json({message: "Mã thể loại đã tồn tại."})
            }

            const foundCategoryName = await CATEGORY.findOne({TENTHELOAI: TENTHELOAI})

            if(foundCategoryName){
                return res.status(400).json({message: "Tên thể loại đã tồn tại"})
            }

            const newCategory = await CATEGORY.create({
                MATHELOAI: MATHELOAI,
                TENTHELOAI: TENTHELOAI
            });

            console.log(newCategory)

            res.json({message: "Thể loại mới đã được tạo"});
        } catch (error) {
            next(error);
        }
    }
    async getAllCategory(req, res, next){
        try {
            const category = await CATEGORY.find()
            res.json(category)
        } catch (error) {
            next(error)
        }
    }

    async updateCategory(req, res, next){
        try {
            const {_id, MATHELOAI, TENTHELOAI} = req.body;
            console.log(_id)
            let category = await CATEGORY.findById(_id);
            if(!category){
                return res.status(400).json({ message: 'Thể loại không tồn tại.' });
            }
            category = await CATEGORY.findByIdAndUpdate(_id, {MATHELOAI:MATHELOAI, TENTHELOAI:TENTHELOAI})
            res.json({message: "Thể loại đã được cập nhật"});
        } catch (error) {
            next(error)
        }
    }

    async deleteCategory(req, res, next){
        try {
            const { id } = req.params;
            console.log("id nè ba: " + id)
            let category = await CATEGORY.findById(id);
            if(!category){
                return res.status(404).json({ message: 'Thể loại không tồn tại.' });
            }

            const foundBooks = await BOOK.find({ THELOAI: category.id });
            console.log(foundBooks.length)
            for (let index = 0; index < foundBooks.length; index++) {
                // const element = array[index];
                console.log(foundBooks[index].TENSACH)
                
                const loans = await theodoimuonsach.find({SACH: foundBooks[index].id})
                for (let j = 0; j < loans.length; j++) {
                    await theodoimuonsach.findByIdAndDelete(loans[j].id)
                }
    
                await BOOK.findByIdAndDelete(foundBooks[index].id);


            }
            // for (let b in foundBooks){
            //     console.log(b.TENSACH)
            //     await BOOK.findByIdAndDelete(b.id);
            // }

            category = await CATEGORY.findByIdAndDelete(id)
            res.json({message: "Thể loại đã được xóa"});
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new CategoryController()