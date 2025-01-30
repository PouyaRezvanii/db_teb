const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../app');
const Vendor = require('../../../models/vendor');

// Mock کردن مدل Vendor
jest.mock('../../../models/vendor');

describe('POST /vendor/update/:vId', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('returns 200 on successful vendor update', async () => {
        const vendorId = new mongoose.Types.ObjectId().toHexString();

        // شبیه‌سازی اینکه فروشنده در دیتابیس موجود است و آپدیت موفقیت‌آمیز انجام می‌شود
        Vendor.findByIdAndUpdate.mockResolvedValueOnce({
            _id: vendorId,
            website: 'https://updated-website.com',
            name: 'Updated Vendor'
        });

        const response = await request(app)
            .post(`/vendor/update/${vendorId}`)
            .send({
                website: 'https://updated-website.com',
                name: 'Updated Vendor'
            })
            .expect(200);

        expect(response.body.updatedVendor.website).toBe('https://updated-website.com');
        expect(response.body.updatedVendor.name).toBe('Updated Vendor');
    });

    it('returns 400 if vendor ID is invalid', async () => {
        const invalidId = '12345'; // یک شناسه نامعتبر

        Vendor.findByIdAndUpdate.mockResolvedValueOnce(null);

        const response = await request(app)
            .post(`/vendor/update/${invalidId}`)
            .send({
                website: 'https://valid-website.com',
                name: 'Valid Vendor'
            })
            .expect(400);

        expect(response.body.errors[0].message).toBe('فروشنده پیدا نشد.');
    });

    it('returns 400 if website is missing', async () => {
        const vendorId = new mongoose.Types.ObjectId().toHexString();

        const response = await request(app)
            .post(`/vendor/update/${vendorId}`)
            .send({
                name: 'Valid Vendor'
            })
            .expect(400);

        expect(response.body.errors[0].message).toBe('آدرس وب‌سایت الزامی است.');
    });

    it('returns 400 if name is missing', async () => {
        const vendorId = new mongoose.Types.ObjectId().toHexString();

        const response = await request(app)
            .post(`/vendor/update/${vendorId}`)
            .send({
                website: 'https://valid-website.com'
            })
            .expect(400);

        expect(response.body.errors[0].message).toBe('نام فروشنده الزامی است.');
    });

    it('returns 400 if website is not a valid URL', async () => {
        const vendorId = new mongoose.Types.ObjectId().toHexString();

        const response = await request(app)
            .post(`/vendor/update/${vendorId}`)
            .send({
                website: 'invalid-url',
                name: 'Valid Vendor'
            })
            .expect(400);

        expect(response.body.errors[0].message).toBe('آدرس وب‌سایت باید یک URL معتبر باشد.');
    });

    it('returns 400 if name is too short', async () => {
        const vendorId = new mongoose.Types.ObjectId().toHexString();

        const response = await request(app)
            .post(`/vendor/update/${vendorId}`)
            .send({
                website: 'https://valid-website.com',
                name: 'ab' // کمتر از ۳ کاراکتر
            })
            .expect(400);

        expect(response.body.errors[0].message).toBe('نام فروشنده باید بین ۳ تا ۵۰ کاراکتر باشد.');
    });

    it('returns 400 if name is too long', async () => {
        const vendorId = new mongoose.Types.ObjectId().toHexString();
        const longName = 'a'.repeat(51); // بیشتر از ۵۰ کاراکتر

        const response = await request(app)
            .post(`/vendor/update/${vendorId}`)
            .send({
                website: 'https://valid-website.com',
                name: longName
            })
            .expect(400);

        expect(response.body.errors[0].message).toBe('نام فروشنده باید بین ۳ تا ۵۰ کاراکتر باشد.');
    });

    it('handles server errors gracefully', async () => {
        const vendorId = new mongoose.Types.ObjectId().toHexString();

        // شبیه‌سازی خطا در دیتابیس
        Vendor.findByIdAndUpdate.mockRejectedValueOnce(new Error('Database error'));

        const response = await request(app)
            .post(`/vendor/update/${vendorId}`)
            .send({
                website: 'https://valid-website.com',
                name: 'Valid Vendor'
            })
            .expect(500);

        expect(response.body.errors[0].message).toBe('something went wrong');
    });

});
