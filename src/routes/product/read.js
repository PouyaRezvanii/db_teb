const express = require('express')
const Product = require('../../models/product');
const BadRequestError = require('../../common/errors/bad-request-error');
const NotFoundError = require('../../common/errors/not-found-error');

const router = express.Router();

router.get('/all', async(req, res, next) => {

    try {
        
        const products = await Product.find()

        if(!products || products.length === 0){
            return next(new NotFoundError('محصولی وجود ندارد'))
        }

        res.status(200).json({
            products: products
        })

    } catch (error) {
        next(error)
    }

})

router.get('/:productId', async(req, res, next) => {
    
    try {
        const { productId } = req.params;

        const product = await Product.findById(productId);
        if(!product || product.length === 0){
            return next(new NotFoundError('محصول یافت نشد'))
        }

        res.status(200).json({
            product: product
        })
    } catch (error) {
        next(error)
    }

})

module.exports = router;