const request = require('supertest');
const app = require('../../../app'); // Path to your Express app
const Product = require('../../../models/product');
const NotFoundError = require('../../../common/errors/not-found-error');

jest.mock('../../../models/product');
jest.mock('../../../common/errors/not-found-error');

describe('GET /all', () => {
  it('should return all products', async () => {
    const mockProducts = [
      { name: 'Product 1', price: 10, categories: ['Electronics'] },
      { name: 'Product 2', price: 20, categories: ['Books'] },
    ];
    Product.find.mockResolvedValue(mockProducts);

    const response = await request(app)
      .get('/product/all')
      .expect(200);

    expect(Product.find).toHaveBeenCalledWith({});
    expect(response.body.products).toEqual(mockProducts);
  });

  it('should filter by category', async () => {
    const mockProducts = [{ name: 'Product 1', price: 10, categories: ['Electronics'] }];
    Product.find.mockResolvedValue(mockProducts);

    const response = await request(app)
      .get('/product/all?category=Electronics')
      .expect(200);

    expect(Product.find).toHaveBeenCalledWith({ categories: 'Electronics' });
    expect(response.body.products).toEqual(mockProducts);
  });

  it('should filter by search term (case-insensitive)', async () => {
    const mockProducts = [{ name: 'Product 1', price: 10, categories: ['Electronics'] }];
    Product.find.mockResolvedValue(mockProducts);

    const response = await request(app)
      .get('/product/all?search=product') // Search term in lowercase
      .expect(200);

    expect(Product.find).toHaveBeenCalledWith({ name: { $regex: 'product', $options: 'i' } });
    expect(response.body.products).toEqual(mockProducts);

    const response2 = await request(app)
        .get('/product/all?search=Product') // Search term in uppercase
        .expect(200);

    expect(Product.find).toHaveBeenCalledWith({ name: { $regex: 'Product', $options: 'i' } });
    expect(response2.body.products).toEqual(mockProducts);

  });

  it('should sort by price (ascending)', async () => {
    const mockProducts = [
      { name: 'Product 1', price: 10 },
      { name: 'Product 2', price: 20 },
    ];
    Product.find.mockResolvedValue(mockProducts);

    const response = await request(app)
      .get('/product/all?sortPrice=asc')
      .expect(200);

    expect(Product.find).toHaveBeenCalledWith({}); // Filter is empty
    expect(Product.find().sort).toHaveBeenCalledWith({ price: 1 }); // Check the sort call
    expect(response.body.products).toEqual(mockProducts);
  });

  it('should sort by price (descending)', async () => {
    const mockProducts = [
      { name: 'Product 2', price: 20 },
      { name: 'Product 1', price: 10 },
    ];
    Product.find.mockResolvedValue(mockProducts);

    const response = await request(app)
      .get('/product/all?sortPrice=desc')
      .expect(200);

    expect(Product.find).toHaveBeenCalledWith({});
    expect(Product.find().sort).toHaveBeenCalledWith({ price: -1 });
    expect(response.body.products).toEqual(mockProducts);
  });

  it('should return 404 if no products are found', async () => {
    Product.find.mockResolvedValue([]);
    const mockNotFoundError = new NotFoundError('محصولی وجود ندارد');
    NotFoundError.mockImplementation(() => mockNotFoundError);

    const response = await request(app)
      .get('/product/all')
      .expect(404);

    expect(Product.find).toHaveBeenCalledWith({});
    expect(response.body.message).toBe('محصولی وجود ندارد'); // Or the message from your NotFoundError
  });

    it('should handle errors', async () => {
      const mockError = new Error('Database error');
      Product.find.mockRejectedValue(mockError);

      const response = await request(app)
        .get('/product/all')
        .expect(500); // Or your error handler's status code

      expect(Product.find).toHaveBeenCalledWith({});
      expect(response.body.message).toBe('something went wrong'); // Or your error handler's message
    });
});