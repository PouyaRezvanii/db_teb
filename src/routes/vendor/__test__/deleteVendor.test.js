const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../app');
const Vendor = require('../../../models/vendor');
const Product = require('../../../models/product');

jest.mock('../../../models/vendor');
jest.mock('../../../models/product');

describe('DELETE /vendor/delete/:vId', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('returns 400 if vendor ID is invalid', async () => {
        const invalidId = '12345';

        const response = await request(app)
            .delete(`/vendor/delete/${invalidId}`)
            .expect(400);

        expect(response.body.errors[0].message).toBe('شناسه فروشنده نامعتبر است.');
    });

    it('returns 400 if vendor does not exist', async () => {
        Vendor.findByIdAndDelete.mockResolvedValueOnce(null);

        const validId = new mongoose.Types.ObjectId().toHexString();
        const response = await request(app)
            .delete(`/vendor/delete/${validId}`)
            .expect(400);

        expect(response.body.errors[0].message).toBe('فروشنده یافت نشد');
    });

    it('returns 200 on successful vendor deletion', async () => {
        Vendor.findByIdAndDelete.mockResolvedValueOnce({ _id: 'vendor123' });
        Product.deleteMany.mockResolvedValueOnce({ deletedCount: 5 });

        const validId = new mongoose.Types.ObjectId().toHexString();
        const response = await request(app)
            .delete(`/vendor/delete/${validId}`)
            .expect(200);

        expect(response.body.message).toBe('فروشنده و محصولات مرتبط با آن با موفقیت حذف شدند.');
        expect(response.body.deletedProducts).toBe(5);
    });

    it('handles server errors gracefully', async () => {
        Vendor.findByIdAndDelete.mockRejectedValueOnce(new Error('Database error'));

        const validId = new mongoose.Types.ObjectId().toHexString();
        const response = await request(app)
            .delete(`/vendor/delete/${validId}`)
            .expect(500);

        expect(response.body.errors[0].message).toBe('something went wrong');
    });

});
