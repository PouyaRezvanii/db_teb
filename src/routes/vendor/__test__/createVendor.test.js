const request = require('supertest');
const app = require('../../../app');
const Vendor = require('../../../models/vendor');

// Mock کردن مدل Vendor
jest.mock('../../../models/vendor');

describe('POST /vendor/create', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });    

    it('returns 200 on successful vendor creation', async () => {
        // شبیه‌سازی موفقیت‌آمیز ذخیره‌سازی در دیتابیس
        Vendor.prototype.save.mockResolvedValueOnce({});

        const response = await request(app)
            .post('/vendor/create')
            .send({
                website: 'https://example.com',
                name: 'Test Vendor'
            })
            .expect(200);
        
        expect(response.body.message).toBe('فروشنده با موفقیت ایجاد شد.');
    });

    it('returns 400 if website is missing', async () => {
        const response = await request(app)
            .post('/vendor/create')
            .send({ name: 'Test Vendor' }) // بدون وب‌سایت
            .expect(400);

        expect(response.body.errors[0].message).toBe('آدرس وب‌سایت الزامی است.');
    });

    it('returns 400 if name is missing', async () => {
        const response = await request(app)
            .post('/vendor/create')
            .send({ website: 'https://example.com' }) // بدون نام فروشگاه
            .expect(400);

        expect(response.body.errors[0].message).toBe('نام فروشگاه الزامی است.');
    });

    it('returns 400 if website is too short', async () => {
        const response = await request(app)
            .post('/vendor/create')
            .send({ website: 'abc', name: 'Test Vendor' }) // وب‌سایت کمتر از 5 کاراکتر
            .expect(400);

        expect(response.body.errors[0].message).toBe('آدرس وب‌سایت باید بین ۵ تا ۱۰۰ کاراکتر باشد.');
    });

    it('returns 400 if website is too long', async () => {
        const longName = 'a'.repeat(101);
        const response = await request(app)
            .post('/vendor/create')
            .send({ website: longName, name: 'Test Vendor' }) // وب‌سایت بیشتر از 100 کاراکتر
            .expect(400);

        expect(response.body.errors[0].message).toBe('آدرس وب‌سایت باید بین ۵ تا ۱۰۰ کاراکتر باشد.');
    });

    it('returns 400 if name is too short', async () => {
        const response = await request(app)
            .post('/vendor/create')
            .send({ website: 'https://example.com', name: 'T' }) // نام کمتر از 3 کاراکتر
            .expect(400);

        expect(response.body.errors[0].message).toBe('نام فروشگاه باید بین ۳ تا ۵۰ کاراکتر باشد.');
    });

    it('returns 400 if website or name already exists', async () => {
        // شبیه‌سازی اینکه فروشنده با این نام یا وب‌سایت قبلاً وجود دارد
        Vendor.findOne.mockResolvedValueOnce({ website: 'https://example.com', name: 'Test Vendor' });

        const response = await request(app)
            .post('/vendor/create')
            .send({ website: 'https://example.com', name: 'Test Vendor' })
            .expect(400);

        expect(response.body.errors[0].message).toBe('وبسایت با این لینک یا نام وجود دارد.');
    });

    it('handles server errors gracefully', async () => {
        // شبیه‌سازی خطا در دیتابیس
        Vendor.prototype.save.mockRejectedValueOnce(new Error('Database error'));

        const response = await request(app)
            .post('/vendor/create')
            .send({ website: 'https://example.com', name: 'Test Vendor' })
            .expect(500);

        expect(response.body.errors[0].message).toBe('something went wrong');
    });
});
