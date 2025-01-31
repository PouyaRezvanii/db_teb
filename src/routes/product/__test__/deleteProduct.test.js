const request = require('supertest');
const app = require('../../../app'); // Path to your Express app
const Product = require('../../../models/product'); // Path to your Product model
const fs = require('fs'); // For cleanup

jest.mock('../../../models/product');
jest.mock('fs'); // Mock fs for file operations

describe('DELETE /delete/:productId', () => {
  let mockProduct;

  beforeEach(() => {
    mockProduct = { _id: '123', image: 'test.jpg' };
    Product.findById.mockResolvedValue(mockProduct);
    fs.existsSync.mockReturnValue(true); // Mock that the file exists
    fs.unlinkSync.mockClear(); // Clear mock calls before each test
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Clean up any potentially created files (if your test creates any)
    // const imagePath = path.join(__dirname, '../../uploads/', 'test.jpg');
    // if (fs.existsSync(imagePath)) { fs.unlinkSync(imagePath); }
  });

  it('should delete the product and image successfully', async () => {
    Product.findByIdAndDelete.mockResolvedValue(mockProduct);

    const response = await request(app)
      .delete('/delete/123')
      .expect(200);

    expect(Product.findById).toHaveBeenCalledWith('123');
    expect(fs.existsSync).toHaveBeenCalledWith(expect.stringContaining('test.jpg')); // More flexible check
    expect(fs.unlinkSync).toHaveBeenCalledWith(expect.stringContaining('test.jpg'));
    expect(Product.findByIdAndDelete).toHaveBeenCalledWith('123');
    expect(response.body.message).toBe('محصول با موفقیت حذف شد.');
    expect(response.body.product).toEqual(mockProduct);
  });

  it('should return 404 if product is not found', async () => {
    Product.findById.mockResolvedValue(null);

    const response = await request(app)
      .delete('/delete/123')
      .expect(404);  // Expect a 404 Not Found

    expect(Product.findById).toHaveBeenCalledWith('123');
    expect(response.body.message).toBe('محصول یافت نشد.'); // Assuming your NotFoundError sets this message
  });

  it('should handle image deletion error', async () => {
    fs.unlinkSync.mockImplementation(() => { throw new Error('Image deletion failed'); });

    const response = await request(app)
      .delete('/delete/123')
      .expect(500); // Or whatever status code your error handler uses

    expect(Product.findById).toHaveBeenCalledWith('123');
    expect(fs.existsSync).toHaveBeenCalledWith(expect.stringContaining('test.jpg'));
    expect(fs.unlinkSync).toHaveBeenCalledWith(expect.stringContaining('test.jpg'));
    expect(response.body.message).toBe('something went wrong'); // Or your specific error message
  });

  it('should handle database error', async () => {
    Product.findById.mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .delete('/delete/123')
      .expect(500); // Or your specific error handler status code

    expect(Product.findById).toHaveBeenCalledWith('123');
    expect(response.body.message).toBe('something went wrong'); // Or your specific error message
  });

  it('should not delete image if it does not exist', async () => {
      fs.existsSync.mockReturnValue(false);
      Product.findByIdAndDelete.mockResolvedValue(mockProduct);

      const response = await request(app)
        .delete('/delete/123')
        .expect(200);

      expect(Product.findById).toHaveBeenCalledWith('123');
      expect(fs.existsSync).toHaveBeenCalledWith(expect.stringContaining('test.jpg'));
      expect(fs.unlinkSync).not.toHaveBeenCalled(); // Should not be called
      expect(Product.findByIdAndDelete).toHaveBeenCalledWith('123');
      expect(response.body.message).toBe('محصول با موفقیت حذف شد.');
      expect(response.body.product).toEqual(mockProduct);
    });
});