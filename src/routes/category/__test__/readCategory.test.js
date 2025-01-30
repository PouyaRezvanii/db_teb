const request = require('supertest');
const app = require('../../../app');
const Category = require('../../../models/category');

// Mock کردن مدل Category
jest.mock('../../../models/category');

describe('GET /category/all', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('returns 200 with all categories', async () => {
        const mockCategories = [{ catName: 'Test1' }, { catName: 'Test2' }];
        Category.find.mockResolvedValueOnce(mockCategories);

        const response = await request(app)
            .get('/category/all')
            .expect(200);

        expect(response.body.categories).toEqual(mockCategories);
    });

    it('returns 404 if no categories found', async () => {
        Category.find.mockResolvedValueOnce([]);

        const response = await request(app)
            .get('/category/all')
            .expect(404);

        expect(response.body.errors[0].message).toBe('هیچ دسته‌بندی‌ای پیدا نشد.');
    });

    it('handles server errors gracefully', async () => {
        Category.find.mockRejectedValueOnce(new Error('Database error'));

        const response = await request(app)
            .get('/category/all')
            .expect(500);

        expect(response.body.errors[0].message).toBe('something went wrong');
    });
});
