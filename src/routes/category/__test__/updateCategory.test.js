const request = require('supertest');
const app = require('../../../app');
const Category = require('../../../models/category');

jest.mock('../../../models/category');

describe('POST /category/update/:catId', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('returns 200 on successful category update', async () => {
        const updatedCategory = { _id: '123', catName: 'Updated Category' };
        Category.findByIdAndUpdate.mockResolvedValueOnce(updatedCategory);

        const response = await request(app)
            .post('/category/update/123')
            .send({ catName: 'Updated Category' })
            .expect(200);

        expect(response.body.updatedCategory).toEqual(updatedCategory);
    });

    it('returns 400 if category does not exist', async () => {
        Category.findByIdAndUpdate.mockResolvedValueOnce(null);

        const response = await request(app)
            .post('/category/update/123')
            .send({ catName: 'Updated Category' })
            .expect(400);

        expect(response.body.errors[0].message).toBe('دسته‌بندی پیدا نشد.');
    });

    it('returns 400 if catName is long', async () => {
        const longName = 'a'.repeat(31); // بیشتر از 30 کاراکتر
        const response = await request(app)
            .post('/category/update/123')
            .send({ catName: longName })
            .expect(400);

        expect(response.body.errors[0].message).toBe('نام دسته‌بندی باید بین ۳ تا ۳۰ کاراکتر باشد.');
    });

    it('returns 400 if catName is short', async () => {
        const response = await request(app)
            .post('/category/update/123')
            .send({ catName: 'a' }) // کمتر از حد مجاز
            .expect(400);

        expect(response.body.errors[0].message).toBe('نام دسته‌بندی باید بین ۳ تا ۳۰ کاراکتر باشد.');
    });

    it('handles server errors gracefully', async () => {
        Category.findByIdAndUpdate.mockRejectedValueOnce(new Error('Database error'));

        const response = await request(app)
            .post('/category/update/123')
            .send({ catName: 'Updated Category' })
            .expect(500);

        expect(response.body.errors[0].message).toBe('something went wrong');
    });
});