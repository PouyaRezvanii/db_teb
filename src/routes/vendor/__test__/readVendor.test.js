const request = require('supertest');
const app = require('../../../app');
const Vendor = require('../../../models/vendor');

jest.mock('../../../models/vendor');

describe('GET /vendor/all', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('returns 404 if no vendors exist', async () => {
        Vendor.find.mockResolvedValueOnce([]);

        const response = await request(app)
            .get('/vendor/all')
            .expect(404);

        expect(response.body.errors[0].message).toBe('فروشنده ای وجود ندارد');
    });

    it('returns 200 with a list of vendors', async () => {
        const vendors = [
            { _id: '1', name: 'Vendor1', website: 'https://vendor1.com' },
            { _id: '2', name: 'Vendor2', website: 'https://vendor2.com' }
        ];
        Vendor.find.mockResolvedValueOnce(vendors);

        const response = await request(app)
            .get('/vendor/all')
            .expect(200);

        expect(response.body.vendors.length).toBe(2);
        expect(response.body.vendors[0].name).toBe('Vendor1');
    });

    it('handles server errors gracefully', async () => {
        Vendor.find.mockRejectedValueOnce(new Error('Database error'));

        const response = await request(app)
            .get('/vendor/all')
            .expect(500);

        expect(response.body.errors[0].message).toBe('something went wrong');
    });

});
