const request = require('supertest');
const app = require('../../../app'); // Path to your Express app
const Product = require('../../../models/product');
const fs = require('fs');
const path = require('path');
const BadRequestError = require('../../../common/errors/bad-request-error'); // Mock if needed

jest.mock('../../../models/product');
jest.mock('fs');
jest.mock('../../../common/errors/bad-request-error');

describe('POST /update/:productId', () => {
  let mockProduct;

  beforeEach(() => {
    mockProduct = {
      _id: '123',
      name: 'Old Product',
      description: 'Old Description',
      price: 10,
      image: 'old.jpg',
      productUrl: 'old.com',
      categories: ['Old'],
      vendor: 'Old Vendor',
    };
    Product.findById.mockResolvedValue(mockProduct);
    fs.existsSync.mockReturnValue(true); // Mock file existence
    fs.unlinkSync.mockClear(); // Clear mock calls before each test
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update the product with new data and image', async () => {
    const updatedProductData = {
      name: 'New Product',
      description: 'New Description',
      price: 20,
      productUrl: 'new.com',
      categories: ['New'],
      vendor: 'New Vendor',
    };

    Product.findByIdAndUpdate.mockResolvedValue({ ...mockProduct, ...updatedProductData, image: 'new.jpg' });

    const response = await request(app)
      .post('/update/123')
      .field('name', updatedProductData.name)
      .field('description', updatedProductData.description)
      .field('price', updatedProductData.price)
      .field('productUrl', updatedProductData.productUrl)
      .field('categories', updatedProductData.categories)
      .field('vendor', updatedProductData.vendor)
      .attach('image', Buffer.from('new image content'), { filename: 'new.jpg', contentType: 'image/jpeg' })
      .expect(200);

    expect(Product.findById).toHaveBeenCalledWith('123');
    expect(fs.existsSync).toHaveBeenCalledWith(expect.stringContaining('old.jpg'));
    expect(fs.unlinkSync).toHaveBeenCalledWith(expect.stringContaining('old.jpg'));
    expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(
      '123',
      { ...updatedProductData, image: 'new.jpg' },
      { new: true, runValidators: true }
    );
    expect(response.body.updatedProduct).toEqual({ ...mockProduct, ...updatedProductData, image: 'new.jpg' });
  });


  it('should update the product without changing the image', async () => {
    const updatedProductData = {
      name: 'New Product',
      description: 'New Description',
      price: 20,
      productUrl: 'new.com',
      categories: ['New'],
      vendor: 'New Vendor',
    };

    Product.findByIdAndUpdate.mockResolvedValue({ ...mockProduct, ...updatedProductData });

    const response = await request(app)
      .post('/update/123')
      .field('name', updatedProductData.name)
      .field('description', updatedProductData.description)
      .field('price', updatedProductData.price)
      .field('productUrl', updatedProductData.productUrl)
      .field('categories', updatedProductData.categories)
      .field('vendor', updatedProductData.vendor)
      .expect(200);

    expect(Product.findById).toHaveBeenCalledWith('123');
    expect(fs.existsSync).not.toHaveBeenCalled(); // Image not changed
    expect(fs.unlinkSync).not.toHaveBeenCalled(); // Image not changed
    expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(
      '123',
      { ...updatedProductData, image: mockProduct.image }, // Old image used
      { new: true, runValidators: true }
    );
    expect(response.body.updatedProduct).toEqual({ ...mockProduct, ...updatedProductData });
  });

  it('should handle product not found', async () => {
    Product.findById.mockResolvedValue(null);
    const mockBadRequestError = new BadRequestError('محصول پیدا نشد.');
    BadRequestError.mockImplementation(() => mockBadRequestError);

    const response = await request(app)
      .post('/update/123')
      .expect(400);

    expect(Product.findById).toHaveBeenCalledWith('123');
    expect(response.body.message).toBe('محصول پیدا نشد.');
  });

  it('should handle errors during update', async () => {
    const error = new Error('Database error');
    Product.findByIdAndUpdate.mockRejectedValue(error);

    const response = await request(app)
      .post('/update/123')
      .expect(500);

    expect(Product.findById).toHaveBeenCalledWith('123');
    expect(Product.findByIdAndUpdate).toHaveBeenCalled();
    expect(response.body.message).toBe('something went wrong'); // Or your error message
  });

    it('should handle image deletion error', async () => {
      fs.unlinkSync.mockImplementation(() => { throw new Error('Image deletion failed'); });
      const updatedProductData = {
        name: 'New Product',
        description: 'New Description',
        price: 20,
        productUrl: 'new.com',
        categories: ['New'],
        vendor: 'New Vendor',
      };
  
      Product.findByIdAndUpdate.mockResolvedValue({ ...mockProduct, ...updatedProductData, image: 'new.jpg' });
  
      const response = await request(app)
        .post('/update/123')
        .field('name', updatedProductData.name)
        .field('description', updatedProductData.description)
        .field('price', updatedProductData.price)
        .field('productUrl', updatedProductData.productUrl)
        .field('categories', updatedProductData.categories)
        .field('vendor', updatedProductData.vendor)
        .attach('image', Buffer.from('new image content'), { filename: 'new.jpg', contentType: 'image/jpeg' })
        .expect(500);
  
      expect(Product.findById).toHaveBeenCalledWith('123');
      expect(fs.existsSync).toHaveBeenCalledWith(expect.stringContaining('old.jpg'));
      expect(fs.unlinkSync).toHaveBeenCalledWith(expect.stringContaining('old.jpg'));
      expect(response.body.message).toBe('something went wrong'); // Or your error message
    });
});