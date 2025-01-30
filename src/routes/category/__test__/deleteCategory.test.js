const request = require('supertest');
const app = require('../../../app');
const Category = require('../../../models/category');

jest.mock('../../../models/category');

describe('DELETE /category/delete/:catId', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('returns 200 on successful category deletion', async () => {
        const mockCategory = { _id: '123', catName: 'Test Category' };
        Category.findByIdAndDelete.mockResolvedValueOnce(mockCategory);

        const response = await request(app)
            .delete('/category/delete/123')
            .expect(200);

        expect(response.body.message).toBe('دسته‌بندی با موفقیت حذف شد.');
        expect(response.body.deletedCategory).toEqual(mockCategory);
    });

    it('returns 400 if category does not exist', async () => {
        Category.findByIdAndDelete.mockResolvedValueOnce(null);

        const response = await request(app)
            .delete('/category/delete/123')
            .expect(400);

        expect(response.body.errors[0].message).toBe('دسته‌بندی پیدا نشد.');
    });

    it('handles server errors gracefully', async () => {
        Category.findByIdAndDelete.mockRejectedValueOnce(new Error('Database error'));

        const response = await request(app)
            .delete('/category/delete/123')
            .expect(500);

        expect(response.body.errors[0].message).toBe('something went wrong');
    });
});
