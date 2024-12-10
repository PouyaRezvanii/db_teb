const Diet = require('../../models/diet')
const express = require('express')

const router = express.Router();

router.delete('/delete/:dietId', async(req, res, next) => {

    try {

        const { dietId } = req.params;
    
        const deletedDiet = await Diet.findByIdAndDelete(dietId);
    
        if (!deletedDiet) {
            return next(new BadRequestError('رژیم پیدا نشد.'));
        }
    
        res.status(200).json({
            message: 'رژیم با موفقیت حذف شد.',
            deletedDiet
        });       
    
    } catch (error) {
        next(error)
    }
    

})

module.exports = router;