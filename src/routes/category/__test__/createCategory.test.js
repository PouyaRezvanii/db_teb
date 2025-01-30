const request = require('supertest');
const app = require('../../../app');
const Category = require('../../../models/category');

// Mock کردن مدل Category
jest.mock('../../../models/category');

describe('POST /category/create', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });    
    
    it('returns 200 on successful create category', async () => {
        // شبیه‌سازی موفقیت‌آمیز ذخیره‌سازی در دیتابیس
        Category.prototype.save.mockResolvedValueOnce({});

        const response = await request(app)
            .post('/category/create')
            .send({
                catName: 'test'
            })
            .expect(200);
        expect(response.body.message).toBe('دسته‌بندی با موفقیت ایجاد شد.');

    });

    it('returns 400 if catName is missing', async () => {
        const response = await request(app)
            .post('/category/create')
            .send({})
            .expect(400);

        expect(response.body.errors[0].message).toBe('نام دسته‌بندی الزامی است.');
    });

    it('returns 400 if catName is too short', async () => {
        const response = await request(app)
            .post('/category/create')
            .send({ catName: 'te' }) // کمتر از 3 کاراکتر
            .expect(400);

        expect(response.body.errors[0].message).toBe('نام دسته‌بندی باید بین ۳ تا ۳۰ کاراکتر باشد.');
    });

    it('returns 400 if catName is too long', async () => {
        const longName = 'a'.repeat(31); // بیشتر از 30 کاراکتر
        const response = await request(app)
            .post('/category/create')
            .send({ catName: longName })
            .expect(400);

        expect(response.body.errors[0].message).toBe('نام دسته‌بندی باید بین ۳ تا ۳۰ کاراکتر باشد.');
    });

    it('returns 400 if category with the same name already exists', async () => {
        // شبیه‌سازی اینکه دسته‌بندی با همان نام وجود دارد
        Category.findOne.mockResolvedValueOnce({ catName: 'test' });

        const response = await request(app)
            .post('/category/create')
            .send({ catName: 'test' })
            .expect(400);

        expect(response.body.errors[0].message).toBe('دسته‌بندی با این نام وجود دارد.');
    });

    it('handles server errors gracefully', async () => {
        // شبیه‌سازی خطا در دیتابیس
        Category.prototype.save.mockRejectedValueOnce(new Error('Database error'));

        const response = await request(app)
            .post('/category/create')
            .send({ catName: 'test' })
            .expect(500);

        expect(response.body.errors[0].message).toBe('something went wrong');
    });
});






// const request = require('supertest');
// const app = require('../../../app')
// const Category = require('../../../models/category')

// describe('POST /category/create', () => {

//     it('returns 200 on successfull create category', async () => {
//         await request(app)
//             .post('/category/create')
//             .send({
//                 catName: "test"
//             })
//             .expect(200)
        
//     })

//     it('returns 400 if catName is missing', async () => {
//         const response = await request(app)
//             .post('/category/create')
//             .send({})
//             .expect(400);

//         expect(response.body.errors[0].message).toBe('نام دسته‌بندی الزامی است.');
//     });

//     it('returns 400 if catName is too short', async () => {
//         const response = await request(app)
//             .post('/category/create')
//             .send({ catName: 'te' }) // کمتر از 3 کاراکتر
//             .expect(400);

//         expect(response.body.errors[0].message).toBe('نام دسته‌بندی باید بین ۳ تا ۳۰ کاراکتر باشد.');
//     });

//     it('returns 400 if catName is too long', async () => {
//         const longName = 'a'.repeat(31); // بیشتر از 30 کاراکتر
//         const response = await request(app)
//             .post('/category/create')
//             .send({ catName: longName })
//             .expect(400);

//         expect(response.body.errors[0].message).toBe('نام دسته‌بندی باید بین ۳ تا ۳۰ کاراکتر باشد.');
//     });

//     it('returns 400 if category with the same name already exists', async () => {
//         // ایجاد دسته‌بندی اولیه
//         const category = new Category({ catName: 'test' });
//         await category.save();

//         // تلاش برای ایجاد دسته‌بندی با همان نام
//         const response = await request(app)
//             .post('/category/create')
//             .send({ catName: 'test' })
//             .expect(400);

//         expect(response.body.errors[0].message).toBe('دسته‌بندی با این نام وجود دارد.');
//     });

//     it('handles server errors gracefully', async () => {
//         // شبیه‌سازی خطا در دیتابیس
//         jest.spyOn(Category.prototype, 'save').mockImplementationOnce(() => {
//             throw new Error('Database error');
//         });

//         const response = await request(app)
//             .post('/category/create')
//             .send({ catName: 'test' })
//             .expect(500);

//         expect(response.body.errors[0].message).toBe('something went wrong');
//     });
// })