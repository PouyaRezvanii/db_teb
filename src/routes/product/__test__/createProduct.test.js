const request = require('supertest');
const app = require('../../../app');
const Product = require('../../../models/product');
const multer = require('multer');

jest.mock('../../../models/product');

const upload = multer({ dest: 'uploads/' });

describe('POST /product/create', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('returns 200 on successful product creation', async () => {
        Product.prototype.save.mockResolvedValueOnce({});

        const response = await request(app)
            .post('/product/create')
            .field('name', 'Test Product')
            .field('description', 'This is a test product.')
            .field('price', '99.99')
            .field('productUrl', 'https://example.com/product')
            .field('categories', ['Electronics'])
            .field('vendor', 'Vendor123')
            .attach('image', Buffer.from('test image'), { filename: 'test.jpg', contentType: 'image/jpeg' })
            .expect(200);

        expect(response.body.message).toBe('محصول با موفقیت ایجاد شد.');
    });

    it('returns 400 if name is missing', async () => {
        const response = await request(app)
            .post('/product/create')
            .field('description', 'This is a test product.')
            .field('price', '99.99')
            .field('productUrl', 'https://example.com/product')
            .field('categories', ['Electronics'])
            .field('vendor', 'Vendor123')
            .expect(400);

        expect(response.body.errors[0].message).toBe('نام محصول الزامی است.');
    });

    it('returns 400 if price is negative', async () => {
        const response = await request(app)
            .post('/product/create')
            .field('name', 'Test Product')
            .field('description', 'This is a test product.')
            .field('price', '-10')
            .field('productUrl', 'https://example.com/product')
            .field('categories', ['Electronics'])
            .field('vendor', 'Vendor123')
            .expect(400);

        expect(response.body.errors[0].message).toBe('قیمت محصول باید یک عدد مثبت باشد.');
    });

    it('returns 400 if product URL is missing', async () => {
        const response = await request(app)
            .post('/product/create')
            .field('name', 'Test Product')
            .field('description', 'This is a test product.')
            .field('price', '99.99')
            .field('categories', ['Electronics'])
            .field('vendor', 'Vendor123')
            .expect(400);

        expect(response.body.errors[0].message).toBe('آدرس محصول الزامی است.');
    });

    it('returns 400 if categories are missing', async () => {
        const response = await request(app)
            .post('/product/create')
            .field('name', 'Test Product')
            .field('description', 'This is a test product.')
            .field('price', '99.99')
            .field('productUrl', 'https://example.com/product')
            .field('vendor', 'Vendor123')
            .expect(400);

        expect(response.body.errors[0].message).toBe('دسته‌بندی‌ها نمی‌توانند خالی باشند.');
    });

    it('returns 500 if there is a server error', async () => {
        Product.prototype.save.mockRejectedValueOnce(new Error('Database error'));

        const response = await request(app)
            .post('/product/create')
            .field('name', 'Test Product')
            .field('description', 'This is a test product.')
            .field('price', '99.99')
            .field('productUrl', 'https://example.com/product')
            .field('categories', ['Electronics'])
            .field('vendor', 'Vendor123')
            .expect(500);

        expect(response.body.errors[0].message).toBe('something went wrong');
    });
});